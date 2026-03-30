const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const SECRET = "mysecretkey";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://landiecope_db_user:zhM7rQGz3WrDYIgD@ac-8fylpsm-shard-00-00.yzdx5gg.mongodb.net:27017,ac-8fylpsm-shard-00-01.yzdx5gg.mongodb.net:27017,ac-8fylpsm-shard-00-02.yzdx5gg.mongodb.net:27017/loansdb?ssl=true&replicaSet=atlas-9b3ffo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err.message));

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
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ message: "No token" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/api/loans", auth, async (req, res) => {
  const loans = await Loan.find().sort({ createdAt: -1 });
  res.json(loans);
});
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid login" });
});
app.post("/api/loan", async (req, res) => {
  try {
    const loan = await Loan.create(req.body);

    await transporter.sendMail({
      from: "landiecope@gmail.com",
      to: "landiecope@gmail.com",
      subject: "New Loan Application",
      text: "New application received",
    });

    res.json({ message: "Application received" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});