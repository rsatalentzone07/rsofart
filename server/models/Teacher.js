const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  photo: { type: String },
  cloudinaryPublicId: { type: String },
  courseType: { type: String, enum: ['art', 'dance', 'music', 'yoga'], required: true },
  skills: [{ type: String }],
  qualification: { type: String },
  workExperience: { type: String },
  area: { type: String },
  email: { type: String },
  artPhotos: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Teacher', teacherSchema);