const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  applicantName: { type: String, required: true },
  fatherName: { type: String },
  motherName: { type: String },
  dateOfBirth: { type: Date },
  age: { type: Number },
  sex: { type: String, enum: ['male', 'female'] },
  category: { type: String, enum: ['SC', 'ST', 'BPL', 'OBC', 'GEN', 'Any other'] },
  nationality: { type: String, default: 'Indian' },
  school: { type: String },
  studyingInClass: { type: String },
  // In admissionSchema, add these fields:
  applyingForClass: { type: String },
  courseType: { type: String, enum: ['art', 'dance'], default: 'art' },
  subCourse: { type: String },
  academicQualification: { type: String },
  residentialAddress: { type: String },
  occupation: { type: String },
  phoneNo: { type: String },
  photo: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Admission', admissionSchema);
