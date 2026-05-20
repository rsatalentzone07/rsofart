const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

const getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const items = await Gallery.find(filter).populate('studentId', 'name').sort({ uploadedAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { caption, category, studentId } = req.body;
    const item = await Gallery.create({
      imageUrl: req.file.path,               // Cloudinary secure_url
      cloudinaryPublicId: req.file.filename,
      caption,
      category: category || 'art',
      studentId: studentId || null,
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