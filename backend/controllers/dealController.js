const Deal = require('../models/Deal');

// ── Get All Deals ─────────────────────────────────────────────────────────────
// @route   GET /api/deals?stage=&search=
const getDeals = async (req, res) => {
  try {
    const { stage, search } = req.query;
    let filter = {};

    if (stage)  filter.stage = stage;
    if (search) {
      filter.$or = [
        { title:  { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
      ];
    }

    const deals = await Deal.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: deals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Create Deal ───────────────────────────────────────────────────────────────
// @route   POST /api/deals
const createDeal = async (req, res) => {
  try {
    const { title, client, dealValue, stage, commission, property, assignedAgent, notes } = req.body;

    if (!title || !client || !dealValue) {
      return res.status(400).json({
        success: false,
        message: 'Title, client and deal value are required',
      });
    }

    const deal = await Deal.create({
      title, client, dealValue, stage,
      commission, property, assignedAgent, notes,
    });

    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Deal (stage drag-and-drop or full edit) ────────────────────────────
// @route   PUT /api/deals/:id
const updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });

    // Auto-set closedAt when moving to Closed via direct update (bypasses pre-save)
    if (req.body.stage === 'Closed' && deal.stage !== 'Closed') {
      req.body.closedAt = new Date();
    }

    const updated = await Deal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Deal ───────────────────────────────────────────────────────────────
// @route   DELETE /api/deals/:id
const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
    res.json({ success: true, message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Pipeline Summary (aggregate by stage) ─────────────────────────────────────
// @route   GET /api/deals/summary
const getPipelineSummary = async (req, res) => {
  try {
    const summary = await Deal.aggregate([
      {
        $group: {
          _id:        '$stage',
          count:      { $sum: 1 },
          totalValue: { $sum: '$dealValue' },
        },
      },
    ]);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDeals, createDeal, updateDeal, deleteDeal, getPipelineSummary };
