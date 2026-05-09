const { body, param, query } = require('express-validator');

const validateCustomerSignup = [
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid Indian phone number (10 digits starting with 6-9)'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number')
];

const validateCustomerLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateVendorSignup = [
  body('businessName').trim().notEmpty().withMessage('Business name required'),
  body('ownerName').trim().notEmpty().withMessage('Owner name required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required')
];

const validateBooking = [
  body('serviceId').isMongoId().withMessage('Invalid service ID'),
  body('vendorId').optional().isMongoId().withMessage('Invalid vendor ID'),
  body('scheduledDate').isISO8601().withMessage('Invalid date format'),
  body('scheduledTime').notEmpty().withMessage('Scheduled time required'),
  body('address.street').notEmpty().withMessage('Street address required'),
  body('address.city').notEmpty().withMessage('City required'),
  body('address.state').notEmpty().withMessage('State required'),
  body('address.pincode').matches(/^\d{6}$/).withMessage('Invalid pincode')
];

module.exports = {
  validateCustomerSignup,
  validateCustomerLogin,
  validateVendorSignup,
  validateBooking
};
