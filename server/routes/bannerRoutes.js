const express = require('express');
const router = express.Router();
const { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getBanners);
router.get('/all', protect, getAllBanners);
router.post('/', protect, upload.banner.single('image'), createBanner);
router.put('/:id', protect, upload.banner.single('image'), updateBanner);
router.delete('/:id', protect, deleteBanner);

module.exports = router;