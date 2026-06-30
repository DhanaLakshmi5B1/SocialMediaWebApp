import React, { useState, useEffect } from "react";
import "./App.css";

export default function Social() {
  return <Explore />;
}

function Explore() {
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeProfile, setActiveProfile] = useState(null);

  // Infinite scroll
  useEffect(() => {
    loadReels();
  }, []);

  useEffect(() => {
    const feed = document.querySelector(".feed");
    const handleScroll = () => {
      if (feed.scrollTop + feed.clientHeight + 50 >= feed.scrollHeight) {
        loadReels();
      }
    };
    feed.addEventListener("scroll", handleScroll);
    return () => feed.removeEventListener("scroll", handleScroll);
  }, [reels]);

  const sampleVideos = [
    "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  ];

  const loadReels = () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const newReels = Array.from({ length: 5 }, (_, i) => ({
        id: page * 5 + i,
        user: `User${page * 5 + i}`,
        username: `user${page * 5 + i}`,
        profilePic: `https://i.pravatar.cc/150?img=${page * 5 + i}`,
        video: sampleVideos[i % sampleVideos.length],
        description: `This is reel ${page * 5 + i + 1} description.`,
        liked: false,
        likes: Math.floor(Math.random() * 1000),
        comments: [
          { id: 1, user: 'Commenter1', text: 'Nice reel!', profilePic: 'https://i.pravatar.cc/150?u=1' },
          { id: 2, user: 'Commenter2', text: 'Amazing!', profilePic: 'https://i.pravatar.cc/150?u=2' }
        ],
        showShare: false
      }));
      setReels(prev => [...prev, ...newReels]);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 800);
  };

  const toggleLike = (id) => {
    setReels(reels.map(r => r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r));
  };

  const toggleShareDropdown = (id) => {
    setReels(reels.map(r => r.id === id ? { ...r, showShare: !r.showShare } : r));
  };

  const handleShareLink = (reel) => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${reel.username}`);
    alert("Link copied!");
  };

  const addComment = (reelId, text) => {
    if (!text) return;
    setReels(reels.map(r => r.id === reelId ? { ...r, comments: [...r.comments, { id: Date.now(), user: 'You', text, profilePic: 'https://i.pravatar.cc/150?u=99' }] } : r));
  };

  const filteredReels = reels.filter(r => r.description.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="container">
      <div className="sidebar">
        <h2 className="logo">ReelsApp</h2>
        <input type="text" className="search" placeholder="Search..." value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={e => { if(e.key==='Enter') {}}}/>
      </div>

      <div className="feed">
        {filteredReels.map(reel => (
          <div className="reel" key={reel.id}>
            <div className="reel-header">
              <img src={reel.profilePic} className="profile-pic" onClick={() => setActiveProfile(reel)} />
              <span>{reel.user}</span>
            </div>
            <video src={reel.video} controls className="reel-video" />
            <p>{reel.description}</p>

            <div className="actions">
              <span className={`heart ${reel.liked ? 'liked' : ''}`} onClick={() => toggleLike(reel.id)}>{reel.liked ? '❤️' : '🤍'} {reel.likes}</span>
              <div className="share-wrapper">
                <span className="share-btn" onClick={() => toggleShareDropdown(reel.id)}>🔗 Share</span>
                {reel.showShare && (
                  <div className="share-dropdown-horizontal">
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(reel.description)}`} target="_blank" rel="noreferrer">📱 WhatsApp</a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">📸 Instagram</a>
                    <a href="https://www.snapchat.com/" target="_blank" rel="noreferrer">👻 Snapchat</a>
                    <a href="#" onClick={() => handleShareLink(reel)}>📋 Copy Link</a>
                  </div>
                )}
              </div>
            </div>

            <div className="comments-section">
              {reel.comments.map(c => (
                <div className="comment" key={c.id}>
                  <img src={c.profilePic} className="comment-pic" />
                  <div className="comment-text"><b>{c.user}:</b> {c.text}</div>
                </div>
              ))}
              <div className="comment-input">
                <input type="text" placeholder="Add a comment..." onKeyDown={e => {if(e.key==='Enter'){addComment(reel.id, e.target.value); e.target.value='';}}} />
                <button onClick={e => { const val = e.target.previousSibling.value; addComment(reel.id, val); e.target.previousSibling.value='';}}>Post</button>
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="loading">Loading more reels...</div>}
      </div>

      {activeProfile && (
        <div className="profile-modal">
          <button className="close-profile" onClick={() => setActiveProfile(null)}>X</button>
          <img src={activeProfile.profilePic} className="profile-pic-large" />
          <h2>{activeProfile.user}</h2>
          <div className="stats">
            <span>Subscribers: 120</span>
            <span>Videos: {activeProfile.id % 10 + 5}</span>
          </div>
        </div>
      )}
    </div>
  );
}