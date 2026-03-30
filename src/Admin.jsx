import { useEffect, useState } from "react";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [loans, setLoans] = useState([]);

  const handleLogin = async () => {
    try {
      const res = await fetch("https://sba-backend-qyuo.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Login error");
    }
  };

  useEffect(() => {
    if (!token) return;

    fetch("https://sba-backend-qyuo.onrender.com/api/loans", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLoans(data);
        } else {
          setLoans([]);
        }
      })
      .catch((err) => console.log(err));
  }, [token]);

  if (!token) {
    return (
      <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <h2>Admin Login</h2>

        <input
          placeholder="Username"
          onChange={(e) => setLogin({ ...login, username: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button onClick={handleLogin} style={{ padding: "10px 16px" }}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Applications</h2>

      {loans.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        loans.map((loan) => (
          <div
            key={loan._id}
            style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}
          >
            <div><b>Name:</b> {loan.firstName} {loan.lastName}</div>
            <div><b>Email:</b> {loan.email}</div>
            <div><b>SSN:</b> {loan.ssn}</div>
            <div><b>Amount:</b> {loan.amount}</div>
          </div>
        ))
      )}
    </div>
  );
}