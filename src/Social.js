import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notifications";
import "./App.css";

// ================= POST INPUT =================
function PostInput({ userId, onPost }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    if (!text && !image) return alert("Post cannot be empty");

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content: text, image }),
      });

      const data = await res.json();

      // format frontend post same as feed
      const newPost = {
        id: data._id,
        user: data.user?.username || "User",
        username: data.user?.username || "user",
        profilePic: data.user?.profilePic || `https://i.pravatar.cc/150?u=${data._id}`,
        content: data.content,
        image: data.image || "",
        liked: false,
        likes: data.likes?.length || 0,
        comments: data.comments || [],
        showShare: false,
      };

      onPost(newPost);
      setText("");
      setImage("");
    } catch (err) {
      console.log("Post error:", err);
    }
  };

  return (
    <div className="post-input">
      <input
        type="text"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
}

// ================= DASHBOARD =================
export default function Social() {
  return <Dashboard />;
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState("text");
  const [notificationTrigger, setNotificationTrigger] = useState(null);
  const navigate = useNavigate();

  const triggerNotification = (type) => {
    setNotificationTrigger({ type, time: Date.now() });
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">BuzzFeed</h2>
        <div className="menu" onClick={() => setActiveTab("text")}>📝 Text</div>
        <div className="menu" onClick={() => setActiveTab("images")}>🖼️ Images</div>
        <div className="menu" onClick={() => navigate("/explore")}>🔍 Explore</div>
        <div className="menu">🔔 Notifications<Notifications newTrigger={notificationTrigger} /></div>
        <div className="menu" onClick={() => navigate("/profile")}>👤 Profile</div>
      </div>

      {/* Main Feed */}
      <div className="feed-section">
        {activeTab === "text" ? (
          <TextFeed triggerNotification={triggerNotification} />
        ) : (
          <ImagesFeed triggerNotification={triggerNotification} />
        )}
      </div>

      {/* Rightbar */}
      <div className="rightbar">
        <h3>Suggested for you</h3>
        <div className="suggest">Jordan Blake</div>
        <div className="suggest">Leo Martinez</div>
      </div>
    </div>
  );
}

// ================= TEXT FEED =================
function TextFeed({ triggerNotification }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userPostsMap, setUserPostsMap] = useState({});
  const [activeProfile, setActiveProfile] = useState(null);
  const [profilePosts, setProfilePosts] = useState([]);
  const feedRef = useRef();

  // load posts from backend
  useEffect(() => {
    const loadPostsFromBackend = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts");
        const data = await res.json();
        const formattedPosts = data.map(p => ({
          id: p._id,
          user: p.user?.username || "User",
          username: p.user?.username || "user",
          profilePic: p.user?.profilePic || `https://i.pravatar.cc/150?u=${p._id}`,
          content: p.content || "",
          image: p.image || "",
          liked: false,
          likes: p.likes?.length || 0,
          comments: p.comments || [],
          showShare: false,
        }));
        setPosts(formattedPosts);
      } catch (err) {
        console.log("Posts fetch error:", err);
      }
    };
    loadPostsFromBackend();
  }, []);

  const users = [
    { user: "Jordan Blake", username: "jordanb" },
    { user: "Leo Martinez", username: "leom" },
    { user: "Sophia Liu", username: "sophial" },
    { user: "Carlos Vega", username: "carlosv" },
    { user: "Mia Wong", username: "miaw" },
  ];

  const contents = [
    "Drank water 💧","Went to the park 🌳","Cooking dinner 🍝",
    "Went shopping 🛒","Reading a book 📚","Coding all night 👨‍💻",
    "Watching a movie 🎬","Played football ⚽","Enjoying coffee ☕",
    "Listening to music 🎵","Traveling ✈️","Relaxing at home 🛋️"
  ];

  useEffect(() => {
    loadDummyPosts();

    const userPosts = JSON.parse(localStorage.getItem("userPosts")) || [];
    const textPosts = userPosts.filter(p => p.type === "text").map(p => ({ ...p, showShare: false }));
    setPosts(prev => [...textPosts, ...prev]);
  }, []);

  useEffect(() => {
    const feed = feedRef.current;
    const handleScroll = () => {
      if (feed.scrollTop + feed.clientHeight + 50 >= feed.scrollHeight) loadDummyPosts();
    };
    feed && feed.addEventListener("scroll", handleScroll);
    return () => feed && feed.removeEventListener("scroll", handleScroll);
  }, [posts]);

  const loadDummyPosts = () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const newPosts = users.map((u, i) => {
        if (!userPostsMap[u.username]) {
          const postCount = Math.floor(Math.random() * 10) + 1;
          const userPosts = Array.from({ length: postCount }, (_, idx) => ({
            id: i * 1000 + idx + Math.floor(Math.random() * 1000),
            user: u.user,
            username: u.username,
            profilePic: `https://i.pravatar.cc/150?u=${u.username}${Math.random()}`,
            content: contents[Math.floor(Math.random() * contents.length)],
            liked: false,
            likes: Math.floor(Math.random() * 100),
            comments: [],
            showShare: false,
          }));
          userPostsMap[u.username] = userPosts;
        }
        const randomPost = userPostsMap[u.username][Math.floor(Math.random() * userPostsMap[u.username].length)];
        return { ...randomPost, showShare: false };
      });

      setPosts(prev => [...prev, ...newPosts]);
      setUserPostsMap({ ...userPostsMap });
      setLoading(false);
    }, 600);
  };

  const toggleLike = (id, isProfile = false) => {
    triggerNotification("like");
    if (isProfile) {
      setProfilePosts(profilePosts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    } else {
      setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    }
  };

  const toggleShareDropdown = (id, isProfile = false) => {
    if (isProfile) setProfilePosts(profilePosts.map(p => p.id === id ? { ...p, showShare: !p.showShare } : p));
    else setPosts(posts.map(p => p.id === id ? { ...p, showShare: !p.showShare } : p));
  };

  const handleShareLink = (post) => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${post.username}`);
    alert("Link copied!");
    triggerNotification("share");
  };

  const openProfile = (username) => {
    setActiveProfile(username);
    if (userPostsMap[username]) setProfilePosts(userPostsMap[username]);
  };

  const addComment = async (postId, text, isProfile = false) => {
  if (!storedUser) {
    alert("Login required");
    return;
  }

  try {
    await fetch("http://localhost:5000/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        userId: storedUser._id,
        text
      }),
    });

    triggerNotification("comment");
    loadComments(postId);

  } catch (err) {
    console.log("Comment save error:", err);
  }
};

  const loadComments = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${postId}`);
      const data = await res.json();
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: data } : p));
    } catch (err) { console.log("Comments fetch error:", err); }
  };

  const renderPost = (post, isProfile = false) => (
    <div className="post" key={post.id}>
      <div className="post-header">
        <img src={post.profilePic} alt="profile" className="profile-pic" onClick={() => !isProfile && openProfile(post.username)} />
        <div className="post-user" onClick={() => !isProfile && openProfile(post.username)}>{post.user}</div>
      </div>

      <div className="post-content">{post.content}</div>

      {post.image && <img src={post.image} alt="post" className="post-image" />}

      <div className="post-actions">
        <span className={`heart ${post.liked ? "liked" : ""}`} onClick={() => toggleLike(post.id, isProfile)}>
          {post.liked ? "❤️" : "🤍"}
        </span>
        <span className="like-count">{post.likes}</span>
        <span className="share-btn" onClick={() => toggleShareDropdown(post.id, isProfile)}>🔗 Share</span>
        {post.showShare && (
          <div className="share-dropdown-horizontal">
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.content)}`} target="_blank" rel="noreferrer">📱 WhatsApp</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">📸 Instagram</a>
            <a href="https://www.snapchat.com/" target="_blank" rel="noreferrer">👻 Snapchat</a>
            <a href="#" onClick={() => handleShareLink(post)}>📋 Copy Link</a>
          </div>
        )}
      </div>

      <div className="comments-section">
        <h4>Comments ({post.comments.length})</h4>
        {(Array.isArray(post.comments) ? post.comments : []).map((c, idx) => (
          <div className="comment" key={idx}>
            <img src={c.profilePic} alt="cprofile" className="comment-pic" />
            <div className="comment-text"><strong>{c.user}</strong>: {c.text}</div>
          </div>
        ))}
        <CommentInput onAdd={(text) => addComment(post.id, text, isProfile)} />
      </div>
    </div>
  );

  return (
    <div className="feed" ref={feedRef}>
      <PostInput userId={"LOGGED_IN_USER_ID"} onPost={(newPost) => setPosts([newPost, ...posts])} />
      {posts.map(p => renderPost(p))}
      {loading && <div className="loading">Loading more posts...</div>}

      {activeProfile && (
        <div className="profile-modal">
          <button className="close-profile" onClick={() => setActiveProfile(null)}>✖</button>
          <div className="profile-card">
            <img src={`https://i.pravatar.cc/150?u=${activeProfile}`} alt="profile" className="profile-pic-large" />
            <h2>@{activeProfile}</h2>
            <p>Creative Developer | Content Creator 🚀</p>
            <div className="stats">
              <span>Total Posts: {profilePosts.length}</span>
              <span>Followers: 120</span>
              <span>Following: 75</span>
            </div>
          </div>
          <div className="profile-posts">
            {profilePosts.map(p => renderPost(p, true))}
          </div>
        </div>
      )}
    </div>
  );
}

// ================= IMAGES FEED =================
function ImagesFeed({ triggerNotification }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  const [profilePosts, setProfilePosts] = useState([]);
  const feedRef = useRef();

  const users = [
    { user: "Jordan Blake", username: "jordanb" },
    { user: "Leo Martinez", username: "leom" },
    { user: "Sophia Liu", username: "sophial" },
    { user: "Carlos Vega", username: "carlosv" },
    { user: "Mia Wong", username: "miaw" },
  ];

  const imageUrls = [
    "https://picsum.photos/500/600?random=1",
    "https://picsum.photos/500/600?random=2",
    "https://picsum.photos/500/600?random=3",
    "https://picsum.photos/500/600?random=4",
    "https://picsum.photos/500/600?random=5",
    "https://picsum.photos/500/600?random=6",
    "https://picsum.photos/500/600?random=7",
    "https://picsum.photos/500/600?random=8",
  ];

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    const feed = feedRef.current;
    const handleScroll = () => { if (feed.scrollTop + feed.clientHeight + 50 >= feed.scrollHeight) loadImages(); };
    feed && feed.addEventListener("scroll", handleScroll);
    return () => feed && feed.removeEventListener("scroll", handleScroll);
  }, [images]);

  const loadImages = () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const newImages = [];
      users.forEach((u, i) => {
        const postCount = Math.floor(Math.random() * 5) + 1;
        for (let idx = 0; idx < postCount; idx++) {
          newImages.push({
            id: i * 1000 + idx + Math.floor(Math.random() * 1000),
            user: u.user,
            username: u.username,
            profilePic: `https://i.pravatar.cc/150?u=${u.username}${Math.random()}`,
            imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)] + `?random=${Math.random()}`,
            liked: false,
            likes: Math.floor(Math.random() * 100),
            comments: [],
          });
        }
      });

      setImages(prev => [...prev, ...newImages]);
      setLoading(false);
    }, 600);
  };

  const toggleLike = (id) => {
    triggerNotification("like");
    setImages(images.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const openProfile = (username) => {
    setActiveProfile(username);
    const filteredPosts = images.filter(img => img.username === username);
    setProfilePosts(filteredPosts);
  };

  const renderImagePost = (post) => (
    <div className="image-post" key={post.id}>
      <img src={post.imageUrl} alt="post" className="post-image" />
      <div className="image-overlay">
        <div className="reel-user" onClick={() => openProfile(post.username)}>
          <img src={post.profilePic} alt="profile" className="profile-pic-small" /> {post.user}
        </div>
        <div className="reel-actions">
          <span className={`heart ${post.liked ? "liked" : ""}`} onClick={() => toggleLike(post.id)}>
            {post.liked ? "❤️" : "🤍"} {post.likes}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="reels-feed" ref={feedRef}>
      {images.map(renderImagePost)}
      {loading && <div className="loading">Loading more images...</div>}

      {activeProfile && (
        <div className="profile-modal">
          <button className="close-profile" onClick={() => setActiveProfile(null)}>✖</button>
          <div className="profile-card">
                        <img src={`https://i.pravatar.cc/150?u=${activeProfile}`} alt="profile" className="profile-pic-large" />
            <h2>@{activeProfile}</h2>
            <p>Content Creator 🚀</p>
            <div className="stats">
              <span>Total Posts: {profilePosts.length}</span>
              <span>Followers: 120</span>
              <span>Following: 75</span>
            </div>
          </div>
          <div className="profile-posts">
            {profilePosts.map(renderImagePost)}
          </div>
        </div>
      )}
    </div>
  );
}

// ================= COMMENT INPUT =================
function CommentInput({ onAdd }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  };

  return (
    <div className="comment-input">
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
      />
      <button onClick={handleAdd}>Post</button>
    </div>
  );
}