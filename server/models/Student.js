const mongoose = require('mongoose');

const feeRecordSchema = new mongoose.Schema({
  month: { type: String, required: true },
  admissionFees: { type: Number, default: 0 },
  tuitionFees: { type: Number, default: 0 },
  fine: { type: Number, default: 0 },
  paid: { type: Boolean, default: false },
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
  courseType: { type: String, enum: ['art', 'dance'], required: true },
  subCourse: { type: String },
  photo: { type: String },
  cloudinaryPublicId: { type: String },
  artPhotos: [{ type: String }],
  guardianName: { type: String },
  phone: { type: String },
  email: { type: String },
  admissionDate: { type: Date, default: Date.now },
  feesRecord: [feeRecordSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);