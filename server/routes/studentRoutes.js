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

router.get('/', protect, getStudents);
router.post('/', protect, upload.student.single('photo'), createStudent);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, upload.student.single('photo'), updateStudent);
router.delete('/:id', protect, deleteStudent);
router.post('/:id/art', protect, upload.student.single('artPhoto'), uploadArtPhoto);
router.delete('/:id/art', protect, deleteArtPhoto);

module.exports = router;