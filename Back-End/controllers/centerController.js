import Center from '../models/Center.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Create center with admin
export const createCenterWithAdmin = async (req, res) => {
  try {
    const { center, admin } = req.body;

    const existingCenter = await Center.findOne({ email: center.email });
    if (existingCenter) {
      return res.status(400).json({ message: "Center already exists with this email" });
    }

    const existingAdmin = await User.findOne({
      $or: [{ email: admin.email }, { username: admin.username }],
    });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists with this email or username" });
    }

    const newCenter = await Center.create({
      name: center.centername,
      location: center.location,
      address: center.fulladdress,
      email: center.email,
      phone: center.phone,
    });

    const newAdmin = await User.create({
      name: admin.name,
      email: admin.email,
      password: admin.password,
      username: admin.username,
      role: admin.userType || "centeradmin",
      qualification: admin.qualification,
      designation: admin.designation,
      kmcNo: admin.kmcNo,
      hospitalName: admin.hospitalName,
      centerCode: admin.centerCode,
      phone: admin.phone,
      centerId: newCenter._id,
    });

    newCenter.centerAdminId = newAdmin._id;
    await newCenter.save();

    res.status(201).json({
      message: "Center and Admin created successfully",
      center: newCenter,
      admin: newAdmin,
    });
  } catch (error) {
    console.error("❌ Error creating center/admin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all centers with admin name
export const getAllCenters = async (req, res) => {
  try {
    const centers = await Center.find().populate({
      path: 'centerAdminId',
      select: 'name',
    });

    const centersWithAdmin = centers.map(center => ({
      _id: center._id,
      centername: center.name,
      location: center.location,
      centerAdminId: center.centerAdminId?._id || null,
      centerAdminName: center.centerAdminId?.name || null,
    }));

    res.status(200).json(centersWithAdmin);
  } catch (error) {
    console.error("❌ Error fetching centers:", error);
    res.status(500).json({ message: "Server error while fetching centers" });
  }
};

export const getCenterById = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }
    res.status(200).json(center);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCenterWithAdmin = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    const centeradmin = await User.findOne({
      centerId: center._id,
      role: 'centeradmin'
    }).select('-password');

    res.status(200).json({ ...center._doc, centeradmin });
  } catch (error) {
    console.error('Error in getCenterWithAdmin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCenter = async (req, res) => {
  try {
    const centerId = req.params.id;

    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    if (center.centerAdminId) {
      await User.findByIdAndDelete(center.centerAdminId);
    }

    await Center.findByIdAndDelete(centerId);

    res.status(200).json({ message: "Center deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting center:", error);
    res.status(500).json({ message: "Server error while deleting center" });
  }
};

export const updateCenter = asyncHandler(async (req, res) => {
  const center = await Center.findById(req.params.id);
  if (!center) {
    res.status(404);
    throw new Error("Center not found");
  }

  center.name = req.body.name || center.name;
  center.location = req.body.location || center.location;
  center.address = req.body.address || center.address;
  center.email = req.body.email || center.email;
  center.phone = req.body.phone || center.phone;

  const updatedCenter = await center.save();
  res.json(updatedCenter);
});

// Optionally export if you still use this somewhere
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
