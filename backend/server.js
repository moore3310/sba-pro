const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const SECRET = "mysecretkey";

mongoose
  .connect(process.env.MONGO_URI || "mongodb://landiecope_db_user:zhM7rQGz3WrDYIgD@ac-8fylpsm-shard-00-00.yzdx5gg.mongodb.net:27017,ac-8fylpsm-shard-00-01.yzdx5gg.mongodb.net:27017,ac-8fylpsm-shard-00-02.yzdx5gg.mongodb.net:27017/loansdb?ssl=true&replicaSet=atlas-9b3ffo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

const loanSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dateOfBirth: String,
  ssn: String,
  businessName: String,
  amount: String,
  createdAt: { type: Date, default: Date.now },
});

const Loan = mongoose.model("Loan", loanSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "landiecope@gmail.com",
    pass: "hfapwruyswbbvuzo",
  },
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid login" });
});

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "No token" });
  }

  try {
    jwt.verify(token, SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/api/loan", async (req, res) => {
  try {
    const loan = await Loan.create(req.body);

    try {
      await transporter.sendMail({
        from: "landiecope@gmail.com",
        to: "landiecope@gmail.com",
        subject: "New Loan Application",
        text: "New application received",
      });
    } catch (mailError) {
      console.log("Email failed:", mailError.message);
    }

    return res.json({ message: "Application received", id: loan._id });
  } catch (error) {
    console.log("Save error:", error.message);
    return res.status(500).json({ message: "Error submitting application" });
  }
});

app.get("/api/loans", auth, async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    return res.json(loans);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching applications" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});