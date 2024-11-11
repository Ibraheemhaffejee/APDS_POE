// services/postService.js
import axios from './axiosConfig'; // assuming axiosConfig has the base URL

export const createPost = async (content) => {
  const token = localStorage.getItem('token');  // Get token from localStorage
  return axios.post('/api/posts', { content }, {
    headers: { 'x-auth-token': token }
  });
};
