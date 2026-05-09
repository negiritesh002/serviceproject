const Service = require('../models/Service.model');
const Vendor = require('../models/Vendor.model');

const escapeRegex = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      city,
      state,
      page = 1,
      limit = 12,
      sort = '-createdAt',
      featured
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseInt(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseInt(maxPrice);
    }

    const vendorQuery = {
      isActive: true,
      isApproved: true,
      isAvailable: true
    };

    if (city) {
      const cityRegex = new RegExp(`^${escapeRegex(city.trim())}$`, 'i');
      vendorQuery.$or = [
        { 'address.city': cityRegex },
        { serviceAreas: cityRegex }
      ];
    }

    if (state) {
      vendorQuery['address.state'] = new RegExp(`^${escapeRegex(state.trim())}$`, 'i');
    }

    const activeVendors = await Vendor.find(vendorQuery).select('_id');
    query.vendor = { $in: activeVendors.map(vendor => vendor._id) };

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .populate('vendor', 'businessName ownerName rating isAvailable avatar address serviceAreas')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      services,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: services.length,
        totalRecords: total
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('vendor', 'businessName ownerName rating isAvailable avatar address serviceAreas phone email stats category isActive isApproved');

    if (!service || !service.vendor || !service.vendor.isActive || !service.vendor.isApproved) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      service
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Create service (Vendor)
// @route   POST /api/services
// @access  Private (Vendor)
const createService = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      price,
      duration,
      features,
      requirements,
      tags
    } = req.body;

    const service = await Service.create({
      vendor: req.user.id,
      title,
      description,
      category,
      price,
      duration,
      features,
      requirements,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor services
// @route   GET /api/services/vendor/my-services
// @access  Private (Vendor)
const getVendorServices = async (req, res, next) => {
  try {
    const services = await Service.find({ vendor: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      services
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get service categories with count
// @route   GET /api/services/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Service.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      categories
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  getVendorServices,
  getCategories
};
