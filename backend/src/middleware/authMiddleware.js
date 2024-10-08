const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth Middleware - Headers:', req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth Middleware - Token:', token);
    
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware - Decoded token:', decoded);

    const user = await User.findOne({ where: { id: decoded.userId } });
    console.log('Auth Middleware - User found:', user ? 'Yes' : 'No');

    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware - Error:', error.message);
    res.status(401).send({ error: 'Please authenticate.', details: error.message });
  }
};

module.exports = authMiddleware;