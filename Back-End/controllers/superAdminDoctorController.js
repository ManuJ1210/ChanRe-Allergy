import User from '../models/User.js';
import SuperAdminDoctor from '../models/SuperAdminDoctor.js';
import Patient from '../models/Patient.js';
import Test from '../models/Test.js';
import TestRequest from '../models/TestRequest.js';
import FollowUp from '../models/FollowUp.js';
import Prescription from '../models/Prescription.js';
import Medication from '../models/Medication.js';
import GPE from '../models/GPE.js';
import AllergicRhinitis from '../models/AllergicRhinitis.js';
import AllergicConjunctivitis from '../models/AllergicConjunctivitis.js';
import AllergicBronchitis from '../models/AllergicBronchitis.js';
import AtopicDermatitis from '../models/AtopicDermatitis.js';
import Notification from '../models/Notification.js';

// Management functions for superadmin to manage superadmin doctors
export const getAllSuperAdminDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    // Build query for SuperAdminDoctor model
    const query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count
    const total = await SuperAdminDoctor.countDocuments();
    
    // Get doctors with pagination
    const doctors = await SuperAdminDoctor.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));



    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      doctors,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching superadmin doctors', error: error.message });
  }
};

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
      experience,
      specializations,
      bio
    } = req.body;

    // Check if user with email already exists in both models
    const existingUserByEmail = await User.findOne({ email });
    const existingSuperAdminByEmail = await SuperAdminDoctor.findOne({ email });
    if (existingUserByEmail || existingSuperAdminByEmail) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if user with username already exists in both models
    if (username) {
      const existingUserByUsername = await User.findOne({ username });
      const existingSuperAdminByUsername = await SuperAdminDoctor.findOne({ username });
      if (existingUserByUsername || existingSuperAdminByUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

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
      experience,
      specializations: specializations || [],
      bio,
      role: 'doctor',
      isSuperAdminStaff: true
    });

    await doctor.save();
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;

    res.status(201).json(doctorResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error adding superadmin doctor', error: error.message });
  }
};

export const deleteSuperAdminDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await SuperAdminDoctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Superadmin doctor not found' });
    }

    await SuperAdminDoctor.findByIdAndDelete(id);
    res.json({ message: 'Superadmin doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting superadmin doctor', error: error.message });
  }
};

export const getSuperAdminDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await SuperAdminDoctor.findById(id).select('-password');
    if (!doctor) {
      return res.status(404).json({ message: 'Superadmin doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching superadmin doctor', error: error.message });
  }
};

export const updateSuperAdminDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      email, 
      mobile, 
      username,
      qualification,
      designation,
      kmcNumber,
      hospitalName,
      experience,
      specializations,
      bio
    } = req.body;

    const doctor = await SuperAdminDoctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Superadmin doctor not found' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== doctor.email) {
      const existingUserByEmail = await User.findOne({ email });
      const existingSuperAdminByEmail = await SuperAdminDoctor.findOne({ email });
      if (existingUserByEmail || existingSuperAdminByEmail) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
    }

    // Check if username is being changed and if it already exists
    if (username && username !== doctor.username) {
      const existingUserByUsername = await User.findOne({ username });
      const existingSuperAdminByUsername = await SuperAdminDoctor.findOne({ username });
      if (existingUserByUsername || existingSuperAdminByUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    const updatedDoctor = await SuperAdminDoctor.findByIdAndUpdate(
      id,
      { 
        name, 
        email, 
        mobile, 
        username,
        qualification,
        designation,
        kmcNumber,
        hospitalName,
        experience,
        specializations: specializations || [],
        bio
      },
      { new: true }
    ).select('-password');

    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating superadmin doctor', error: error.message });
  }
};

export const toggleSuperAdminDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await SuperAdminDoctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Superadmin doctor not found' });
    }

    doctor.status = doctor.status === 'active' ? 'inactive' : 'active';
    await doctor.save();

    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;

    res.json(doctorResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling superadmin doctor status', error: error.message });
  }
};

export const getSuperAdminDoctorStats = async (req, res) => {
  try {
    const totalDoctors = await SuperAdminDoctor.countDocuments();

    const activeDoctors = await SuperAdminDoctor.countDocuments({
      status: 'active'
    });

    const inactiveDoctors = await SuperAdminDoctor.countDocuments({
      status: 'inactive'
    });

    res.json({
      total: totalDoctors,
      active: activeDoctors,
      inactive: inactiveDoctors
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching superadmin doctor stats', error: error.message });
  }
};

// Working functions for superadmin doctors to perform their duties
export const getSuperAdminDoctorAssignedPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ assignedDoctor: req.user.id });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned patients', error: error.message });
  }
};

export const getSuperAdminDoctorPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

export const createSuperAdminDoctorTestRequest = async (req, res) => {
  try {
    const { patientId, testType, description } = req.body;

    const testRequest = new TestRequest({
      patient: patientId,
      requestedBy: req.user.id,
      testType,
      description
    });

    await testRequest.save();
    res.status(201).json(testRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating test request', error: error.message });
  }
};

export const getSuperAdminDoctorTestRequests = async (req, res) => {
  try {
    const testRequests = await TestRequest.find({ requestedBy: req.user.id })
      .populate('patient', 'name')
      .populate('assignedLab', 'name');
    
    res.json(testRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching test requests', error: error.message });
  }
};

export const getSuperAdminDoctorCompletedReports = async (req, res) => {
  try {
    const completedTests = await Test.find({ 
      requestedBy: req.user.id,
      status: 'completed'
    }).populate('patient', 'name');
    
    res.json(completedTests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching completed reports', error: error.message });
  }
};

export const getSuperAdminDoctorWorkingStats = async (req, res) => {
  try {
    const assignedPatients = await Patient.countDocuments({ assignedDoctor: req.user.id });
    const pendingLabReports = await Test.countDocuments({
      status: 'completed',
      'superadminReview.status': { $ne: 'reviewed' }
    });
    const feedbackSent = await Test.countDocuments({
      'superadminReview.status': 'reviewed',
      'superadminReview.reviewedBy': req.user.id
    });
    const recentFollowups = await FollowUp.countDocuments({
      patient: { $in: await Patient.find({ assignedDoctor: req.user.id }).distinct('_id') },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    res.json({
      assignedPatients,
      pendingLabReports,
      feedbackSent,
      recentFollowups
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching superadmin doctor working stats', error: error.message });
  }
};

// Lab Reports functionality for superadmin doctors
export const getSuperAdminDoctorLabReports = async (req, res) => {
  try {
    const labReports = await Test.find({
      status: 'completed'
    })
    .populate('patient', 'name age gender phone')
    .populate('requestedBy', 'name centerId')
    .populate({
      path: 'requestedBy',
      populate: {
        path: 'centerId',
        model: 'Center',
        select: 'name'
      }
    })
    .sort({ completedAt: -1 });

    // Transform the data to include doctor and center info
    const transformedReports = labReports.map(report => ({
      _id: report._id,
      patient: report.patient,
      testType: report.testType,
      description: report.description,
      results: report.results,
      completedAt: report.completedAt,
      status: report.superadminReview?.status || 'completed',
      requestedBy: report.requestedBy._id,
      requestedByDoctor: {
        name: report.requestedBy.name,
        center: report.requestedBy.centerId
      }
    }));

    res.json(transformedReports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab reports', error: error.message });
  }
};

export const sendFeedbackToCenterDoctor = async (req, res) => {
  try {
    const { reportId, patientId, centerDoctorId, additionalTests, patientInstructions, notes } = req.body;

    // Update the test with superadmin review
    const updatedTest = await Test.findByIdAndUpdate(
      reportId,
      {
        superadminReview: {
          reviewedBy: req.user.id,
          reviewedAt: new Date(),
          status: 'reviewed',
          additionalTests,
          patientInstructions,
          notes
        }
      },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test report not found' });
    }

    // Create a notification for the center doctor
    const notification = new Notification({
      recipient: centerDoctorId,
      sender: req.user.id,
      type: 'lab_report_feedback',
      title: 'Lab Report Feedback',
      message: `Superadmin doctor has reviewed the lab report for patient ${updatedTest.patient?.name || 'Unknown'}`,
      data: {
        testId: reportId,
        patientId,
        additionalTests,
        patientInstructions,
        notes
      },
      read: false
    });

    await notification.save();

    res.json({
      message: 'Feedback sent successfully',
      reportId,
      test: updatedTest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending feedback', error: error.message });
  }
}; 