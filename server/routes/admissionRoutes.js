const express = require('express');
const router = express.Router();

const {
  getAdmissions,
  submitAdmission,
  updateAdmissionStatus
} = require('../controllers/admissionController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getAdmissions);

router.post(
  '/',
  upload.student.single('photo'),
  submitAdmission
);

router.put('/:id/status', protect, updateAdmissionStatus);

module.exports = router;