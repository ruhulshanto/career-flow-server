require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Setup
app.use(userRoutes);
app.use(questionRoutes);
app.use(resultRoutes);
app.use(instructorRoutes);
app.use(applicationRoutes);
app.use(bookRoutes);

app.get("/", (req, res) => {
  res.send("Career Flow Server is running!");
});

// Connect to Database and Start Server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });
