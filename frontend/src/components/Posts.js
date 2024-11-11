// components/Posts.js
import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';

const Posts = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/posts')
        .then((res) => setPosts(res.data))
        .catch((err) => setError('Failed to load posts'));
    }
  }, [isAuthenticated]);

  const createPost = () => {
    if (!newPost.trim()) {
      setError("Post content can't be empty");
      return;
    }

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    axios.post('/posts', { content: newPost }, {
      headers: { 'x-auth-token': token } // Add token to request headers
    })
      .then((res) => {
        setPosts([...posts, res.data]);
        setNewPost('');
      })
      .catch((err) => setError(err.response?.data?.msg || 'Failed to create post'));
  };
  const deletePost = (postId) => {
  
    //const token = localStorage.getItem('token');
    axios.delete(`/posts/${postId}`, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    })
      .then(() => setPosts(posts.filter((post) => post._id !== postId)))
      .catch((err) => setError('Failed to delete post'));
  };
  

  return (
    <div>
      <input type="text" value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Create a post" />
      <button onClick={createPost}>Create Post</button>
      {error && <p>{error}</p>}
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            {post.content}
            <button onClick={() => deletePost(post._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
