const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// CREATE POST
router.post("/", async (req, res) => {
  try {
    const { userId, content, image, type } = req.body;
    if (!content && !image)
      return res.status(400).json({ message: "Post cannot be empty" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Post({
      user: user._id,
      content,
      image: type === "image" ? image : "",
      type
    });

    const savedPost = await newPost.save();
    await savedPost.populate("user", "username email profileImage");
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email profileImage")
      .populate("comments.user", "username email profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LIKE / UNLIKE POST
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post Liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post Unliked");
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD COMMENT
router.post("/comments", async (req, res) => {
  try {
    const { postId, userId, text } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();
    await post.populate("comments.user", "username email profileImage");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;