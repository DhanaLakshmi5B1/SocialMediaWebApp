import React, { useState, useEffect } from "react";
import "./App.css";

export default function SearchSocial() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postType, setPostType] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
const [commentsByPost, setCommentsByPost] = useState({});

  // ✅ Load user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // ================= GOOGLE SEARCH =================
  const handleSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_SEARCH_ENGINE_ID&q=${value}`
      );
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // ================= HANDLE IMAGE FILE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFilePreview(imageURL);
      setInputValue(imageURL);
    }
  };

  // ================= CREATE POST =================
  const handlePost = async () => {
  if (!inputValue.trim() || !storedUser) return;

  const postData =
    postType === "image"
      ? {
          userId: storedUser._id,
          content: "",
          image: inputValue,
          type: "image"
        }
      : {
          userId: storedUser._id,
          content: inputValue,
          image: "",
          type: "text"
        };

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });
      const newPost = await res.json();

      // ✅ Prepend new post to feed
      setUserPosts([newPost, ...userPosts]);

      // ✅ Reset input and close modal
      setInputValue("");
      setFilePreview(null);
      setShowModal(false);
    } catch (err) {
      console.error("Post error:", err);
    }
  };
const loadComments = async (postId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/comments/${postId}`);
    const data = await res.json();

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: data
    }));
  } catch (err) {
    console.error("Fetch comments error:", err);
  }
};
  // ================= LOAD USER POSTS =================
  const loadUserPosts = async () => {
    if (!storedUser) return;
    try {
      const res = await fetch("http://localhost:5000/api/posts");
      const allPosts = await res.json();
      // ✅ Filter only logged-in user's posts
      const myPosts = allPosts.filter((post) => post.user._id === storedUser._id);
      setUserPosts(myPosts);
      myPosts.forEach((post) => loadComments(post._id));
    } catch (err) {
      console.error("Fetch posts error:", err);
    }
  };

  useEffect(() => {
    loadUserPosts();
  }, []);
  const handleAddComment = async (postId) => {
  const text = commentInputs[postId];
  if (!text?.trim()) return;

  try {
    const res = await fetch("http://localhost:5000/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        userId: storedUser._id,
        text
      })
    });

    if (res.ok) {
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      loadComments(postId);
    }
  } catch (err) {
    console.error("Add comment error:", err);
  }
};

  return (
    <div className="page">
      {/* SEARCH BAR */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search anything..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* GOOGLE RESULTS */}
      {query && (
        <div className="results">
          {results.length > 0 ? (
            results.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="result-item"
              >
                <h4>{item.title}</h4>
                <p>{item.snippet}</p>
              </a>
            ))
          ) : (
            <div className="no-result">No results found</div>
          )}
        </div>
      )}

     <div className="posts-feed">
  {userPosts.map((post) => (
    <div key={post._id} className="post-card">

      {/* POST CONTENT */}
      {post.type === "image" && post.image ? (
        <div className="image-post">
          <img src={post.image} alt="post" />
        </div>
      ) : (
        <div className="text-post">
          {post.content}
        </div>
      )}

      {/* COMMENTS LIST */}
      <div className="comments-section">
        {(commentsByPost[post._id] || []).map((comment) => (
          <div key={comment._id} className="comment">
            {comment.text}
          </div>
        ))}
      </div>

      {/* ADD COMMENT INPUT */}
      <div className="add-comment">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInputs[post._id] || ""}
          onChange={(e) =>
            setCommentInputs({
              ...commentInputs,
              [post._id]: e.target.value
            })
          }
        />
        <button onClick={() => handleAddComment(post._id)}>
          Comment
        </button>
      </div>

    </div>
  ))}
</div>

      {/* FLOATING BUTTON */}
      <div className="floating-btn" onClick={() => setShowModal(true)}>
        +
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h2>Create Post</h2>

            <div className="type-buttons">
              <button
                className={postType === "text" ? "active" : ""}
                onClick={() => setPostType("text")}
              >
                Text
              </button>
              <button
                className={postType === "image" ? "active" : ""}
                onClick={() => setPostType("image")}
              >
                Image
              </button>
            </div>

            {postType === "text" ? (
              <textarea
                placeholder="Write something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ marginTop: "10px", color: "white" }}
                />
                {filePreview && (
                  <img src={filePreview} alt="preview" className="preview-image" />
                )}
              </>
            )}

            <div className="modal-actions">
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="submit" onClick={handlePost}>
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}