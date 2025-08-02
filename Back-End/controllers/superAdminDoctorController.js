import SuperAdminDoctor from '../models/SuperAdminDoctor.js';

// @desc    Add new Super Admin Doctor
// @route   POST /api/superadmin/doctors
// @access  Private (Superadmin only)
export const addSuperAdminDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      username,
      qualification,
      designation,
      kmcNumber,
      hospitalName,
      specializations,
      experience,
      bio,
      status
    } = req.body;

    // Validation
    if (!name || !email || !password || !mobile || !username) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, email, password, mobile, username' 
      });
    }

    // Check if email already exists
    const existingEmail = await SuperAdminDoctor.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check if username already exists
    const existingUsername = await SuperAdminDoctor.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Create new doctor
    const doctor = new SuperAdminDoctor({
      name,
      email,
      password,
      mobile,
      username,
      qualification,
      designation,
      kmcNumber,
      hospitalName,
      specializations: specializations || [],
      experience,
      bio,
      status: status || 'active',
      role: 'doctor',
      isSuperAdminStaff: true
    });

    await doctor.save();

    res.status(201).json({ 
      message: 'Super Admin Doctor added successfully', 
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        mobile: doctor.mobile,
        username: doctor.username,
        qualification: doctor.qualification,
        designation: doctor.designation,
        status: doctor.status,
        createdAt: doctor.createdAt
      }
    });
  } catch (error) {
    console.error('Error adding super admin doctor:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get all Super Admin Doctors
// @route   GET /api/superadmin/doctors
// @access  Private (Superadmin only)
export const getAllSuperAdminDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    // Build query
    let query = { isSuperAdminStaff: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const doctors = await SuperAdminDoctor.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await SuperAdminDoctor.countDocuments(query);

    res.status(200).json({
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching super admin doctors:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get single Super Admin Doctor by ID
// @route   GET /api/superadmin/doctors/:id
// @access  Private (Superadmin only)
export const getSuperAdminDoctorById = async (req, res) => {
  try {
    const doctor = await SuperAdminDoctor.findById(req.params.id).select('-password');

    if (!doctor || !doctor.isSuperAdminStaff) {
      return res.status(404).json({ message: 'Super Admin Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching super admin doctor:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Update Super Admin Doctor
// @route   PUT /api/superadmin/doctors/:id
// @access  Private (Superadmin only)
export const updateSuperAdminDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      username,
      qualification,
      designation,
      kmcNumber,
      hospitalName,
      specializations,
      experience,
      bio,
      status,
      password
    } = req.body;

    const doctor = await SuperAdminDoctor.findById(req.params.id);
    
    if (!doctor || !doctor.isSuperAdminStaff) {
      return res.status(404).json({ message: 'Super Admin Doctor not found' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== doctor.email) {
      const existingEmail = await SuperAdminDoctor.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Check if username is being changed and if it already exists
    if (username && username !== doctor.username) {
      const existingUsername = await SuperAdminDoctor.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already in use' });
      }
    }

    // Update fields
    const updateFields = {
      name: name || doctor.name,
      email: email || doctor.email,
      mobile: mobile || doctor.mobile,
      username: username || doctor.username,
      qualification: qualification !== undefined ? qualification : doctor.qualification,
      designation: designation !== undefined ? designation : doctor.designation,
      kmcNumber: kmcNumber !== undefined ? kmcNumber : doctor.kmcNumber,
      hospitalName: hospitalName !== undefined ? hospitalName : doctor.hospitalName,
      specializations: specializations || doctor.specializations,
      experience: experience !== undefined ? experience : doctor.experience,
      bio: bio !== undefined ? bio : doctor.bio,
      status: status || doctor.status
    };

    // Update password if provided
    if (password) {
      updateFields.password = password;
    }

    const updatedDoctor = await SuperAdminDoctor.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ 
      message: 'Super Admin Doctor updated successfully', 
      doctor: updatedDoctor 
    });
  } catch (error) {
    console.error('Error updating super admin doctor:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Delete Super Admin Doctor
// @route   DELETE /api/superadmin/doctors/:id
// @access  Private (Superadmin only)
export const deleteSuperAdminDoctor = async (req, res) => {
  try {
    const doctor = await SuperAdminDoctor.findById(req.params.id);

    if (!doctor || !doctor.isSuperAdminStaff) {
      return res.status(404).json({ message: 'Super Admin Doctor not found' });
    }

    await SuperAdminDoctor.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Super Admin Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting super admin doctor:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Toggle Super Admin Doctor Status
// @route   PATCH /api/superadmin/doctors/:id/toggle-status
// @access  Private (Superadmin only)
export const toggleSuperAdminDoctorStatus = async (req, res) => {
  try {
    const doctor = await SuperAdminDoctor.findById(req.params.id);
    
    if (!doctor || !doctor.isSuperAdminStaff) {
      return res.status(404).json({ message: 'Super Admin Doctor not found' });
    }

    doctor.status = doctor.status === 'active' ? 'inactive' : 'active';
    await doctor.save();

    res.status(200).json({ 
      message: `Super Admin Doctor ${doctor.status} successfully`, 
      status: doctor.status 
    });
  } catch (error) {
    console.error('Error toggling super admin doctor status:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get Super Admin Doctor Statistics
// @route   GET /api/superadmin/doctors/stats
// @access  Private (Superadmin only)
export const getSuperAdminDoctorStats = async (req, res) => {
  try {
    const totalDoctors = await SuperAdminDoctor.countDocuments({ isSuperAdminStaff: true });
    const activeDoctors = await SuperAdminDoctor.countDocuments({ 
      isSuperAdminStaff: true, 
      status: 'active' 
    });
    const inactiveDoctors = await SuperAdminDoctor.countDocuments({ 
      isSuperAdminStaff: true, 
      status: 'inactive' 
    });

    res.status(200).json({
      total: totalDoctors,
      active: activeDoctors,
      inactive: inactiveDoctors
    });
  } catch (error) {
    console.error('Error fetching super admin doctor stats:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
}; 