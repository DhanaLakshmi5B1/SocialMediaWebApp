import React from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Social from "./Social"; 
import Search from "./Search";
import Profile from "./Profile";
function App() {
   const isRegistered = localStorage.getItem("registeredUser");
  return (
    <Router>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />
        <Route path="/social" element={<Social />} />
        <Route path="/explore" element={<Search />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
