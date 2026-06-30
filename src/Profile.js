import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState("");
  const [changePass, setChangePass] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // ✅ NEW STATES FOR THREE DOT MENU
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(storedUser);
      setPreview(storedUser.profileImage || "");
      setNotificationsEnabled(storedUser.notifications ?? true);
    }
  }, [navigate]);

  // ✅ CLOSE MENU WHEN CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ================= IMAGE UPLOAD =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...user, profileImage: reader.result };
      setUser(updatedUser);
      setPreview(reader.result);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  // ✅ DELETE PROFILE IMAGE
  const handleDeleteImage = () => {
    const confirmDelete = window.confirm("Delete profile image?");
    if (!confirmDelete) return;

    const updatedUser = { ...user, profileImage: "" };
    setUser(updatedUser);
    setPreview("");
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowMenu(false);
  };

  // ================= SAVE EDITED NAME =================
  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setEditing(false);
  };

  // ================= CHANGE PASSWORD =================
  const handlePasswordChange = () => {
    if (changePass.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    const updatedUser = { ...user, password: changePass };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setChangePass("");
    alert("Password Updated Successfully ✅");
  };

  // ================= TOGGLE NOTIFICATIONS =================
  const handleNotificationToggle = () => {
    const updatedUser = { ...user, notifications: !notificationsEnabled };
    setNotificationsEnabled(!notificationsEnabled);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // ================= DELETE ACCOUNT =================
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );

    if (confirmDelete) {
      localStorage.removeItem("user");
      alert("Account Deleted Successfully ❌");
      navigate("/");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className={darkMode ? "profile-container dark" : "profile-container"}>
      <div className="profile-card-advanced">

        {/* PROFILE IMAGE SECTION */}
        <div className="profile-image-wrapper" ref={menuRef}>

          {/* THREE DOT MENU BUTTON */}
          <div 
            className="three-dots"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </div>

          {/* DROPDOWN MENU */}
          {showMenu && (
            <div className="image-menu">
              <button onClick={handleDeleteImage}>
                🗑 Delete Photo
              </button>
            </div>
          )}

          <img
            src={
              preview
                ? preview
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="profile-image"
          />

          <label className="camera-icon">
            📷
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* USER DETAILS */}
        <div className="profile-details">
          {editing ? (
            <input
              type="text"
              value={user.name}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
              className="edit-input"
            />
          ) : (
            <h2>{user.name}</h2>
          )}

          <p><strong>Email:</strong> {user.email}</p>
          <p>
            <strong>Password:</strong>{" "}
            {"•".repeat(user.password?.length || 8)}
          </p>

          {editing ? (
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          ) : (
            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* SETTINGS SECTION */}
        <div className="settings-section">
          <h3>Account Settings</h3>

          <div className="setting-item">
            <span>🌙 Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>

          <div className="setting-item">
            <span>🔔 Notifications</span>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleNotificationToggle}
            />
          </div>

          <div className="change-password-box">
            <input
              type="password"
              placeholder="New Password"
              value={changePass}
              onChange={(e) => setChangePass(e.target.value)}
            />
            <button onClick={handlePasswordChange}>
              Change Password
            </button>
          </div>

          <button className="delete-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default Profile;
