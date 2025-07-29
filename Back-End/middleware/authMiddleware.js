import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import LabStaff from '../models/LabStaff.js';

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Use environment variable or fallback to a default secret
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
      const decoded = jwt.verify(token, jwtSecret);
      
      // First try to find user in User model
      let user = await User.findById(decoded.id).select('-password').populate('centerId', 'name code');
      
      // If not found in User model, try LabStaff model
      if (!user) {
        user = await LabStaff.findById(decoded.id).select('-password');
      }
      
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('Token validation failed', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const checkSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Superadmin only.' });
  }
};

export { protect, checkSuperAdmin };
