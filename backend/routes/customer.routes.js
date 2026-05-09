const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDashboardStats
} = require('../controllers/customer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('customer'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboardStats);

module.exports = router;