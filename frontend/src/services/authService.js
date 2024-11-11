import axios from './axiosConfig';

// Register new user
export const register = async (userData) => {
  return axios.post('/auth/register', userData);
};

// Login user
export const login = async (credentials) => {
  return axios.post('/auth/login', credentials);
};

// Fetch current user data
export const fetchUserData = async (token) => {
  return axios.get('/user/user-data',{
    headers: { 'x-auth-token': token }
  });
 
  
};
