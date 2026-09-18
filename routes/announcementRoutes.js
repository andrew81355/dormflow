const express = require('express');
const router = express.Router();
const {
    getAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} = require('../controllers/announcementController');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
// every route below needs a valid token
router.use(auth);
// students can only read
router.get('/', getAnnouncements);
router.get('/:id', getAnnouncementById);
// writing is only for admin
router.post('/', requireAdmin, createAnnouncement);
router.patch('/:id', requireAdmin, updateAnnouncement);
router.delete('/:id', requireAdmin, deleteAnnouncement);
module.exports = router;