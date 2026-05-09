const Booking = require('../models/Booking.model');
const Service = require('../models/Service.model');
const Vendor = require('../models/Vendor.model');
const Customer = require('../models/Customer.model');
const { validationResult } = require('express-validator');
const { sendBookingNotification } = require('../utils/email.util');
const { sendBookingSMS } = require('../utils/otp.util');

const normalizeLocation = (value) => String(value || '').trim().toLowerCase();

const vendorServesCity = (vendor, city) => {
  const requestedCity = normalizeLocation(city);
  if (!requestedCity) return false;

  const vendorCity = normalizeLocation(vendor.address?.city);
  const serviceAreas = (vendor.serviceAreas || []).map(normalizeLocation);

  return vendorCity === requestedCity || serviceAreas.includes(requestedCity);
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      serviceId,
      vendorId,
      scheduledDate,
      scheduledTime,
      address,
      notes,
      paymentMethod
    } = req.body;

    // Validate service
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or unavailable'
      });
    }

    const resolvedVendorId = service.vendor.toString();
    if (vendorId && vendorId !== resolvedVendorId) {
      return res.status(400).json({
        success: false,
        message: 'Selected vendor does not provide this service'
      });
    }

    // Validate registered vendor for this service
    const vendor = await Vendor.findById(resolvedVendorId);
    if (!vendor || !vendor.isActive || !vendor.isApproved || !vendor.isAvailable) {
      return res.status(404).json({
        success: false,
        message: 'Vendor is not open for booking right now'
      });
    }

    if (!vendorServesCity(vendor, address?.city)) {
      return res.status(400).json({
        success: false,
        message: `${vendor.businessName} is not open for bookings in ${address?.city || 'this city'}`
      });
    }

    // Calculate pricing
    const baseAmount = service.price.amount;
    const taxAmount = Math.round(baseAmount * 0.18); // 18% GST
    const totalAmount = baseAmount + taxAmount;

    // Create booking
    const booking = await Booking.create({
      customer: req.user.id,
      vendor: resolvedVendorId,
      service: serviceId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      address,
      pricing: {
        baseAmount,
        taxAmount,
        discountAmount: 0,
        totalAmount
      },
      payment: {
        method: paymentMethod || 'cash'
      },
      notes: {
        customer: notes
      },
      timeline: [{
        status: 'pending',
        message: 'Booking request submitted',
        timestamp: new Date(),
        updatedBy: 'customer'
      }]
    });

    // Update service booking count
    await Service.findByIdAndUpdate(serviceId, {
      $inc: { bookingsCount: 1 }
    });

    // Update customer booking count
    await Customer.findByIdAndUpdate(req.user.id, {
      $inc: { bookingsCount: 1 }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service', 'title category price images')
      .populate('vendor', 'businessName ownerName phone email rating')
      .populate('customer', 'name phone email');

    // Send notification email to vendor
    try {
      await sendBookingNotification(populatedBooking.vendor.email, {
        customerName: populatedBooking.customer.name,
        serviceTitle: populatedBooking.service.title,
        scheduledDate: populatedBooking.scheduledDate,
        scheduledTime: populatedBooking.scheduledTime,
        address: populatedBooking.address,
        bookingId: populatedBooking.bookingId
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError.message);
      // Continue with booking creation even if email fails
    }

    // Send notification SMS to vendor
    try {
      await sendBookingSMS(populatedBooking.vendor.phone, {
        customerName: populatedBooking.customer.name,
        serviceTitle: populatedBooking.service.title,
        scheduledDate: populatedBooking.scheduledDate,
        scheduledTime: populatedBooking.scheduledTime,
        bookingId: populatedBooking.bookingId
      });
    } catch (smsError) {
      console.error('SMS notification failed:', smsError.message);
      // Continue with booking creation even if SMS fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking: populatedBooking
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get customer bookings
// @route   GET /api/bookings/customer
// @access  Private (Customer)
const getCustomerBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { customer: req.user.id };
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('service', 'title category price images icon')
      .populate('vendor', 'businessName ownerName phone email rating avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: bookings.length,
        totalRecords: total
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor bookings
// @route   GET /api/bookings/vendor
// @access  Private (Vendor)
const getVendorBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { vendor: req.user.id };
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('service', 'title category price images')
      .populate('customer', 'name phone email avatar address')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: bookings.length,
        totalRecords: total
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'title category price images description')
      .populate('vendor', 'businessName ownerName phone email rating avatar category')
      .populate('customer', 'name phone email avatar');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Authorization check
    const isCustomer = booking.customer._id.toString() === req.user.id;
    const isVendor = booking.vendor._id.toString() === req.user.id;

    if (!isCustomer && !isVendor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Vendor)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Vendor)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    
    const validStatuses = ['accepted', 'rejected', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check vendor authorization
    if (booking.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Status transition validation
    const allowedTransitions = {
      pending: ['accepted', 'rejected'],
      accepted: ['in_progress', 'completed'],
      in_progress: ['completed']
    };

    if (!allowedTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`
      });
    }

    // Update booking
    booking.status = status;
    
    if (notes) {
      booking.notes.vendor = notes;
    }

    if (status === 'accepted') {
      booking.acceptedAt = new Date();
    } else if (status === 'completed') {
      booking.completedAt = new Date();
      
      // Update vendor stats
      await Vendor.findByIdAndUpdate(req.user.id, {
        $inc: {
          'stats.completedBookings': 1,
          'stats.totalEarnings': booking.pricing.totalAmount
        }
      });

      // Update customer spending
      await Customer.findByIdAndUpdate(booking.customer, {
        $inc: { totalSpent: booking.pricing.totalAmount }
      });
    } else if (status === 'rejected') {
      booking.rejectedAt = new Date();
      await Vendor.findByIdAndUpdate(req.user.id, {
        $inc: { 'stats.cancelledBookings': 1 }
      });
    }

    // Update vendor total bookings
    if (status === 'accepted') {
      await Vendor.findByIdAndUpdate(req.user.id, {
        $inc: { 'stats.totalBookings': 1 }
      });
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('service', 'title category price images')
      .populate('customer', 'name phone email')
      .populate('vendor', 'businessName ownerName');

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (Customer)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Customer)
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!['pending', 'accepted'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this stage'
      });
    }

    booking.status = 'cancelled';
    booking.cancellation = {
      reason: reason || 'Customer requested cancellation',
      cancelledBy: 'customer',
      cancelledAt: new Date()
    };

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get booking stats for vendor dashboard
// @route   GET /api/bookings/vendor/stats
// @access  Private (Vendor)
const getVendorStats = async (req, res, next) => {
  try {
    const vendorId = req.user.id;

    const [
      total,
      pending,
      accepted,
      completed,
      rejected,
      todayBookings
    ] = await Promise.all([
      Booking.countDocuments({ vendor: vendorId }),
      Booking.countDocuments({ vendor: vendorId, status: 'pending' }),
      Booking.countDocuments({ vendor: vendorId, status: 'accepted' }),
      Booking.countDocuments({ vendor: vendorId, status: 'completed' }),
      Booking.countDocuments({ vendor: vendorId, status: 'rejected' }),
      Booking.countDocuments({
        vendor: vendorId,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);

    const earnings = await Booking.aggregate([
      { $match: { vendor: require('mongoose').Types.ObjectId(vendorId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        accepted,
        completed,
        rejected,
        todayBookings,
        totalEarnings: earnings[0]?.total || 0
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getVendorBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getVendorStats
};
