require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const Facility = require('./models/Facility');
const Booking = require('./models/Booking');
const Announcement = require('./models/Announcement');
// demo data for project
function todayAt(hour) {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date;
}
async function seed() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set. Copy .env.example to .env first.');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await Promise.all([
        User.deleteMany({}),
        MaintenanceRequest.deleteMany({}),
        Facility.deleteMany({}),
        Booking.deleteMany({}),
        Announcement.deleteMany({}),
    ]);
    console.log('Old data removed');
    const passwordHash = await bcrypt.hash('password123', 10);
    const [admin, andrei, daniel, maria] = await User.create([
        {
            name: 'Admin User',
            email: 'admin@dormflow.test',
            passwordHash,
            role: 'admin',
        },
        {
            name: 'Andrei Petrov',
            email: 'andrei@dormflow.test',
            passwordHash,
            roomNumber: '204',
        },
        {
            name: 'Daniel Smith',
            email: 'daniel@dormflow.test',
            passwordHash,
            roomNumber: '112',
        },
        {
            name: 'Maria Ivanova',
            email: 'maria@dormflow.test',
            passwordHash,
            roomNumber: '305',
        },
    ]);
    console.log('Users created: 1 admin, 3 students');
    const [laundry, study, common, gym] = await Facility.create([
        {
            name: 'Laundry Room',
            description: 'Four washing machines and two dryers.',
            location: 'Floor 1',
            capacity: 4,
            slotMinutes: 60,
            pricePerSlot: 2,
        },
        {
            name: 'Study Room',
            description: 'Quiet room with desks for group work.',
            location: 'Floor 2',
            capacity: 8,
            slotMinutes: 60,
        },
        {
            name: 'Common Room',
            description: 'Shared room with sofas and a television.',
            location: 'Floor 1',
            capacity: 20,
            slotMinutes: 120,
        },
        {
            name: 'Gym Room',
            description: 'Small gym with basic equipment.',
            location: 'Basement',
            capacity: 6,
            slotMinutes: 60,
        },
    ]);
    console.log('Facilities created: 4');
    await MaintenanceRequest.create([
        {
            resident: andrei._id,
            roomNumber: '204',
            category: 'Plumbing',
            description: 'The sink in the bathroom is leaking.',
            priority: 'High',
            status: 'Submitted',
        },
        {
            resident: andrei._id,
            roomNumber: '204',
            category: 'Heating',
            description: 'The radiator stays cold in the morning.',
            priority: 'Urgent',
            status: 'In Progress',
            adminComment: 'A technician will come today.',
            statusHistory: [
                {
                    from: 'Submitted',
                    to: 'Reviewed',
                    changedBy: admin._id,
                    comment: 'Checked with the caretaker.',
                    changedAt: todayAt(9),
                },
                {
                    from: 'Reviewed',
                    to: 'In Progress',
                    changedBy: admin._id,
                    comment: 'A technician will come today.',
                    changedAt: todayAt(11),
                },
            ],
        },
        {
            resident: andrei._id,
            roomNumber: '204',
            category: 'Internet',
            description: 'Wi-Fi is very slow in the evening.',
            priority: 'Low',
            status: 'Completed',
            statusHistory: [
                {
                    from: 'Submitted',
                    to: 'Reviewed',
                    changedBy: admin._id,
                    comment: '',
                    changedAt: todayAt(10),
                },
                {
                    from: 'Reviewed',
                    to: 'In Progress',
                    changedBy: admin._id,
                    comment: 'Router replaced.',
                    changedAt: todayAt(14),
                },
                {
                    from: 'In Progress',
                    to: 'Completed',
                    changedBy: admin._id,
                    comment: 'Speed is back to normal.',
                    changedAt: todayAt(16),
                },
            ],
        },
        {
            resident: daniel._id,
            roomNumber: '112',
            category: 'Electricity',
            description: 'One socket near the desk does not work.',
            priority: 'Medium',
            status: 'Reviewed',
            statusHistory: [
                {
                    from: 'Submitted',
                    to: 'Reviewed',
                    changedBy: admin._id,
                    comment: 'Added to the weekly list.',
                    changedAt: todayAt(12),
                },
            ],
        },
        {
            resident: daniel._id,
            roomNumber: '112',
            category: 'Furniture',
            description: 'The desk chair is broken and cannot be adjusted.',
            priority: 'Low',
            status: 'Submitted',
        },
        {
            resident: maria._id,
            roomNumber: '305',
            category: 'Heating',
            description: 'The room is too hot and the valve is stuck.',
            priority: 'High',
            status: 'In Progress',
            statusHistory: [
                {
                    from: 'Submitted',
                    to: 'Reviewed',
                    changedBy: admin._id,
                    comment: '',
                    changedAt: todayAt(9),
                },
                {
                    from: 'Reviewed',
                    to: 'In Progress',
                    changedBy: admin._id,
                    comment: 'Parts ordered.',
                    changedAt: todayAt(13),
                },
            ],
        },
        {
            resident: maria._id,
            roomNumber: '305',
            category: 'Internet',
            description: 'The network cable in the room is damaged.',
            priority: 'Medium',
            status: 'Submitted',
        },
    ]);
    console.log('Maintenance requests created');
    await Booking.create([
        {
            userId: andrei._id,
            facilityId: laundry._id,
            startAt: todayAt(10),
            endAt: todayAt(11),
        },
        {
            userId: andrei._id,
            facilityId: study._id,
            startAt: todayAt(14),
            endAt: todayAt(15),
        },
        {
            userId: daniel._id,
            facilityId: gym._id,
            startAt: todayAt(18),
            endAt: todayAt(19),
        },
        {
            userId: maria._id,
            facilityId: common._id,
            startAt: todayAt(16),
            endAt: todayAt(18),
        },
        {
            userId: maria._id,
            facilityId: study._id,
            startAt: todayAt(12),
            endAt: todayAt(13),
            status: 'Cancelled',
        },
    ]);
    console.log('Bookings created');
    await Announcement.create([
        {
            title: 'Water shutdown on Friday',
            content: 'Cold water will be off from 9:00 to 13:00 for scheduled maintenance. Please store some water in advance.',
            category: 'Maintenance',
            createdBy: admin._id,
        },
        {
            title: 'New gym opening hours',
            content: 'The gym room is now open from 7:00 to 23:00 every day.',
            category: 'Facilities',
            createdBy: admin._id,
        },
    ]);
    console.log('Announcements created: 2');
    console.log('\nDemo accounts (password for all: password123)');
    console.log('  admin@dormflow.test   (admin)');
    console.log('  andrei@dormflow.test  (student, room 204)');
    console.log('  daniel@dormflow.test  (student, room 112)');
    console.log('  maria@dormflow.test   (student, room 305)');
    await mongoose.disconnect();
    console.log('\nSeed finished');
}
seed().catch(async (err) => {
    console.error('Seed failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
});