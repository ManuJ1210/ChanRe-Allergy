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

    if (!name || !email || !password || !username || !centerId) {
      return res.status(400).json({ message: 'Please fill all required fields, including centerId.' });
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

// Existing: Get All Doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ New: Delete Doctor by ID
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.deleteOne();
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ New: Get Single Doctor by ID (for Edit Page)
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
  // Update Doctor by ID
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update fields
    const fields = [
      'name', 'qualification', 'designation', 'kmcNumber', 'hospitalName',
      'centerCode', 'phone', 'email', 'username', 'userType', 'centerId'
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    // Only update password if provided
    if (req.body.password) {
      doctor.password = req.body.password;
    }

    await doctor.save();
    res.status(200).json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    console.error('❌ Error updating doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};