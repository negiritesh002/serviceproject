const express = require('express');
const router = express.Router();
const {
  customerSendOTP,
  customerVerifyOTP,
  customerLogin,
  vendorSignup,
  vendorLogin,
  getMe
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  validateCustomerLogin,
  validateVendorSignup
} = require('../middleware/validate.middleware');
const { body } = require('express-validator');

// Customer Auth Routes
router.post('/customer/send-otp', [
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('email').isEmail().withMessage('Invalid email')
], customerSendOTP);

router.post('/customer/verify-otp', [
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid phone'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
], customerVerifyOTP);

router.post('/customer/login', validateCustomerLogin, customerLogin);

// Vendor Auth Routes
router.post('/vendor/signup', validateVendorSignup, vendorSignup);
router.post('/vendor/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password required')
], vendorLogin);

// Common
router.get('/me', protect, getMe);

module.exports = router;