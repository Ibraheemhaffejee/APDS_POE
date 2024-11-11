// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log('Authentication Middleware - Checking token');

  if (!token) {
    console.log('No token provided, authorization denied');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };  // Check that decoded contains userId
    console.log('Decoded user ID from token:', req.user.userId);  // Log decoded user ID
    console.log(decoded);
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
 
 
 
 
 
 
 
 

