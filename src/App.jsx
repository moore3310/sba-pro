import { useState } from "react";

export default function App() {
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
      const res = await fetch("http://localhost:5000/api/loan", {
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

  const s = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px"
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Loan Application</h2>
      <p><a href="/admin">Go to Admin</a></p>

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