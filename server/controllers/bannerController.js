const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinary');

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const { title, subtitle, order, isActive } = req.body;
    const banner = await Banner.create({
      imageUrl: req.file.path,           // Cloudinary secure_url
      cloudinaryPublicId: req.file.filename, // public_id for later deletion
      title,
      subtitle,
      order: order || 0,
      isActive: isActive !== 'false',
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: 'Create error', error: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      // Delete the old image from Cloudinary if one exists
      const existing = await Banner.findById(req.params.id);
      if (existing?.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId);
      }
      data.imageUrl = req.file.path;
      data.cloudinaryPublicId = req.file.filename;
    }
    const banner = await Banner.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    if (banner.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(banner.cloudinaryPublicId);
    }
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner };