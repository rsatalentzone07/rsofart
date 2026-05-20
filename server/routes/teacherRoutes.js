const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadArtPhoto,
  deleteArtPhoto,
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getTeachers);
router.post('/', protect, upload.teacher.single('photo'), createTeacher);
router.get('/:id', protect, getTeacherById);
router.put('/:id', protect, upload.teacher.single('photo'), updateTeacher);
router.delete('/:id', protect, deleteTeacher);
router.post('/:id/art', protect, upload.teacher.single('artPhoto'), uploadArtPhoto);
router.delete('/:id/art', protect, deleteArtPhoto);

module.exports = router;