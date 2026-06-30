import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

 const handleRegister = async () => {

  try {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    // ✅ CALL BACKEND API
    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({username: form.name,   // ✅ IMPORTANT FIX
  email: form.email,
  password: form.password,
})
    });

    const data = await res.json();

if (!res.ok) {
  // Check if user already exists
  if (data.message && data.message.includes("already exists")) {
    alert("User already exists. Redirecting to Login page!");
    navigate("/login"); // ✅ Redirect to login
    return; // stop further execution
  }
  
  // Other registration errors
  setError(data.message || "Registration failed");
  return;
}
// If registration successful
localStorage.setItem("registeredUser", "true");
alert("Signup Successful 🎉 Now Login!");
setError("");
navigate("/login");

  } catch (err) {
    console.error(err);
    setError("Server error");
  }
};

  return (
    <div className="auth-container register-bg">

      {/* ✨ Sparkles Added Here */}
      <div className="sparkle-container">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
      </div>

      <div className="auth-card">
        <h2>Create Account</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder=" "
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setError("");
            }}
          />
          <label>Full Name</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder=" "
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setError("");
            }}
          />
          <label>Email</label>
        </div>

        <div className="input-group password-group">
          <input
            type={showPass ? "text" : "password"}
            placeholder=" "
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setError("");
            }}
          />
          <label>Password</label>

          <span
            className="eye-icon"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder=" "
            onChange={(e) => {
              setForm({ ...form, confirm: e.target.value });
              setError("");
            }}
          />
          <label>Confirm Password</label>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="auth-btn" onClick={handleRegister}>
          Sign Up
        </button>

        <p className="switch-text">
          Already Registered?
          <span onClick={() => navigate("/login")}> Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
