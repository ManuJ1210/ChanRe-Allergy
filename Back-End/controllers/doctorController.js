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

// ✅ New: Get Patients Assigned to Doctor
export const getAssignedPatients = async (req, res) => {
  try {
    const doctorId = req.user._id;
    console.log('🔍 Fetching patients for doctor:', doctorId);
    
    const patients = await Patient.find({ assignedDoctor: doctorId })
      .populate({
        path: 'centerId',
        select: 'name code',
        model: 'Center'
      })
      .select('-tests'); // Exclude tests array for performance

    console.log('📋 Found patients:', patients.length);
    
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
    const doctorId = req.user._id;

    // Verify the patient is assigned to this doctor
    const patient = await Patient.findOne({ 
      _id: patientId, 
      assignedDoctor: doctorId 
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

    // Verify the patient is assigned to this doctor
    const patient = await Patient.findOne({ 
      _id: patientId, 
      assignedDoctor: doctorId 
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
    
    // Get all patients assigned to this doctor
    const assignedPatients = await Patient.find({ assignedDoctor: doctorId });
    const patientIds = assignedPatients.map(p => p._id);
    
    // Get test requests for these patients
    const testRequests = await Test.find({ 
      patient: { $in: patientIds },
      requestedBy: doctorId 
    })
    .populate('patient', 'name age gender')
    .sort({ date: -1 });

    res.status(200).json(testRequests);
  } catch (error) {
    console.error('❌ Error fetching test requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};