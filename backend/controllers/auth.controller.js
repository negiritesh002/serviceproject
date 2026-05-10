const Customer = require('../models/Customer.model');
const Vendor = require('../models/Vendor.model');
const Service = require('../models/Service.model');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { generateOtp, saveOtp, verifyOtp } = require('../utils/customerOtp.util');
const { isSmsOtpConfigured, sendSmsOtp } = require('../utils/smsOtp.util');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ==================== CUSTOMER AUTH ====================

// @desc    Send customer signup OTP
// @route   POST /api/auth/customer/send-otp
// @access  Public
const sendCustomerSignupOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phone, email } = req.body;

    let existingCustomer = null;

    if (Customer.db.readyState === 1) {
      existingCustomer = await Customer.findOne({
        $or: [{ phone }, { email }]
      });
    }

    if (existingCustomer?.phone === phone && existingCustomer.isVerified) {
      return res.status(409).json({
        success: false,
        message: 'Phone already registered'
      });
    }

    if (existingCustomer?.email === email && existingCustomer.isVerified) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    if (!isSmsOtpConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'SMS OTP service is not configured'
      });
    }

    const otp = generateOtp();
    await sendSmsOtp(phone, otp);
    saveOtp(phone, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your phone number'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify customer OTP and complete customer signup
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

    const { phone, name, email, password, otp } = req.body;
    const otpCheck = verifyOtp(phone, otp);

    if (!otpCheck.valid) {
      return res.status(401).json({
        success: false,
        message: otpCheck.message
      });
    }

    if (Customer.db.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is temporarily unavailable. Please try again in a moment.'
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
  sendCustomerSignupOtp,
  customerSignup,
  customerLogin,
  vendorSignup,
  vendorLogin,
  getMe
};
