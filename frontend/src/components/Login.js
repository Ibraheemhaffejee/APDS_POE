// components/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from '../services/axiosConfig';
import ErrorMessage from './ErrorMessage';

const Login = () => {
  const { login } = useContext(AuthContext); // Access login function from AuthContext
  const [formData, setFormData] = useState({ accountNumber: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    try {
      const res = await axios.post('/auth/login', formData); // Send login request
      const { token, user } = res.data; // Destructure token and user data from response

      localStorage.setItem('token', token); // Store token in localStorage
      login(token, user); // Call the login function from AuthContext to set auth state
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <ErrorMessage message={error} />}
      <input
        type="text"
        name="accountNumber"
        placeholder="Account Number"
        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
