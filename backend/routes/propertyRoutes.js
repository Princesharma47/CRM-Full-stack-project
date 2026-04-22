const express = require('express');
const router  = express.Router();
const upload  = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  getProperties, getProperty,
  createProperty, updateProperty,
  deleteProperty, deleteImage,
} = require('../controllers/propertyController');

router.route('/')
  .get(getProperties)
  .post(protect, upload.array('images', 5), createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, upload.array('images', 5), updateProperty)
  .delete(protect, deleteProperty);

// Individual image deletion
router.delete('/:id/image/:filename', protect, deleteImage);

module.exports = router;
