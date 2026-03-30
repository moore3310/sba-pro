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
    alert("Submitted (you can connect backend later)");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Loan Application</h2>

      {/* LINK TO ADMIN */}
      <Link to="/admin">Go to Admin</Link>

      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} /><br/>
        <input name="lastName" placeholder="Last Name" onChange={handleChange} /><br/>
        <input name="email" placeholder="Email" onChange={handleChange} /><br/>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

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