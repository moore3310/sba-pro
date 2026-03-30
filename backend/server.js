const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const SECRET = "mysecretkey";

// SIMPLE Mongo (no errors)
mongoose.connect("mongodb://127.0.0.1:27017/test")
  .then(() => console.log("MongoDB connected"))
  .catch(() => console.log("Mongo skipped"));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, SECRET);
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid login" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});