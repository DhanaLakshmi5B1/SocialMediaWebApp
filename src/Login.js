import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  const registered = localStorage.getItem("registeredUser");

  if (!registered) {
    setError("Please Sign Up First");
  }
}, []);

  const validatePassword = (pass) => {
    const rules = [
      pass.length >= 8,
      /[A-Z]/.test(pass),
      /[a-z]/.test(pass),
      /[0-9]/.test(pass),
      /[!@#$%^&*]/.test(pass),
      !/\s/.test(pass),
      pass.length <= 20,
      /^[A-Za-z0-9!@#$%^&*]+$/.test(pass)
    ];
    return rules.every(Boolean);
  };

  const handleLogin = async () => {
  try {
    if (!email.includes("@")) {
      setError("Enter valid email address");
      return;
    }
    if (!password) {
      setError("Enter password");
      return;
    }

    // 🔥 Attempt login directly
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password: password.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.message === "User not found") {
        setError("User not registered. Please Sign Up first!");
      } else if (data.message === "Invalid password") {
        setError("Incorrect password. Try again!");
      } else {
        setError(data.message || "Login failed");
      }
      return;
    }

    // ✅ Login success
    localStorage.setItem("user", JSON.stringify(data));
    alert("Login Successful 🎉");
    navigate("/social");
  } catch (err) {
    console.error(err);
    setError("Server error");
  }
};
  // 🔥 SOCIAL LOGIN REDIRECTS
  const handleGoogleLogin = () => {
    window.open("https://accounts.google.com/signin", "_blank");
  };

  const handleFacebookLogin = () => {
    window.open("https://www.facebook.com/login", "_blank");
  };

  const handleGithubLogin = () => {
    window.open("https://github.com/login", "_blank");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>

        {/* EMAIL INPUT */}
        <div className="input-group">
          <input
            type="email"
            placeholder=" "
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
          <label>Email</label>
        </div>

        {/* PASSWORD INPUT */}
        <div className="input-group password-group">
          <input
            type={showPass ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
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

        {/* SOCIAL LOGIN OPTIONS */}
        <div className="divider">
          <span>OR</span>
        </div>

        <button className="social-btn google" onClick={handleGoogleLogin}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="google"
          />
          Continue with Google
        </button>

        <button className="social-btn facebook" onClick={handleFacebookLogin}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
            alt="facebook"
          />
          Continue with Facebook
        </button>

        <button className="social-btn github" onClick={handleGithubLogin}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733609.png"
            alt="github"
          />
          Continue with GitHub
        </button>

        {error && <p className="error-text">{error}</p>}

        <button className="auth-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="switch-text">
          Don’t have an account?
          <span onClick={() => navigate("/register")}>
            {" "}Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
