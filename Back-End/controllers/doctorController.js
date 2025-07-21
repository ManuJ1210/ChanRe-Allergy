import User from '../models/User.js';

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      qualification,
      designation,
      kmcNumber,
      centerCode,
      hospitalName,
      username,
      centerId
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    const doctor = new User({
      name,
      email,
      password,
      phone,
      role: role || 'doctor',
      qualification,
      designation,
      kmcNumber,
      centerCode,
      hospitalName,
      username,
      centerId
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

