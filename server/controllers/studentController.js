const Student = require('../models/Student');
const cloudinary = require('../config/cloudinary');

const getStudents = async (req, res) => {
  try {
    const { courseType, subCourse, search } = req.query;
    const filter = {};
    if (courseType) filter.courseType = courseType;
    if (subCourse) filter.subCourse = subCourse;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const data = req.body;

    // Normalize email to lowercase
    if (data.email) data.email = data.email.toLowerCase();

    if (req.file) {
      data.photo = req.file.path;
      data.cloudinaryPublicId = req.file.filename;
    }

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    data.feesRecord = months.map((month) => ({
      month, admissionFees: 0, tuitionFees: 0, fine: 0, paid: false,
    }));

    const student = await Student.create(data);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const data = req.body;

    // Normalize email to lowercase
    if (data.email) data.email = data.email.toLowerCase();

    if (req.file) {
      const existing = await Student.findById(req.params.id);
      if (existing?.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId);
      }
      data.photo = req.file.path;
      data.cloudinaryPublicId = req.file.filename;
    }
    const student = await Student.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (student.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(student.cloudinaryPublicId);
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const uploadArtPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const photoUrl = req.file.path;
    const publicId = req.file.filename;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $push: { artPhotos: photoUrl } },
      { new: true }
    );

    if (!student) {
      await cloudinary.uploader.destroy(publicId);
      return res.status(404).json({ message: 'Student not found' });
    }

    // NOTE: Artwork is intentionally NOT added to the Gallery collection.
    // It is stored only on the student profile.

    res.json({ message: 'Art photo uploaded', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteArtPhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) return res.status(400).json({ message: 'photoUrl is required' });

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Delete from Cloudinary if hosted there
    if (photoUrl.includes('cloudinary.com')) {
      const match = photoUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
      if (match) {
        await cloudinary.uploader.destroy(match[1]);
      }
    }

    await Student.findByIdAndUpdate(req.params.id, {
      $pull: { artPhotos: photoUrl },
    });

    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadArtPhoto,
  deleteArtPhoto,
};