import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Center from '../models/Center.js';
import Test from '../models/Test.js';

// Get Super Admin Dashboard Stats
export const getSuperAdminStats = async (req, res) => {
  try {
    const [totalCenters, totalAdmins, totalPatients, totalTests] = await Promise.all([
      Center.countDocuments(),
      User.countDocuments({ role: 'centeradmin' }),
      Patient.countDocuments(),
      Test.countDocuments()
    ]);

    res.json({
      totalCenters,
      totalAdmins,
      totalPatients,
      totalTests
    });
  } catch (error) {
    console.error('Error fetching super admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
};

// Get Center Admin Dashboard Stats
export const getCenterAdminStats = async (req, res) => {
  try {
    const centerId = req.user.centerId;
    
    if (!centerId) {
      return res.status(400).json({ message: 'Center ID not found' });
    }

    // Get patient IDs for this center
    const patientIds = await Patient.find({ centerId }).select('_id');
    const patientIdArray = patientIds.map(p => p._id);
    
    const [totalPatients, totalDoctors, totalReceptionists, totalTests] = await Promise.all([
      Patient.countDocuments({ centerId }),
      User.countDocuments({ centerId, role: 'doctor' }),
      User.countDocuments({ centerId, role: 'receptionist' }),
      Test.countDocuments({ patient: { $in: patientIdArray } })
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      totalReceptionists,
      totalTests
    });
  } catch (error) {
    console.error('Error fetching center admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
};

// Get Doctor Dashboard Stats
export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.user._id;
    
    // Get patients assigned to this doctor
    const assignedPatients = await Patient.find({ assignedDoctor: doctorId });
    const totalPatients = assignedPatients.length;
    
    // Count tests for assigned patients
    const patientIds = assignedPatients.map(p => p._id);
    const [pendingTests, completedTests] = await Promise.all([
      Test.countDocuments({ 
        patient: { $in: patientIds },
        status: { $in: ['pending', 'in_progress'] }
      }),
      Test.countDocuments({ 
        patient: { $in: patientIds },
        status: 'completed'
      })
    ]);

    res.json({
      totalPatients,
      pendingTests,
      completedTests
    });
  } catch (error) {
    console.error('Error fetching doctor stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
};

// Get Receptionist Dashboard Stats
export const getReceptionistStats = async (req, res) => {
  try {
    const centerId = req.user.centerId;
    if (!centerId) {
      return res.status(400).json({ message: 'Center ID is required' });
    }

    const [totalPatients, pendingTests, completedTests] = await Promise.all([
      Patient.countDocuments({ centerId }),
      Test.countDocuments({
        patient: { $in: await Patient.find({ centerId }).distinct('_id') },
        status: { $in: ['pending', 'in_progress'] }
      }),
      Test.countDocuments({
        patient: { $in: await Patient.find({ centerId }).distinct('_id') },
        status: 'completed'
      })
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayPatients = await Patient.countDocuments({ 
      centerId, 
      createdAt: { $gte: today } 
    });

    res.json({ totalPatients, todayPatients, pendingTests, completedTests });
  } catch (error) {
    console.error('Error fetching receptionist stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
}; 