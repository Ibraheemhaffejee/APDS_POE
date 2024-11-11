// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure `user` is required and references `User`
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
