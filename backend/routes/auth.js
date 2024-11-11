const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// RegEx for whitelisting inputs
const validateEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const validateAccountNumber = (accountNumber) => /^\d{10}$/.test(accountNumber);  // 10 digits
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,20}$/.test(password);

// Register a new user (POST request)
router.post('/register', async (req, res) => {
  console.log('Request body:', req.body); // Log the request body
  const { fullName, idNumber, accountNumber, email, password } = req.body;

  // Log request data
  console.log('Registration request:', { fullName, idNumber, accountNumber, email, password });

  // Validate inputs
  if (!validateEmail(email)) {
    console.log('Invalid email format');
    return res.status(400).json({ msg: 'Invalid email format' });
  }
  if (!validateAccountNumber(accountNumber)) {
    console.log('Invalid account number format');
    return res.status(400).json({ msg: 'Invalid account number format' });
  }
  if (!validatePassword(password)) {
    console.log('Invalid password format');
    return res.status(400).json({ msg: 'Password must be 6-20 characters long and include uppercase, lowercase, number, and special character' });
  }

  try {
    let user = await User.findOne({ accountNumber });
    if (user) {
      console.log('Account already exists');
      return res.status(400).json({ msg: 'Account already exists' });
    }

    // Log user creation
    console.log('Creating new user...');
    user = new User({ fullName, idNumber, accountNumber, email, password });
    
    await user.save();
    console.log('User saved:', user);
    res.status(201).json({ msg: 'User registered successfully', user });
  } catch (err) {
    console.error('Error saving user:', err.message);
    res.status(500).send('Server error');
  }
});


// New GET route for retrieving registered users
router.get('/register', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Retrieves all users without passwords
    res.status(200).json({ msg: 'Fetched registered users', users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login user (POST request)
router.post('/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  // Validate inputs
  if (!validateAccountNumber(accountNumber)) {
    return res.status(400).json({ msg: 'Invalid account number format' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ msg: 'Invalid password format' });
  }

  try {
    // Find user by accountNumber
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token and user data as the response
    res.status(200).json({ token, msg: 'Login successful', user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
