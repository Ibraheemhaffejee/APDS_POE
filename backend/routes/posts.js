// routes/posts.js
const express = require('express');
const authMiddleware = require('../middlewares/authmiddleware'); // Ensure this is the correct path

const router = express.Router();
const Post = require('../models/Post'); // Assuming a Post model is defined

// Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by latest
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load posts' });
  }
});

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ msg: 'Content cannot be empty' });

  try {
    const newPost = new Post({ content, user: req.user.userId });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    console.error('Error creating post:', err); // Log the detailed error
    res.status(500).json({ msg: 'Failed to create post' });
  }
});

// Delete a post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Attempting to delete post with ID:', req.params.id);
    const post = await Post.findById(req.params.id);

    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ msg: 'Post not found' });
    }

    console.log('Post found, belongs to user:', post.user);
    console.log('Requesting user ID:', req.user.userId);

    // Ensure the user attempting to delete the post is the owner
    if (post.user.toString() !== req.user.userId) {
      console.log('Unauthorized: user does not own this post');
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    await post.remove();
    console.log('Post deleted successfully');
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error('Error deleting post:', err); // Log the error for debugging
    res.status(500).json({ msg: 'Failed to delete post' });
  }
});
  

module.exports = router;
