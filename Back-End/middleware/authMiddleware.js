import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import LabStaff from '../models/LabStaff.js';
import SuperAdminDoctor from '../models/SuperAdminDoctor.js';
import SuperAdminReceptionist from '../models/SuperAdminReceptionist.js';


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
      
      // If not found in LabStaff model, try SuperAdminDoctor model
      if (!user) {
        user = await SuperAdminDoctor.findById(decoded.id).select('-password');
      }
      
      // If not found in SuperAdminDoctor model, try SuperAdminReceptionist model
      if (!user) {
        user = await SuperAdminReceptionist.findById(decoded.id).select('-password');
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
  if (req.user && (req.user.role === 'superadmin' || req.user.isSuperAdminStaff === true)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Superadmin only.' });
  }
};

// ✅ New: Center Access Control Middleware
const checkCenterAccess = (req, res, next) => {
  // Superadmin can access all centers
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  
  // Center admin, doctor, receptionist must have a centerId
  if (!req.user || !req.user.centerId) {
    return res.status(403).json({ 
      message: 'Access denied. Center-specific access required.' 
    });
  }
  
  // If accessing a specific center resource, verify it matches user's center
  if (req.params.centerId && req.params.centerId !== req.user.centerId.toString()) {
    return res.status(403).json({ 
      message: 'Access denied. You can only access your own center data.' 
    });
  }
  
  next();
};

// ✅ New: Center Data Isolation Middleware
const ensureCenterIsolation = (req, res, next) => {
  // Superadmin can access all data
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  
  // For center-specific users, ensure they can only access their center's data
  if (req.user && req.user.centerId) {
    // Add centerId to request for controllers to use
    req.centerId = req.user.centerId;
    return next();
  }
  
  return res.status(403).json({ 
    message: 'Access denied. Center-specific access required.' 
  });
};

export { protect, checkSuperAdmin, checkCenterAccess, ensureCenterIsolation };
