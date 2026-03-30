import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Admin from "./Admin";

function Home() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",
    businessName: "",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://sba-backend-qyuo.onrender.com/api/loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      alert(data.message || "Application received");
    } catch (error) {
      console.error(error);
      alert("Error submitting application");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Loan Application</h2>
      <p><Link to="/admin">Go to Admin</Link></p>

      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} style={s} />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} style={s} />
        <input name="email" placeholder="Email" onChange={handleChange} style={s} />
        <input name="phone" placeholder="Phone" onChange={handleChange} style={s} />
        <input name="dateOfBirth" placeholder="Date of Birth" onChange={handleChange} style={s} />
        <input name="ssn" placeholder="SSN" onChange={handleChange} style={s} />
        <input name="businessName" placeholder="Business Name" onChange={handleChange} style={s} />
        <input name="amount" placeholder="Loan Amount" onChange={handleChange} style={s} />

        <button type="submit" style={{ padding: "12px 20px" }}>
          Submit Application
        </button>
      </form>
    </div>
  );
}

const s = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}