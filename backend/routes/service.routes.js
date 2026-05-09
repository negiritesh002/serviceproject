const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  getVendorServices,
  getCategories
} = require('../controllers/service.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getAllServices);
router.get('/categories', getCategories);
router.get('/vendor/my-services', protect, authorize('vendor'), getVendorServices);
router.get('/:id', getServiceById);

// Protected vendor routes
router.use(protect);
router.post('/', authorize('vendor'), createService);

module.exports = router;
