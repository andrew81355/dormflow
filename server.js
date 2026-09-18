require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
//connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => 
  console.error("Error connecting to MongoDB:", error));
// get files from public folder
app.use(express.static(path.join(__dirname, 'public')));
// verify that server is running(when get on /ping respond with ok)
app.get("/ping", (request, response) => {response.json({ status: "ok" });});
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/announcements', announcementRoutes);
//404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
