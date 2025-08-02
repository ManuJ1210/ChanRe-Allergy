import User from '../models/User.js';
import Patient from '../models/Patient.js';
import History from '../models/historyModel.js';
import Medication from '../models/Medication.js';
import Test from '../models/Test.js';

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      mobile,
      role,
      qualification,
      designation,
      kmcNumber,
      centerCode,
      hospitalName,
      username,
      specializations,
      experience,
      bio,
      status
    } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Ensure centerId is set to current user's center (unless superadmin)
    let centerId = req.user.centerId;
    
    // If superadmin is creating a doctor, they must specify centerId
    if (req.user.role === 'superadmin') {
      if (!req.body.centerId) {
        return res.status(400).json({ 
          message: 'Superadmin must specify centerId when creating a doctor.' 
        });
      }
      centerId = req.body.centerId;
    } else {
      // For non-superadmin users, ensure they have a centerId
      if (!centerId) {
        return res.status(403).json({ 
          message: 'Access denied. Center-specific access required.' 
        });
      }
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
      phone: phone || mobile, // Use phone or mobile
      mobile,
      role: role || 'doctor',
      qualification,
      designation,
      kmcNumber,
      centerCode,
      hospitalName,
      username,
      specializations: specializations || [],
      experience,
      bio,
      status: status || 'active',
      centerId, // Automatically set to current user's center
      isSuperAdminStaff: false // Explicitly mark as center-specific doctor
    });

    await doctor.save();
    
    console.log(`✅ Center-specific doctor added successfully to center: ${centerId}`);
    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (err) {
    console.error('❌ Error adding doctor:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Existing: Get All Doctors (Center-specific only)
export const getAllDoctors = async (req, res) => {
  try {
    let query = { 
      role: 'doctor',
      centerId: { $exists: true, $ne: null } // Only doctors with centerId (center-specific)
    };

    // If user is not superadmin, filter by their center
    if (req.user.role !== 'superadmin') {
      if (!req.user.centerId) {
        return res.status(403).json({ 
          message: 'Access denied. Center-specific access required.' 
        });
      }
      query.centerId = req.user.centerId;
    }

    // Explicitly exclude super admin staff doctors from User model
    // AND ensure they don't have isSuperAdminStaff flag
    query.$and = [
      {
        $or: [
          { isSuperAdminStaff: { $exists: false } }, // No isSuperAdminStaff field
          { isSuperAdminStaff: false }, // Or explicitly set to false
          { isSuperAdminStaff: { $ne: true } } // Or not true
        ]
      },
      // Additional check to ensure they are not superadmin staff
      { 
        $or: [
          { isSuperAdminStaff: { $exists: false } },
          { isSuperAdminStaff: false }
        ]
      }
    ];

    const doctors = await User.find(query).select('-password');
    
    console.log(`🔍 Found ${doctors.length} center-specific doctors for center: ${req.user.centerId || 'all centers (superadmin)'}`);
    
    // Log sample doctor data for debugging
    if (doctors.length > 0) {
      console.log('🏥 Sample doctor data:', {
        doctorId: doctors[0]._id,
        name: doctors[0].name,
        centerId: doctors[0].centerId,
        isSuperAdminStaff: doctors[0].isSuperAdminStaff
      });
    }
    
    res.status(200).json(doctors);
  } catch (error) {
    console.error('❌ Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ New: Delete Doctor by ID
export const deleteDoctor = async (req, res) => {
  try {
    let query = { _id: req.params.id, role: 'doctor' };
    
    // If not superadmin, ensure doctor belongs to same center
    if (req.user.role !== 'superadmin') {
      query.centerId = req.user.centerId;
    }

    const doctor = await User.findOne(query);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or access denied' });
    }

    await doctor.deleteOne();
    console.log(`✅ Doctor deleted successfully from center: ${req.user.centerId || 'all centers (superadmin)'}`);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ New: Get Single Doctor by ID (for Edit Page)
export const getDoctorById = async (req, res) => {
  try {
    let query = { _id: req.params.id, role: 'doctor' };
    
    // If not superadmin, ensure doctor belongs to same center
    if (req.user.role !== 'superadmin') {
      query.centerId = req.user.centerId;
    }

    const doctor = await User.findOne(query).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or access denied' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error('❌ Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Doctor by ID
export const updateDoctor = async (req, res) => {
  try {
    let query = { _id: req.params.id, role: 'doctor' };
    
    // If not superadmin, ensure doctor belongs to same center
    if (req.user.role !== 'superadmin') {
      query.centerId = req.user.centerId;
    }

    const doctor = await User.findOne(query);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or access denied' });
    }

    // Update fields
    const fields = [
      'name', 'qualification', 'designation', 'kmcNumber', 'hospitalName',
      'centerCode', 'phone', 'mobile', 'email', 'username', 'specializations',
      'experience', 'bio', 'status'
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    // Only superadmin can change centerId
    if (req.user.role === 'superadmin' && req.body.centerId) {
      doctor.centerId = req.body.centerId;
    }

    // Only update password if provided
    if (req.body.password) {
      doctor.password = req.body.password;
    }

    await doctor.save();
    console.log(`✅ Doctor updated successfully in center: ${req.user.centerId || 'all centers (superadmin)'}`);
    res.status(200).json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    console.error('❌ Error updating doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ New: Get Patients Assigned to Doctor
export const getAssignedPatients = async (req, res) => {
  try {
    const doctorId = req.user._id;
    console.log('🔍 Fetching patients for doctor:', doctorId);
    
    // Ensure doctor can only see patients from their center
    const patients = await Patient.find({ 
      assignedDoctor: doctorId,
      centerId: req.user.centerId // Only patients from same center
    })
      .populate({
        path: 'centerId',
        select: 'name code',
        model: 'Center'
      })
      .select('-tests'); // Exclude tests array for performance

    console.log(`📋 Found ${patients.length} patients for doctor in center: ${req.user.centerId}`);
    
    // Log sample patient data for debugging
    if (patients.length > 0) {
      console.log('🏥 Sample patient center data:', {
        patientId: patients[0]._id,
        centerId: patients[0].centerId,
        centerName: patients[0].centerId?.name,
        centerCode: patients[0].centerId?.code
      });
    }

    res.status(200).json(patients);
  } catch (error) {
    console.error('❌ Error fetching assigned patients:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ New: Get Single Patient Details for Doctor
export const getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log('Backend getPatientDetails: received patientId:', patientId, typeof patientId);
    const doctorId = req.user._id;

    // Verify the patient is assigned to this doctor AND belongs to same center
    const patient = await Patient.findOne({ 
      _id: patientId, 
      assignedDoctor: doctorId,
      centerId: req.user.centerId // Only patients from same center
    }).populate('centerId', 'name code');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found or not assigned to you' });
    }

    // Get patient history
    const history = await History.findOne({ patientId: patient._id });
    
    // Get patient medications
    const medications = await Medication.find({ patientId: patient._id });
    
    // Get patient tests
    const tests = await Test.find({ patient: patient._id }).sort({ date: -1 });

    res.status(200).json({
      patient,
      history,
      medications,
      tests
    });
  } catch (error) {
    console.error('❌ Error fetching patient details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ New: Add Test Request by Doctor
export const addTestRequest = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user._id;
    const { testType, notes, priority } = req.body;

    // Verify the patient is assigned to this doctor AND belongs to same center
    const patient = await Patient.findOne({ 
      _id: patientId, 
      assignedDoctor: doctorId,
      centerId: req.user.centerId // Only patients from same center
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found or not assigned to you' });
    }

    // Create test request
    const testRequest = new Test({
      patient: patientId,
      testType,
      notes,
      priority: priority || 'normal',
      requestedBy: doctorId,
      status: 'pending',
      date: new Date()
    });

    await testRequest.save();

    console.log(`✅ Test request added successfully for patient in center: ${req.user.centerId}`);
    res.status(201).json({ 
      message: 'Test request added successfully', 
      testRequest 
    });
  } catch (error) {
    console.error('❌ Error adding test request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ New: Get Test Requests by Doctor
export const getTestRequests = async (req, res) => {
  try {
    const doctorId = req.user._id;
    
    // Get all patients assigned to this doctor from same center
    const assignedPatients = await Patient.find({ 
      assignedDoctor: doctorId,
      centerId: req.user.centerId // Only patients from same center
    });
    const patientIds = assignedPatients.map(p => p._id);
    
    // Get test requests for these patients
    const testRequests = await Test.find({ 
      patient: { $in: patientIds },
      requestedBy: doctorId 
    })
    .populate('patient', 'name age gender')
    .sort({ date: -1 });

    console.log(`🔬 Found ${testRequests.length} test requests for doctor in center: ${req.user.centerId}`);
    res.status(200).json(testRequests);
  } catch (error) {
    console.error('❌ Error fetching test requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ New: Get Doctor Stats for Center Admin
// @route   GET /api/doctors/stats
// @desc    Get doctor statistics for center admin
// @access  Private (Center Admin)
export const getDoctorStats = async (req, res) => {
  try {
    let query = { 
      role: 'doctor',
      centerId: { $exists: true, $ne: null } // Only doctors with centerId (center-specific)
    };

    // If user is not superadmin, filter by their center
    if (req.user.role !== 'superadmin') {
      if (!req.user.centerId) {
        return res.status(403).json({ 
          message: 'Access denied. Center-specific access required.' 
        });
      }
      query.centerId = req.user.centerId;
    }

    // Get total doctors
    const total = await User.countDocuments(query);

    // Get active doctors (not deleted)
    const active = await User.countDocuments({ ...query, isDeleted: { $ne: true } });

    // Get inactive doctors (deleted)
    const inactive = await User.countDocuments({ ...query, isDeleted: true });

    const stats = {
      total,
      active,
      inactive
    };

    console.log(`📊 Doctor stats for center: ${req.user.centerId || 'all centers'}`);
    res.status(200).json(stats);
  } catch (error) {
    console.error('❌ Error fetching doctor stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};