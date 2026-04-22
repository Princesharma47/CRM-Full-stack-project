const express = require('express');
const router = express.Router();
const Lead     = require('../models/Lead');
const Property = require('../models/Property');
const Deal     = require('../models/Deal');
const { protect } = require('../middleware/authMiddleware');

// GET /api/dashboard/stats
// Returns real aggregated stats from MongoDB
router.get('/stats', protect, async (req, res) => {
  try {
    // ── Basic counts ──────────────────────────────────────────────────────────
    const totalLeads      = await Lead.countDocuments();
    const totalProperties = await Property.countDocuments();
    const activeDeals     = await Deal.countDocuments({ stage: { $ne: 'Closed' } });

    // ── Closed revenue this month ─────────────────────────────────────────────
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueData = await Deal.aggregate([
      { $match: { stage: 'Closed', closedAt: { $type: 'date', $gte: startOfMonth } } },
      { $group: { _id: null, totalRevenue: { $sum: '$dealValue' } } },
    ]);
    const closedRevenue = revenueData[0]?.totalRevenue || 0;

    // ── Monthly revenue + deals chart (last 6 months, all deals) ────────────
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Deal.aggregate([
      {
        $match: {
          $or: [
            { stage: 'Closed', closedAt: { $gte: sixMonthsAgo } },
            { createdAt: { $gte: sixMonthsAgo } },
          ],
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year:  { $year:  '$createdAt' },
          },
          revenue: { $sum: { $cond: [{ $eq: ['$stage', 'Closed'] }, '$dealValue', 0] } },
          deals:   { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // ── Lead status breakdown (for pie chart) ─────────────────────────────────
    const leadStats = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // ── Lead source breakdown ──────────────────────────────────────────────────
    const leadSources = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    // ── Recent 5 leads ─────────────────────────────────────────────────────────
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name status source createdAt phone');

    // ── Recent 5 deals ─────────────────────────────────────────────────────────
    const recentDeals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title client dealValue stage createdAt');

    res.json({
      success: true,
      data: {
        totalLeads,
        totalProperties,
        activeDeals,
        closedRevenue,
        monthlyRevenue,
        leadStats,
        leadSources,
        recentLeads,
        recentDeals,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
