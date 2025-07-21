import User from '../models/User.js';

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
