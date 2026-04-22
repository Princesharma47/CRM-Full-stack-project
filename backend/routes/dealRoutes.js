const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getDeals, createDeal, updateDeal,
  deleteDeal, getPipelineSummary,
} = require('../controllers/dealController');

// IMPORTANT: /summary must come before /:id so Express doesn't treat "summary" as an ID
router.get('/summary', protect, getPipelineSummary);

router.route('/').get(protect, getDeals).post(protect, createDeal);
router.route('/:id').put(protect, updateDeal).delete(protect, deleteDeal);

module.exports = router;
