const mongoose = require('mongoose');
// notice written by admin
const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['General', 'Facilities', 'Maintenance', 'Events'],
            default: 'General',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('Announcement', announcementSchema);