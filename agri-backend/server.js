const express = require("express");

const app = express();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Agri Backend API is running"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
