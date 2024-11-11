
const express = require('express');
const authMiddleware = require('../middlewares/authmiddleware'); // Import your middleware
const User = require('../models/User');
const router = express.Router();

// Backend route handler for fetching user data
router.get('/user-data', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching user data for ID:', req.user.userId);  // Log the user ID being queried
    const user = await User.findById(req.user.userId).select('-password');  // Omit password field

    if (!user) {
      console.log('User not found for ID:', req.user.userId);
      res.status(404).json({ msg: 'User not found' });
    }

    console.log('User data fetched:', user);
    res.json({ user });
  } catch (error) {
    console.error('Error in /user/user-data:', error);  // Detailed error logging
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
