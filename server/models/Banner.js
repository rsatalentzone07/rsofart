const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String },
  title: { type: String },
  subtitle: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Banner', bannerSchema);