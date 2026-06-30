import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsRegistered(true);
    }
  }, []);

  // LOGIN BUTTON CLICK
  const handleLoginClick = () => {
  const isRegistered = localStorage.getItem("registeredUser");

  if (!isRegistered) {
    setError("Please Sign Up First");
    return;
  }

  navigate("/login");
};

  const handleProtectedClick = () => {
  const isRegistered = localStorage.getItem("registeredUser");

  if (!isRegistered) {
    setError("Please Sign Up First");
    return;
  }

  const loggedUser = localStorage.getItem("user");

  if (!loggedUser) {
    setError("Please Login First");
    return;
  }

  navigate("/social");
};
  return (
    <div className="home-container">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          Connect<span>Hub</span>
        </div>

        <div className="nav-links">
          <button
            className="login-btn"
            onClick={handleLoginClick}
          >
            Log in
          </button>

          <button
            className="signup-btn"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">

        <div className="tagline">✨ Your community awaits</div>

        <h1>
          Where Ideas <br />
          <span>Come Alive</span>
        </h1>

        <p>
          Share your story, connect with creators, and discover what's trending.
          A social experience designed for meaningful connections.
        </p>

        {error && (
          <p style={{ color: "red", marginTop: "15px", fontWeight: "600" }}>
            {error}
          </p>
        )}

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={handleProtectedClick}
          >
            Start Exploring →
          </button>

          <button
            className="secondary-btn"
            onClick={handleProtectedClick}
          >
            Learn More
          </button>
        </div>

      </section>

    </div>
  );
}

export default Home;
