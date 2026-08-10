const express = require('express');
const app = express();
const PORT = 3000
// verify that server is running(when get on /ping respond with ok)
app.get("/ping", (request, response) => {response.json({ status: "ok" });});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});