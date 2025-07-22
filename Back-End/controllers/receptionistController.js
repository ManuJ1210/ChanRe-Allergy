import User from '../models/User.js';

// Create a new receptionist
export const createReceptionist = async (req, res) => {
  try {
    const { name, phone, email, username, password } = req.body;
    // Check for existing email or username
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'Receptionist with this email or username already exists' });
    }
    const receptionist = await User.create({
      name,
      phone,
      email,
      username,
      password,
      role: 'receptionist',
      centerId: req.body.centerId, // <-- add this line
    });
    res.status(201).json(receptionist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create receptionist', error: err.message });
  }
};

// Get all receptionists
export const getAllReceptionists = async (req, res) => {
  try {
    const receptionists = await User.find({ role: 'receptionist' }).select('-password');
    res.status(200).json(receptionists);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch receptionists', error: err.message });
  }
};

// Get a single receptionist by ID
export const getReceptionistById = async (req, res) => {
  try {
    const receptionist = await User.findById(req.params.id).select('-password');
    if (!receptionist || receptionist.role !== 'receptionist') {
      return res.status(404).json({ message: 'Receptionist not found' });
    }
    res.status(200).json(receptionist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch receptionist', error: err.message });
  }
};

// Delete a receptionist by ID
export const deleteReceptionist = async (req, res) => {
  try {
    const receptionist = await User.findById(req.params.id);
    if (!receptionist || receptionist.role !== 'receptionist') {
      return res.status(404).json({ message: 'Receptionist not found' });
    }
    await receptionist.deleteOne();
    res.status(200).json({ message: 'Receptionist deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete receptionist', error: err.message });
  }
};

// Update a receptionist by ID
export const updateReceptionist = async (req, res) => {
  try {
    const receptionist = await User.findById(req.params.id);
    if (!receptionist || receptionist.role !== 'receptionist') {
      return res.status(404).json({ message: 'Receptionist not found' });
    }
    // Update fields
    const fields = ['name', 'phone', 'email', 'username'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        receptionist[field] = req.body[field];
      }
    });
    // Only update password if provided
    if (req.body.password) {
      receptionist.password = req.body.password;
    }
    await receptionist.save();
    res.status(200).json({ message: 'Receptionist updated successfully', receptionist });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update receptionist', error: err.message });
  }
}; 