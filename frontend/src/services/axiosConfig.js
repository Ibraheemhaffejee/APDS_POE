// services/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
