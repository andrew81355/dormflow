const mongoose = require('mongoose');
//a schema for a user of the portal
const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email : {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
    // select false not to load passwordHash by normal queries
    passwordHash: {type: String, required: true, select: false},
    roomNumber: {type: String},
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    },
    {timestamps: true}
);
module.exports = mongoose.model('User', userSchema);