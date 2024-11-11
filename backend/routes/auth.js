const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const router = express.Router();

// Regular expressions for whitelisting inputs
const validateEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const validateAccountNumber = (accountNumber) => /^\d{10}$/.test(accountNumber);  // 10 digits
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,20}$/.test(password);

// Register a new user (POST request)
/* router.post( */
/*   '/register', */
/*   [ */
/*     // Use express-validator to validate and sanitize user inputs */
/*     body('email').isEmail().withMessage('Invalid email format').normalizeEmail(), */
/*     body('accountNumber').isLength({ min: 10, max: 10 }).isNumeric().withMessage('Invalid account number format'), */
/*     body('password').isLength({ min: 6, max: 20 }).withMessage('Password must be 6-20 characters long'), */
/*     body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/).withMessage('Password must include uppercase, lowercase, number, and  */special character')
/*   ], */
/*   async (req, res) => { */
/*     const errors = validationResult(req); */
/*     if (!errors.isEmpty()) { */
/*       return res.status(400).json({ errors: errors.array() }); */
/*     } */
/*  */
/*     const { fullName, idNumber, accountNumber, email, password } = req.body; */
/*  */
/*     try { */
/*       // Check if user already exists */
/*       let user = await User.findOne({ accountNumber }); */
/*       if (user) { */
/*         return res.status(400).json({ msg: 'Account already exists' }); */
/*       } */
/*  */
/*       // Create new user */
/*       user = new User({ fullName, idNumber, accountNumber, email, password }); */
/*  */
/*       // Hash password before saving */
/*       user.password = await bcrypt.hash(password, 10); */
/*  */
/*       await user.save(); */
/*       res.status(201).json({ msg: 'User registered successfully' }); */
/*     } catch (err) { */
/*       console.error('Error saving user:', err.message); */
/*       res.status(500).send('Server error'); */
/*     } 
  }
);*/

// New GET route for retrieving registered users
/* router.get('/register', async (req, res) => { */
/*   try { */
/*     const users = await User.find().select('-password'); // Exclude passw */ords
/*     res.status(200).json({ msg: 'Fetched registered users', users }); */
/*   } catch (err) { */
/*     console.error(err.message); */
/*     res.status(500).send('Server error'); */
/*   } */
/* }); */
/*  */
// Login user (POST request)
router.post(
  '/login',
  [
    body('accountNumber').isLength({ min: 10, max: 10 }).isNumeric().withMessage('Invalid account number format'),
    body('password').isLength({ min: 6, max: 20 }).withMessage('Password must be 6-20 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountNumber, password } = req.body;

    try {
      // Find user by account number
      const user = await User.findOne({ accountNumber });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token, msg: 'Login successful' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
