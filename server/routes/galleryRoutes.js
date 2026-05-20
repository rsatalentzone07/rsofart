const express = require('express');
const router = express.Router();
const { getGallery, uploadGalleryImage, deleteGalleryImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getGallery);
router.post('/', protect, upload.gallery.single('image'), uploadGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

module.exports = router;