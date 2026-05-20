const express = require('express');
const router = express.Router();
const { getContacts, submitContact, markAsRead } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getContacts);
router.post('/', submitContact);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
