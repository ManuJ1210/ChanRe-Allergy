import User from '../models/User.js';
import Center from '../models/Center.js';

// ✅ Get all center admins
export const getAllCenterAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'centeradmin' })
      .populate('centerId', 'name code')
      .select('-password');

    const formatted = admins.map((admin) => ({
      _id: admin._id,
      adminName: admin.name,
      email: admin.email,
      phone: admin.phone,
      createdAt: admin.createdAt,
      centerName: admin.centerId?.name || 'N/A',
      centerCode: admin.centerId?.code || 'N/A',
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Failed to fetch center admins:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Get single center admin by ID
export const getCenterAdminById = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id).select('-password');
    if (!admin || admin.role !== 'centeradmin') {
      return res.status(404).json({ message: 'Center admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error('Failed to fetch center admin:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Update center admin by ID
export const updateCenterAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== 'centeradmin') {
      return res.status(404).json({ message: 'Center admin not found' });
    }

    const fields = [
      'name',
      'qualification',
      'designation',
      'kmcNumber',
      'hospitalName',
      'centerCode',
      'phone',
      'email',
      'username',
      'password',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        admin[field] = req.body[field];
      }
    });

    await admin.save();
    res.status(200).json({ message: 'Admin updated successfully' });
  } catch (error) {
    console.error('Failed to update center admin:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Delete center admin by ID
export const deleteCenterAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== 'centeradmin') {
      return res.status(404).json({ message: 'Center admin not found' });
    }

    await admin.deleteOne();
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Failed to delete center admin:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new center admin for an existing center
export const createCenterAdmin = async (req, res) => {
  try {
    console.log('createCenterAdmin req.body:', req.body);
    const { name, email, password, username, centerId, ...rest } = req.body;
    // Check if admin already exists for this center
    const existing = await User.findOne({ centerId, role: 'centeradmin' });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists for this center' });
    }
    const newAdmin = await User.create({
      name,
      email,
      password,
      username,
      role: 'centeradmin',
      centerId,
      ...rest,
    });
    console.log('✅ New center admin created:', newAdmin._id, newAdmin.email);
    // Update the Center's centerAdminId field
    const updatedCenter = await Center.findByIdAndUpdate(centerId, { centerAdminId: newAdmin._id }, { new: true });
    console.log('✅ Center updated with new centerAdminId:', updatedCenter?._id, '->', updatedCenter?.centerAdminId);
    res.status(201).json(newAdmin);
  } catch (err) {
    console.error('❌ Error in createCenterAdmin:', err);
    res.status(500).json({ message: 'Failed to create admin', error: err.message });
  }
};
