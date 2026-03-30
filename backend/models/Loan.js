const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dateOfBirth: String,
  ssn: String,
  businessName: String,
  amount: String,
  coApplicantName: String,
  coApplicantEmail: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  bankName: String,
  accountHolderName: String,
  routingNumber: String,
  accountNumber: String,
  repaymentMethod: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Loan", loanSchema);