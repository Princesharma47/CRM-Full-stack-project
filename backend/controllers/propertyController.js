const Property = require('../models/Property');
const fs   = require('fs');
const path = require('path');

// ── Get All Properties ────────────────────────────────────────────────────────
// @route   GET /api/properties?status=&type=&search=
const getProperties = async (req, res) => {
  try {
    const { status, type, search, minPrice, maxPrice, location } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (type)   filter.type   = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title:    { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Property ───────────────────────────────────────────────────────
// @route   GET /api/properties/:id
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Create Property ───────────────────────────────────────────────────────────
// @route   POST /api/properties  (multipart/form-data)
const createProperty = async (req, res) => {
  try {
    const { title, location, price, size, type, status, amenities, description } = req.body;

    if (!title || !location || !price) {
      return res.status(400).json({
        success: false,
        message: 'Title, location and price are required',
      });
    }

    // Handle uploaded image filenames
    const images = req.files ? req.files.map((f) => f.filename) : [];

    // Amenities sent as comma-separated string from FormData
    const amenitiesArr = amenities
      ? amenities.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

    const property = await Property.create({
      title,
      location,
      price,
      size,
      type,
      status,
      description,
      amenities: amenitiesArr,
      images,
      addedBy:       req.user._id,  // backward compat
      assignedAgent: req.user._id,
    });

    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Property ───────────────────────────────────────────────────────────
// @route   PUT /api/properties/:id  (multipart/form-data)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });

    const { title, location, price, size, type, status, amenities, description } = req.body;

    // New uploaded images appended to existing ones
    const newImages = req.files ? req.files.map((f) => f.filename) : [];

    const amenitiesArr = amenities
      ? amenities.split(',').map((a) => a.trim()).filter(Boolean)
      : property.amenities;

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      {
        title:    title    || property.title,
        location: location || property.location,
        price:    price    || property.price,
        size:     size     !== undefined ? size : property.size,
        type:     type     || property.type,
        status:   status   || property.status,
        description: description !== undefined ? description : property.description,
        amenities: amenitiesArr,
        images: [...property.images, ...newImages],
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Property ────────────────────────────────────────────────────────────
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });

    // Delete all image files from disk
    property.images.forEach((img) => {
      const filePath = path.join(__dirname, '../uploads', img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Single Image from a Property ───────────────────────────────────────
// @route   DELETE /api/properties/:id/image/:filename
const deleteImage = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const property = await Property.findById(id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });

    // Remove file from disk
    const filePath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Remove filename from DB array
    property.images = property.images.filter((img) => img !== filename);
    await property.save();

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getProperty,
  getPropertyById: getProperty, // alias for backward compat
  createProperty,
  updateProperty,
  deleteProperty,
  deleteImage,
};
