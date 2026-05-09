const express = require('express');
const router = express.Router();
const {
  createBooking,
  getCustomerBookings,
  getVendorBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getVendorStats
} = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validateBooking } = require('../middleware/validate.middleware');

router.use(protect);

// Customer routes
router.post('/', authorize('customer'), validateBooking, createBooking);
router.get('/customer', authorize('customer'), getCustomerBookings);
router.patch('/:id/cancel', authorize('customer'), cancelBooking);

// Vendor routes
router.get('/vendor', authorize('vendor'), getVendorBookings);
router.get('/vendor/stats', authorize('vendor'), getVendorStats);
router.patch('/:id/status', authorize('vendor'), updateBookingStatus);

// Common
router.get('/:id', getBookingById);

module.exports = router;