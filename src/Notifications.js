import React, { useState, useEffect } from "react";
import "./App.css";

export default function Notifications({ newTrigger }) {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (newTrigger && newTrigger.type) {

      let message = "";

      switch (newTrigger.type) {
        case "like":
          message = "❤️ You liked a post";
          break;

        case "comment":
          message = "💬 You commented on a post";
          break;

        case "share":
          message = "🔗 You shared a post";
          break;

        case "create":
          message = "🎉 New post created successfully";
          break;

        default:
          message = "🔔 New activity";
      }

      const newNotification = {
        id: Date.now(),
        message,
        time: new Date().toLocaleTimeString()
      };

      setNotifications((prev) => [newNotification, ...prev]);
    }
  }, [newTrigger]);

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-wrapper">

      {/* Bell Icon */}
      <div
        className="bell"
        onClick={() => setShowPanel(!showPanel)}
      >
        🔔
        {notifications.length > 0 && (
          <span className="badge">{notifications.length}</span>
        )}
      </div>

      {/* Notification Panel */}
      {showPanel && (
        <div className="notification-panel">
          <div className="panel-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={clearAll}>Clear</button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="empty">No notifications</div>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className="notification-item">
                <p>{item.message}</p>
                <span>{item.time}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}