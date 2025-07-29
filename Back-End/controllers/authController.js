import User from '../models/User.js';
import LabStaff from '../models/LabStaff.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    centerId: user.centerId || null,
  };
  
  // Add labId for lab staff
  if (user.labId) {
    payload.labId = user.labId;
  }
  
  // Use environment variable or fallback to a default secret
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
  
  return jwt.sign(payload, jwtSecret, { expiresIn: '30d' });
};

// Register Controller
export const register = async (req, res) => {
  const { name, email, password, role, phone, centerId } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      centerId: centerId || null,
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || 'N/A',
        centerId: user.centerId || 'N/A',
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // First try to find user in User model
    let user = await User.findOne({ email }).populate('centerId', 'name code');
    let userType = 'user';

    // If not found in User model, try LabStaff model
    if (!user) {
      user = await LabStaff.findOne({ email });
      userType = 'labStaff';
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Prepare user data based on type
    let userData;
    if (userType === 'user') {
      userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || 'N/A',
        centerId: user.centerId,
      };
    } else {
      userData = {
        id: user._id,
        staffName: user.staffName,
        name: user.staffName, // For compatibility
        email: user.email,
        role: user.role,
        phone: user.phone,
        labId: user.labId,
        centerId: null, // Lab staff don't belong to centers
      };
    }

    res.json({
      user: userData,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    // First try to find user in User model
    let user = await User.findOne({ email });

    // If not found in User model, try LabStaff model
    if (!user) {
      user = await LabStaff.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

// Get Current User Controller
export const getCurrentUser = async (req, res) => {
  try {
    // First try to find user in User model
    let user = await User.findById(req.user._id)
      .select('-password')
      .populate('centerId', 'name code');

    // If not found in User model, try LabStaff model
    if (!user) {
      user = await LabStaff.findById(req.user._id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare user data based on type
    let userData;
    if (user.centerId !== undefined) {
      // Regular user
      userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || 'N/A',
        centerId: user.centerId,
      };
    } else {
      // Lab staff
      userData = {
        id: user._id,
        staffName: user.staffName,
        name: user.staffName, // For compatibility
        email: user.email,
        role: user.role,
        phone: user.phone,
        labId: user.labId,
        centerId: null,
      };
    }

    res.json({ user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user information', error: err.message });
  }
};
