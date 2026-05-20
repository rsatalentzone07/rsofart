const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['art', 'dance'], required: true },
  subCourse: { type: String },
  duration: { type: String, default: 'One Year' },
  fee: { type: Number, default: 0 },
  description: { type: String },
});

module.exports = mongoose.model('Course', courseSchema);
