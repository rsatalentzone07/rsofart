const Teacher = require('../models/Teacher');
const cloudinary = require('../config/cloudinary');

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTeacher = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.photo = req.file.path;
      data.cloudinaryPublicId = req.file.filename;
    }
    if (typeof data.skills === 'string') {
      data.skills = data.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (data.email) data.email = data.email.toLowerCase();
    const teacher = await Teacher.create(data);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      const existing = await Teacher.findById(req.params.id);
      if (existing?.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId);
      }
      data.photo = req.file.path;
      data.cloudinaryPublicId = req.file.filename;
    }
    if (typeof data.skills === 'string') {
      data.skills = data.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (data.email) data.email = data.email.toLowerCase();
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    if (teacher.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(teacher.cloudinaryPublicId);
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const uploadArtPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const photoUrl = req.file.path;
    const publicId = req.file.filename;

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $push: { artPhotos: photoUrl } },
      { new: true }
    );

    if (!teacher) {
      await cloudinary.uploader.destroy(publicId);
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Art photo uploaded', teacher });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteArtPhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) return res.status(400).json({ message: 'photoUrl is required' });

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    if (photoUrl.includes('cloudinary.com')) {
      const match = photoUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
      if (match) {
        await cloudinary.uploader.destroy(match[1]);
      }
    }

    await Teacher.findByIdAndUpdate(req.params.id, {
      $pull: { artPhotos: photoUrl },
    });

    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadArtPhoto,
  deleteArtPhoto,
};