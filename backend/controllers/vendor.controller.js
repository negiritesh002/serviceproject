const Vendor = require('../models/Vendor.model');
const Booking = require('../models/Booking.model');
const Service = require('../models/Service.model');

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor)
const getProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.user.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      vendor: vendor.toSafeObject()
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Private (Vendor)
const updateProfile = async (req, res, next) => {
  try {
    const { businessName, ownerName, description, isAvailable } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      req.user.id,
      { businessName, ownerName, description, isAvailable },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      vendor: vendor.toSafeObject()
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all vendors (public)
// @route   GET /api/vendors
// @access  Public
const getAllVendors = async (req, res, next) => {
  try {
    const { category, city } = req.query;
    
    const query = { isActive: true, isApproved: true };
    if (category) query.category = category;
    if (city) query['address.city'] = new RegExp(city, 'i');

    const vendors = await Vendor.find(query)
      .select('-password -bankDetails -documents')
      .sort({ 'rating.average': -1 });

    res.status(200).json({
      success: true,
      vendors
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Toggle vendor availability
// @route   PATCH /api/vendors/availability
// @access  Private (Vendor)
const toggleAvailability = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.user.id);
    vendor.isAvailable = !vendor.isAvailable;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: `You are now ${vendor.isAvailable ? 'available' : 'unavailable'} for bookings`,
      isAvailable: vendor.isAvailable
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllVendors,
  toggleAvailability
};
