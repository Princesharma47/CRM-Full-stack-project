const express = require('express');
const router  = express.Router();
const {
  getLeads, getLead, createLead, updateLead, deleteLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLeads).post(protect, createLead);
router.route('/:id').get(protect, getLead).put(protect, updateLead).delete(protect, deleteLead);

module.exports = router;
