const Customer = require('../models/Customer.model');
const Vendor = require('../models/Vendor.model');
const Service = require('../models/Service.model');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { verifyFirebaseIdToken } = require('../config/firebaseAuth');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ==================== CUSTOMER AUTH ====================

const normalizeFirebasePhone = (phoneNumber) => {
  const digits = String(phoneNumber || '').replace(/\D/g, '');
  return digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
};

// @desc    Verify Firebase phone OTP and complete customer signup
// @route   POST /api/auth/customer/signup
// @access  Public
const customerSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phone, name, email, password, firebaseIdToken } = req.body;
    let decodedToken;

    try {
      decodedToken = await verifyFirebaseIdToken(firebaseIdToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Firebase phone verification failed. Please request a new OTP.'
      });
    }

    const verifiedPhone = normalizeFirebasePhone(decodedToken.phone_number);

    if (!decodedToken.phone_number || verifiedPhone !== phone) {
      return res.status(401).json({
        success: false,
        message: 'Firebase phone verification does not match this phone number'
      });
    }

    // Create or update customer
    let customer = await Customer.findOne({ phone });
    
    if (customer && !customer.isVerified) {
      customer.name = name;
      customer.email = email;
      customer.password = password;
      customer.isVerified = true;
    } else {
      customer = new Customer({
        name,
        email,
        phone,
        password,
        isVerified: true
      });
    }

    await customer.save();

    const token = generateToken(customer._id, 'customer');

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome aboard!',
      token,
      user: customer.toSafeObject(),
      role: 'customer'
    });

  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field === 'email' ? 'Email' : 'Phone'} already registered`
      });
    }
    next(error);
  }
};

// @desc    Customer Login
// @route   POST /api/auth/customer/login
// @access  Public
const customerLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const customer = await Customer.findOne({ email }).select('+password');

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!customer.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your phone number first'
      });
    }

    if (!customer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.'
      });
    }

    const isPasswordMatch = await customer.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    customer.lastLogin = new Date();
    await customer.save({ validateBeforeSave: false });

    const token = generateToken(customer._id, 'customer');

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back!',
      token,
      user: customer.toSafeObject(),
      role: 'customer'
    });

  } catch (error) {
    next(error);
  }
};

// ==================== VENDOR AUTH ====================

// @desc    Vendor Signup
// @route   POST /api/auth/vendor/signup
// @access  Public
const vendorSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { businessName, ownerName, email, phone, password, category, city, state } = req.body;

    const existingVendor = await Vendor.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: 'Vendor account already exists with this email or phone'
      });
    }

    const vendor = await Vendor.create({
      businessName,
      ownerName,
      email,
      phone,
      password,
      category,
      address: { city, state },
      isVerified: true // Auto-verify for demo
    });

    await Service.create({
      vendor: vendor._id,
      title: `${category} Service`,
      description: `${businessName} is open for ${category.toLowerCase()} bookings in ${city}.`,
      category,
      price: { amount: 499, unit: 'fixed' },
      duration: { min: 1, max: 2, unit: 'hours' },
      features: ['Registered vendor', 'Direct booking request', 'Vendor notification'],
      isActive: true
    });

    const token = generateToken(vendor._id, 'vendor');

    res.status(201).json({
      success: true,
      message: 'Vendor account created successfully!',
      token,
      user: vendor.toSafeObject(),
      role: 'vendor'
    });

  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already registered`
      });
    }
    next(error);
  }
};

// @desc    Vendor Login
// @route   POST /api/auth/vendor/login
// @access  Public
const vendorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email }).select('+password');

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordMatch = await vendor.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!vendor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    vendor.lastLogin = new Date();
    await vendor.save({ validateBeforeSave: false });

    const token = generateToken(vendor._id, 'vendor');

    res.status(200).json({
      success: true,
      message: 'Welcome back to your dashboard!',
      token,
      user: vendor.toSafeObject(),
      role: 'vendor'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    let user;
    
    if (req.user.role === 'customer') {
      user = await Customer.findById(req.user.id);
    } else {
      user = await Vendor.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.toSafeObject ? user.toSafeObject() : user,
      role: req.user.role
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  customerSignup,
  customerLogin,
  vendorSignup,
  vendorLogin,
  getMe
};
