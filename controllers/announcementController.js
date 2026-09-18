const Announcement = require('../models/Announcement');
// list all announcements
async function getAnnouncements(req, res, next) {
    try {
        const announcements = await Announcement.find().populate('createdBy', 'name').sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        next(err);
    }
}
// get announcement by id
async function getAnnouncementById(req, res, next) {
    try {
        const announcement = await Announcement.findById(req.params.id).populate('createdBy', 'name');
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }
        res.json(announcement);
    } catch (err) {
        next(err);
    }
}
// create new announcement
async function createAnnouncement(req, res, next) {
    try {
        const { title, content, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const announcement = await Announcement.create({ title, content, category, createdBy: req.user._id });
        res.status(201).json(announcement);
    } catch (err) {
        next(err);
    }
}
// update announcement with editable fields
async function updateAnnouncement(req, res, next) {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }
        const { title, content, category } = req.body;
        const updates = { title, content, category };
        // delete undefined fields
        Object.keys(updates).forEach((key) => {
            if (updates[key] === undefined) {
                delete updates[key];
            }
        });
        Object.assign(announcement, updates);
        await announcement.save();
        res.json(announcement);
    } catch (err) {
        next(err);
    }
}
// delete announcement by id
async function deleteAnnouncement(req, res, next) {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }
        await announcement.deleteOne();
        res.json({ message: 'Announcement deleted successfully' });
    } catch (err) {
        next(err);
    }
}
module.exports = {
    getAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
};