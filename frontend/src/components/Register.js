// components/Register.js
import React, { useState } from 'react';
import axios from '../services/axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', idNumber: '', accountNumber: '', email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/auth/register', formData);
      alert('Registration successful!');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p>{error}</p>}
      <input type="text" name="fullName" placeholder="Full Name" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
      <input type="text" name="idNumber" placeholder="ID Number" onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} />
      <input type="text" name="accountNumber" placeholder="Account Number" onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
      <input type="email" name="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="password" name="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
