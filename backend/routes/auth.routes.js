const express = require('express');
const router = express.Router();
const {
  customerSignup,
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
router.post('/customer/signup', [
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid phone'),
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('firebaseIdToken').notEmpty().withMessage('Firebase verification token required'),
  
  // Update the password validation line to this:
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number')
], customerSignup);

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
