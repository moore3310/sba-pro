const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Loan = require("./models/Loan");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "change_this_secret_now";

// MongoDB connection
mongoose
  .connectmongoose.connect("mongodb+srv://landiecope_db_user:zhM7rQGz3WrDYIgD@cluster0.yzdx5gg.mongodb.net/loansdb?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "landiecope@gmail.com",
    pass: "YOUR_APP_PASSWORD",
  },
});

// Simple admin login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid login" });
});

// Protect dashboard routes
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "No token" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Save application
app.post("/api/loan", async (req, res) => {
  try {
    const loan = await Loan.create(req.body);

    try {
      await transporter.sendMail({
        from: "landiecope@gmail.com",
        to: "landiecope@gmail.com",
        subject: "New Loan Application",
        text: `A new application was submitted by ${req.body.firstName} ${req.body.lastName}. Email: ${req.body.email}. Loan amount: ${req.body.amount}.`,
      });
    } catch (mailError) {
      console.log("Email failed:", mailError.message);
    }

    res.status(200).json({ message: "Application received", id: loan._id });
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({ message: "Error submitting application" });
  }
});

// View all applications in dashboard
app.get("/api/loans", auth, async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});