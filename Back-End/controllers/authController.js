import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, centerId: user.centerId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
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
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || 'N/A',
        centerId: user.centerId || null, // <-- always return null if not set
      },
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
    const user = await User.findOne({ email });

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
