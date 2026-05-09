const Customer = require('../models/Customer.model');
const Booking = require('../models/Booking.model');

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private (Customer)
const getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      customer: customer.toSafeObject()
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private (Customer)
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, address } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.user.id,
      { name, email, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      customer: customer.toSafeObject()
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get customer dashboard stats
// @route   GET /api/customers/dashboard
// @access  Private (Customer)
const getDashboardStats = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    const [total, pending, completed, cancelled] = await Promise.all([
      Booking.countDocuments({ customer: customerId }),
      Booking.countDocuments({ customer: customerId, status: 'pending' }),
      Booking.countDocuments({ customer: customerId, status: 'completed' }),
      Booking.countDocuments({ customer: customerId, status: 'cancelled' })
    ]);

    const recentBookings = await Booking.find({ customer: customerId })
      .populate('service', 'title category price images icon')
      .populate('vendor', 'businessName ownerName rating avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    const spending = await Booking.aggregate([
      { $match: { customer: require('mongoose').Types.ObjectId(customerId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        completed,
        cancelled,
        totalSpent: spending[0]?.total || 0
      },
      recentBookings
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats
};