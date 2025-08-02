import SuperAdminReceptionist from '../models/SuperAdminReceptionist.js';

// @desc    Add new Super Admin Receptionist
// @route   POST /api/superadmin/receptionists
// @access  Private (Superadmin only)
export const addSuperAdminReceptionist = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      username,
      address,
      emergencyContact,
      emergencyContactName,
      status
    } = req.body;

    // Validation
    if (!name || !email || !password || !mobile || !username) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, email, password, mobile, username' 
      });
    }

    // Check if email already exists
    const existingEmail = await SuperAdminReceptionist.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check if username already exists
    const existingUsername = await SuperAdminReceptionist.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Create new receptionist
    const receptionist = new SuperAdminReceptionist({
      name,
      email,
      password,
      mobile,
      username,
      address,
      emergencyContact,
      emergencyContactName,
      status: status || 'active',
      role: 'receptionist',
      isSuperAdminStaff: true
    });

    await receptionist.save();

    res.status(201).json({ 
      message: 'Super Admin Receptionist added successfully', 
      receptionist: {
        id: receptionist._id,
        name: receptionist.name,
        email: receptionist.email,
        mobile: receptionist.mobile,
        username: receptionist.username,
        address: receptionist.address,
        status: receptionist.status,
        createdAt: receptionist.createdAt
      }
    });
  } catch (error) {
    console.error('Error adding super admin receptionist:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get all Super Admin Receptionists
// @route   GET /api/superadmin/receptionists
// @access  Private (Superadmin only)
export const getAllSuperAdminReceptionists = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    // Build query
    let query = { isSuperAdminStaff: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const receptionists = await SuperAdminReceptionist.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await SuperAdminReceptionist.countDocuments(query);

    res.status(200).json({
      receptionists,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching super admin receptionists:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get single Super Admin Receptionist by ID
// @route   GET /api/superadmin/receptionists/:id
// @access  Private (Superadmin only)
export const getSuperAdminReceptionistById = async (req, res) => {
  try {
    const receptionist = await SuperAdminReceptionist.findById(req.params.id).select('-password');

    if (!receptionist || !receptionist.isSuperAdminStaff) {
      return res.status(404).json({ message: 'Super Admin Receptionist not found' });
    }

    res.status(200).json(receptionist);
  } catch (error) {
    console.error('Error fetching super admin receptionist:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Update Super Admin Receptionist
// @route   PUT /api/superadmin/receptionists/:id
// @access  Private (Superadmin only)
export const updateSuperAdminReceptionist = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      username,
      address,
      emergencyContact,
      emergencyContactName,
      status,
      password
    } = req.body;

    const receptionist = await SuperAdminReceptionist.findById(req.params.id);
    
    if (!receptionist || !receptionist.isSuperAdminStaff) {
      return res.status(404).json({ message: 'Super Admin Receptionist not found' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== receptionist.email) {
      const existingEmail = await SuperAdminReceptionist.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Check if username is being changed and if it already exists
    if (username && username !== receptionist.username) {
      const existingUsername = await SuperAdminReceptionist.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already in use' });
      }
    }

    // Update fields
    const updateFields = {
      name: name || receptionist.name,
      email: email || receptionist.email,
      mobile: mobile || receptionist.mobile,
      username: username || receptionist.username,
      address: address !== undefined ? address : receptionist.address,
      emergencyContact: emergencyContact !== undefined ? emergencyContact : receptionist.emergencyContact,
      emergencyContactName: emergencyContactName !== undefined ? emergencyContactName : receptionist.emergencyContactName,
      status: status || receptionist.status
    };

    // Update password if provided
    if (password) {
      updateFields.password = password;
    }

    const updatedReceptionist = await SuperAdminReceptionist.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ 
      message: 'Super Admin Receptionist updated successfully', 
      receptionist: updatedReceptionist 
    });
  } catch (error) {
    console.error('Error updating super admin receptionist:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Delete Super Admin Receptionist
// @route   DELETE /api/superadmin/receptionists/:id
// @access  Private (Superadmin only)
export const deleteSuperAdminReceptionist = async (req, res) => {
  try {
    const receptionist = await SuperAdminReceptionist.findById(req.params.id);

    if (!receptionist || !receptionist.isSuperAdminStaff) {
      return res.status(404).json({ message: 'Super Admin Receptionist not found' });
    }

    await SuperAdminReceptionist.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Super Admin Receptionist deleted successfully' });
  } catch (error) {
    console.error('Error deleting super admin receptionist:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Toggle Super Admin Receptionist Status
// @route   PATCH /api/superadmin/receptionists/:id/toggle-status
// @access  Private (Superadmin only)
export const toggleSuperAdminReceptionistStatus = async (req, res) => {
  try {
    const receptionist = await SuperAdminReceptionist.findById(req.params.id);
    
    if (!receptionist || !receptionist.isSuperAdminStaff) {
      return res.status(404).json({ message: 'Super Admin Receptionist not found' });
    }

    receptionist.status = receptionist.status === 'active' ? 'inactive' : 'active';
    await receptionist.save();

    res.status(200).json({ 
      message: `Super Admin Receptionist ${receptionist.status} successfully`, 
      status: receptionist.status 
    });
  } catch (error) {
    console.error('Error toggling super admin receptionist status:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get Super Admin Receptionist Statistics
// @route   GET /api/superadmin/receptionists/stats
// @access  Private (Superadmin only)
export const getSuperAdminReceptionistStats = async (req, res) => {
  try {
    const totalReceptionists = await SuperAdminReceptionist.countDocuments({ isSuperAdminStaff: true });
    const activeReceptionists = await SuperAdminReceptionist.countDocuments({ 
      isSuperAdminStaff: true, 
      status: 'active' 
    });
    const inactiveReceptionists = await SuperAdminReceptionist.countDocuments({ 
      isSuperAdminStaff: true, 
      status: 'inactive' 
    });

    res.status(200).json({
      total: totalReceptionists,
      active: activeReceptionists,
      inactive: inactiveReceptionists
    });
  } catch (error) {
    console.error('Error fetching super admin receptionist stats:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
}; 