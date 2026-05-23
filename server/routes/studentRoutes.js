const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadArtPhoto,
  deleteArtPhoto,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route — returns only students who have artPhotos (for the public Students page)
router.get('/public', async (req, res) => {
  try {
    const Student = require('../models/Student');
    const students = await Student.find({})
      .select('name photo courseType subCourse class artPhotos')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected admin routes
router.get('/', protect, getStudents);
router.post('/', protect, upload.student.single('photo'), createStudent);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, upload.student.single('photo'), updateStudent);
router.delete('/:id', protect, deleteStudent);
router.post('/:id/art', protect, upload.student.single('artPhoto'), uploadArtPhoto);
router.delete('/:id/art', protect, deleteArtPhoto);

module.exports = router;
