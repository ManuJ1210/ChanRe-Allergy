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
      
      // Preserve the userType from the JWT token
      user.userType = decoded.userType;
      
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

// Check if user has access to center-specific data
const checkCenterAccess = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  next();
};

// Ensure center isolation for data access
const ensureCenterIsolation = (req, res, next) => {
  // Debug logging
  console.log('🔍 Center Isolation Debug - User:', {
    id: req.user?._id,
    role: req.user?.role,
    userType: req.user?.userType,
    centerId: req.user?.centerId,
    name: req.user?.name
  });
  
  // Superadmin can access all data
  if (req.user && req.user.role === 'superadmin') {
    console.log('✅ Superadmin access granted');
    return next();
  }
  
  // Lab staff can access lab-related endpoints
  if (req.user && req.user.userType === 'LabStaff') {
    console.log('✅ Lab staff access granted');
    return next();
  }
  
  // Special handling for receptionists - allow them to work temporarily without centerId
  if (req.user && req.user.role === 'receptionist' && !req.user.centerId) {
    console.log('⚠️ Receptionist without centerId - allowing temporary access');
    console.log('🔧 TODO: Fix user data to include centerId');
    return next();
  }
  
  // For all other roles, ensure they have a centerId
  if (!req.user || !req.user.centerId) {
    console.log('❌ Center isolation failed - No user or centerId');
    return res.status(403).json({ 
      message: 'Access denied. Center-specific access required. User must be assigned to a center.',
      debug: {
        hasUser: !!req.user,
        hasCenterId: !!req.user?.centerId,
        userRole: req.user?.role,
        userType: req.user?.userType,
        userId: req.user?._id,
        userName: req.user?.name
      }
    });
  }
  
  console.log('✅ Center isolation passed');
  next();
};

export { protect, checkSuperAdmin, checkCenterAccess, ensureCenterIsolation };
 
// Require specific roles
export const ensureRole = (...roles) => (req, res, next) => {
  try {
    const userRole = req.user?.role;
    if (userRole && roles.includes(userRole)) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied.' });
  } catch (e) {
    return res.status(403).json({ message: 'Access denied.' });
  }
};

export const ensureDoctor = (req, res, next) => {
  if (req.user && req.user.role === 'doctor') return next();
  return res.status(403).json({ message: 'Only doctors can perform this action.' });
};