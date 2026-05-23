const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

const getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    // Always filter to only admin-uploaded images on the public gallery
    const filter = { source: 'admin' };
    if (category) filter.category = category;
    const items = await Gallery.find(filter).sort({ uploadedAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { caption, category } = req.body;
    const item = await Gallery.create({
      imageUrl: req.file.path,
      cloudinaryPublicId: req.file.filename,
      caption,
      category: category || 'art',
      source: 'admin', // explicitly mark as admin upload
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Upload error', error: error.message });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Image not found' });
    if (item.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(item.cloudinaryPublicId);
    }
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getGallery, uploadGalleryImage, deleteGalleryImage };
