const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String },
  caption: { type: String },
  category: { type: String, enum: ['art', 'dance', 'event', 'campus'], default: 'art' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
  // "source" distinguishes admin-uploaded gallery images from student/teacher art photos
  // Only 'admin' items appear on the public /gallery page
  source: { type: String, enum: ['admin', 'student', 'teacher'], default: 'admin' },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gallery', gallerySchema);
