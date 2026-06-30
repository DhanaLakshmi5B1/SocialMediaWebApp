const router = require("express").Router();
const Comment = require("../models/Comment");

// ✅ CREATE COMMENT
router.post("/", async (req, res) => {
  try {
    const newComment = new Comment({
      post: req.body.postId,
      user: req.body.userId,
      text: req.body.text,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    console.error("COMMENT SAVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET COMMENTS BY POST
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;