require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
//connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => 
  console.error("Error connecting to MongoDB:", error));
// get files from public folder
app.use(express.static('public'));
// verify that server is running(when get on /ping respond with ok)
app.get("/ping", (request, response) => {response.json({ status: "ok" });});
//404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});
app.use((error, request, response, next) => {
  console.error(error.stack);
  response.status(500).json({ error: "Internal Server Error" });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
