const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAllVendors,
  toggleAvailability
} = require('../controllers/vendor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public
router.get('/', getAllVendors);

// Protected
router.use(protect);
router.get('/profile', authorize('vendor'), getProfile);
router.put('/profile', authorize('vendor'), updateProfile);
router.patch('/availability', authorize('vendor'), toggleAvailability);

module.exports = router;