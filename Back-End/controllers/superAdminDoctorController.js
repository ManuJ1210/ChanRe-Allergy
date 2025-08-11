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
import History from '../models/historyModel.js';

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
    
    // Get total count with query filters
    const total = await SuperAdminDoctor.countDocuments(query);
    
    // Get doctors with pagination and query filters
    const doctors = await SuperAdminDoctor.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Debug logging for first doctor
    if (doctors.length > 0) {
      console.log('🔍 Backend - First doctor from DB:', doctors[0]);
      console.log('🔍 Backend - First doctor specializations:', doctors[0].specializations);
    }

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
    // Debug logging
    console.log('🔍 Backend - Received request body:', req.body);
    console.log('🔍 Backend - Specializations received:', req.body.specializations);
    
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
    
    // Debug logging after save
    console.log('🔍 Backend - Doctor saved with specializations:', doctor.specializations);
    
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;
    
    console.log('🔍 Backend - Response specializations:', doctorResponse.specializations);

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
    const patients = await Patient.find({ assignedDoctor: req.user.id })
      .populate('centerId', 'name code')
      .populate('assignedDoctor', 'name email');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned patients', error: error.message });
  }
};

export const getSuperAdminDoctorPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id)
      .populate('centerId', 'name code')
      .populate('assignedDoctor', 'name email');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get patient history
    const history = await History.findOne({ patientId: id });

    // Get patient medications
    const medications = await Medication.find({ patientId: id });

    // Get patient tests
    const tests = await Test.find({ patient: id });

    // Get patient followups
    const followups = await FollowUp.find({ patientId: id })
      .populate('updatedBy', 'name');

    // Get specific allergy records
    const allergicRhinitis = await AllergicRhinitis.find({ patientId: id });
    const allergicConjunctivitis = await AllergicConjunctivitis.find({ patientId: id });
    const allergicBronchitis = await AllergicBronchitis.find({ patientId: id });
    const atopicDermatitis = await AtopicDermatitis.find({ patientId: id });
    const gpe = await GPE.find({ patientId: id });

    // Get prescriptions
    const prescriptions = await Prescription.find({ patientId: id })
      .populate('doctorId', 'name');

    res.json({
      patient,
      history,
      medications,
      tests,
      followups,
      allergicRhinitis,
      allergicConjunctivitis,
      allergicBronchitis,
      atopicDermatitis,
      gpe,
      prescriptions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patient details', error: error.message });
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
    const userId = req.user.id;

    // Get total patients with completed lab reports
    const completedTestRequests = await TestRequest.find({
      status: { $in: ['Report_Generated', 'Report_Sent', 'Completed', 'feedback_sent'] }
    });

    const patientIds = [...new Set(completedTestRequests.map(req => req.patientId.toString()))];
    const totalPatients = patientIds.length;

    // Get total lab reports
    const totalLabReports = completedTestRequests.length;

    // Get recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReports = await TestRequest.find({
      status: { $in: ['Report_Generated', 'Report_Sent', 'Completed', 'feedback_sent'] },
      updatedAt: { $gte: sevenDaysAgo }
    });

    // Get pending lab reports (for review)
    const pendingLabReports = await TestRequest.countDocuments({
      status: { $in: ['Report_Generated', 'Report_Sent'] }
    });

    // Get feedback sent reports
    const feedbackSent = await TestRequest.countDocuments({
      status: 'feedback_sent'
    });

    res.json({
      assignedPatients: totalPatients,
      pendingLabReports,
      feedbackSent,
      recentReports: recentReports.length,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch working stats', error: error.message });
  }
};

// Lab Reports functionality for superadmin doctors
export const getSuperAdminDoctorLabReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {
      status: { $in: ['Report_Generated', 'Report_Sent', 'Completed', 'feedback_sent'] }
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { testType: { $regex: search, $options: 'i' } },
        { 'patientId.name': { $regex: search, $options: 'i' } },
        { 'doctorId.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await TestRequest.countDocuments(query);

    // Get lab reports with pagination
    const labReports = await TestRequest.find(query)
      .populate('doctorId', 'name email')
      .populate('patientId', 'name age gender phone')
      .populate('assignedLabStaffId', 'name')
      .populate('sampleCollectorId', 'name')
      .populate('labTechnicianId', 'name')
      .populate('centerId', 'name code')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Transform data for frontend
    const transformedReports = labReports.map(report => {
      // Map backend status to frontend expected status
      let frontendStatus = report.status;
      if (report.status === 'Completed') frontendStatus = 'completed';
      else if (report.status === 'Report_Generated' || report.status === 'Report_Sent') frontendStatus = 'pending_review';
      else if (report.status === 'feedback_sent') frontendStatus = 'feedback_sent';
      
      return {
        _id: report._id,
        testType: report.testType,
        testDescription: report.testDescription,
        status: frontendStatus,
        urgency: report.urgency,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        reportGeneratedDate: report.reportGeneratedDate,
        reportSentDate: report.reportSentDate,
        completedDate: report.completedDate,
        doctorId: report.doctorId,
        patientId: report.patientId,
        assignedLabStaffId: report.assignedLabStaffId,
        sampleCollectorId: report.sampleCollectorId,
        labTechnicianId: report.labTechnicianId,
        reportSummary: report.reportSummary,
        clinicalInterpretation: report.clinicalInterpretation,
        conclusion: report.conclusion,
        recommendations: report.recommendations,
        pdfFile: report.pdfFile,
        hasPdf: !!report.pdfFile,
        reportGenerated: report.status === 'Report_Generated' || report.status === 'Report_Sent' || report.status === 'Completed',
        sampleCollected: report.status === 'Sample_Collected' || report.status === 'Testing_In_Progress' || report.status === 'Report_Generated' || report.status === 'Report_Sent' || report.status === 'Completed',
        testingCompleted: report.status === 'Testing_Completed' || report.status === 'Report_Generated' || report.status === 'Report_Sent' || report.status === 'Completed',
        additionalFiles: report.additionalFiles || [],
        centerId: report.centerId
      };
    });

    res.json({
      reports: transformedReports,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lab reports', error: error.message });
  }
};

export const getSuperAdminDoctorPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Get patient with center information and existing test data
    const patient = await Patient.findById(patientId)
      .populate('centerId', 'name code')
      .populate('assignedDoctor', 'name');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get comprehensive patient history with all 58 fields
    const history = await History.findOne({ patientId });
    
    // Get all medications
    const medications = await Medication.find({ patientId }).sort({ createdAt: -1 });
    
    // Get all followups
    const followups = await FollowUp.find({ patientId })
      .populate('updatedBy', 'name')
      .sort({ createdAt: -1 });

    // Get all specific followup types
    const allergicRhinitis = await AllergicRhinitis.find({ patient: patientId }).sort({ createdAt: -1 });
    const allergicConjunctivitis = await AllergicConjunctivitis.find({ patient: patientId }).sort({ createdAt: -1 });
    const allergicBronchitis = await AllergicBronchitis.find({ patient: patientId }).sort({ createdAt: -1 });
    const atopicDermatitis = await AtopicDermatitis.find({ patient: patientId }).sort({ createdAt: -1 });
    const gpe = await GPE.find({ patient: patientId }).sort({ createdAt: -1 });

    // Get prescriptions
    const prescriptions = await Prescription.find({ patient: patientId }).sort({ createdAt: -1 });

    // Create comprehensive history data
    const historyData = [];

    // Add patient registration as first history entry
    historyData.push({
      type: 'Patient Registration',
      date: patient.createdAt,
      description: `Patient ${patient.name} registered at ${patient.centerId?.name || 'Medical Center'}`
    });

    // Add patient demographics
    historyData.push({
      type: 'Patient Demographics',
      date: patient.createdAt,
      description: `Age: ${patient.age}, Gender: ${patient.gender}, Contact: ${patient.phone}${patient.email ? `, Email: ${patient.email}` : ''}`
    });

    // Add address if available
    if (patient.address) {
      historyData.push({
        type: 'Patient Address',
        date: patient.createdAt,
        description: `Address: ${patient.address}`
      });
    }

    // Add comprehensive history data if available
    if (history) {
      // Medical Conditions
      if (history.hayFever) historyData.push({ type: 'Hay Fever', date: history.createdAt, description: history.hayFever });
      if (history.asthma) historyData.push({ type: 'Asthma', date: history.createdAt, description: history.asthma });
      if (history.breathingProblems) historyData.push({ type: 'Breathing Problems', date: history.createdAt, description: history.breathingProblems });
      if (history.hivesSwelling) historyData.push({ type: 'Hives/Swelling', date: history.createdAt, description: history.hivesSwelling });
      if (history.sinusTrouble) historyData.push({ type: 'Sinus Trouble', date: history.createdAt, description: history.sinusTrouble });
      if (history.eczemaRashes) historyData.push({ type: 'Eczema/Rashes', date: history.createdAt, description: history.eczemaRashes });
      if (history.foodAllergies) historyData.push({ type: 'Food Allergies', date: history.createdAt, description: history.foodAllergies });
      if (history.arthriticDiseases) historyData.push({ type: 'Arthritic Diseases', date: history.createdAt, description: history.arthriticDiseases });
      if (history.immuneDefect) historyData.push({ type: 'Immune Defect', date: history.createdAt, description: history.immuneDefect });
      if (history.drugAllergy) historyData.push({ type: 'Drug Allergy', date: history.createdAt, description: history.drugAllergy });
      if (history.beeStingHypersensitivity) historyData.push({ type: 'Bee Sting Hypersensitivity', date: history.createdAt, description: history.beeStingHypersensitivity });

      // Hay Fever Details
      if (history.feverGrade) historyData.push({ type: 'Fever Grade', date: history.createdAt, description: history.feverGrade });
      if (history.itchingSoreThroat) historyData.push({ type: 'Itching/Sore Throat', date: history.createdAt, description: history.itchingSoreThroat });
      if (history.specificDayExposure) historyData.push({ type: 'Specific Day Exposure', date: history.createdAt, description: history.specificDayExposure });

      // Asthma Details
      if (history.asthmaType) historyData.push({ type: 'Asthma Type', date: history.createdAt, description: history.asthmaType });
      if (history.exacerbationsFrequency) historyData.push({ type: 'Exacerbations Frequency', date: history.createdAt, description: history.exacerbationsFrequency });

      // Medical Events
      if (history.hospitalAdmission) historyData.push({ type: 'Hospital Admission', date: history.createdAt, description: history.hospitalAdmission });
      if (history.gpAttendances) historyData.push({ type: 'GP Attendances', date: history.createdAt, description: history.gpAttendances });
      if (history.aeAttendances) historyData.push({ type: 'AE Attendances', date: history.createdAt, description: history.aeAttendances });
      if (history.ituAdmissions) historyData.push({ type: 'ITU Admissions', date: history.createdAt, description: history.ituAdmissions });
      if (history.coughWheezeFrequency) historyData.push({ type: 'Cough/Wheeze Frequency', date: history.createdAt, description: history.coughWheezeFrequency });
      if (history.intervalSymptoms) historyData.push({ type: 'Interval Symptoms', date: history.createdAt, description: history.intervalSymptoms });
      if (history.nightCoughFrequency) historyData.push({ type: 'Night Cough Frequency', date: history.createdAt, description: history.nightCoughFrequency });
      if (history.earlyMorningCough) historyData.push({ type: 'Early Morning Cough', date: history.createdAt, description: history.earlyMorningCough });
      if (history.exerciseInducedSymptoms) historyData.push({ type: 'Exercise Induced Symptoms', date: history.createdAt, description: history.exerciseInducedSymptoms });
      if (history.familySmoking) historyData.push({ type: 'Family Smoking', date: history.createdAt, description: history.familySmoking });
      if (history.petsAtHome) historyData.push({ type: 'Pets At Home', date: history.createdAt, description: history.petsAtHome });

      // Triggers
      if (history.triggersUrtis) historyData.push({ type: 'Triggers - URTIs', date: history.createdAt, description: 'Yes' });
      if (history.triggersColdWeather) historyData.push({ type: 'Triggers - Cold Weather', date: history.createdAt, description: 'Yes' });
      if (history.triggersPollen) historyData.push({ type: 'Triggers - Pollen', date: history.createdAt, description: 'Yes' });
      if (history.triggersSmoke) historyData.push({ type: 'Triggers - Smoke', date: history.createdAt, description: 'Yes' });
      if (history.triggersExercise) historyData.push({ type: 'Triggers - Exercise', date: history.createdAt, description: 'Yes' });
      if (history.triggersPets) historyData.push({ type: 'Triggers - Pets', date: history.createdAt, description: 'Yes' });
      if (history.triggersOthers) historyData.push({ type: 'Triggers - Others', date: history.createdAt, description: history.triggersOthers });

      // Allergic Rhinitis
      if (history.allergicRhinitisType) historyData.push({ type: 'Allergic Rhinitis Type', date: history.createdAt, description: history.allergicRhinitisType });
      if (history.rhinitisSneezing) historyData.push({ type: 'Rhinitis - Sneezing', date: history.createdAt, description: history.rhinitisSneezing });
      if (history.rhinitisNasalCongestion) historyData.push({ type: 'Rhinitis - Nasal Congestion', date: history.createdAt, description: history.rhinitisNasalCongestion });
      if (history.rhinitisRunningNose) historyData.push({ type: 'Rhinitis - Running Nose', date: history.createdAt, description: history.rhinitisRunningNose });
      if (history.rhinitisItchingNose) historyData.push({ type: 'Rhinitis - Itching Nose', date: history.createdAt, description: history.rhinitisItchingNose });
      if (history.rhinitisItchingEyes) historyData.push({ type: 'Rhinitis - Itching Eyes', date: history.createdAt, description: history.rhinitisItchingEyes });
      if (history.rhinitisCoughing) historyData.push({ type: 'Rhinitis - Coughing', date: history.createdAt, description: history.rhinitisCoughing });
      if (history.rhinitisWheezing) historyData.push({ type: 'Rhinitis - Wheezing', date: history.createdAt, description: history.rhinitisWheezing });
      if (history.rhinitisCoughingWheezing) historyData.push({ type: 'Rhinitis - Coughing/Wheezing', date: history.createdAt, description: history.rhinitisCoughingWheezing });
      if (history.rhinitisWithExercise) historyData.push({ type: 'Rhinitis - With Exercise', date: history.createdAt, description: history.rhinitisWithExercise });
      if (history.rhinitisHeadaches) historyData.push({ type: 'Rhinitis - Headaches', date: history.createdAt, description: history.rhinitisHeadaches });
      if (history.rhinitisPostNasalDrip) historyData.push({ type: 'Rhinitis - Post Nasal Drip', date: history.createdAt, description: history.rhinitisPostNasalDrip });

      // Skin Allergy
      if (history.skinAllergyType) historyData.push({ type: 'Skin Allergy Type', date: history.createdAt, description: history.skinAllergyType });
      if (history.skinHeavesPresent) historyData.push({ type: 'Skin - Heaves Present', date: history.createdAt, description: history.skinHeavesPresent });
      if (history.skinHeavesDistribution) historyData.push({ type: 'Skin - Heaves Distribution', date: history.createdAt, description: history.skinHeavesDistribution });
      if (history.skinEczemaPresent) historyData.push({ type: 'Skin - Eczema Present', date: history.createdAt, description: history.skinEczemaPresent });
      if (history.skinEczemaDistribution) historyData.push({ type: 'Skin - Eczema Distribution', date: history.createdAt, description: history.skinEczemaDistribution });
      if (history.skinUlcerPresent) historyData.push({ type: 'Skin - Ulcer Present', date: history.createdAt, description: history.skinUlcerPresent });
      if (history.skinUlcerDistribution) historyData.push({ type: 'Skin - Ulcer Distribution', date: history.createdAt, description: history.skinUlcerDistribution });
      if (history.skinPapuloSquamousRashesPresent) historyData.push({ type: 'Skin - Papulo Squamous Rashes Present', date: history.createdAt, description: history.skinPapuloSquamousRashesPresent });
      if (history.skinPapuloSquamousRashesDistribution) historyData.push({ type: 'Skin - Papulo Squamous Rashes Distribution', date: history.createdAt, description: history.skinPapuloSquamousRashesDistribution });
      if (history.skinItchingNoRashesPresent) historyData.push({ type: 'Skin - Itching No Rashes Present', date: history.createdAt, description: history.skinItchingNoRashesPresent });
      if (history.skinItchingNoRashesDistribution) historyData.push({ type: 'Skin - Itching No Rashes Distribution', date: history.createdAt, description: history.skinItchingNoRashesDistribution });

      // Medical History
      if (history.hypertension) historyData.push({ type: 'Hypertension', date: history.createdAt, description: history.hypertension });
      if (history.diabetes) historyData.push({ type: 'Diabetes', date: history.createdAt, description: history.diabetes });
      if (history.epilepsy) historyData.push({ type: 'Epilepsy', date: history.createdAt, description: history.epilepsy });
      if (history.ihd) historyData.push({ type: 'IHD', date: history.createdAt, description: history.ihd });

      // New Drugs
      if (history.drugAllergyKnown) historyData.push({ type: 'Drug Allergy Known', date: history.createdAt, description: history.drugAllergyKnown });
      if (history.probable) historyData.push({ type: 'Probable', date: history.createdAt, description: history.probable });
      if (history.definite) historyData.push({ type: 'Definite', date: history.createdAt, description: history.definite });

      // Occupation and Exposure
      if (history.occupation) historyData.push({ type: 'Occupation', date: history.createdAt, description: history.occupation });
      if (history.probableChemicalExposure) historyData.push({ type: 'Probable Chemical Exposure', date: history.createdAt, description: history.probableChemicalExposure });
      if (history.location) historyData.push({ type: 'Location', date: history.createdAt, description: history.location });
      if (history.familyHistory) historyData.push({ type: 'Family History', date: history.createdAt, description: history.familyHistory });

      // Examination
      if (history.oralCavity) historyData.push({ type: 'Oral Cavity', date: history.createdAt, description: history.oralCavity });
      if (history.skin) historyData.push({ type: 'Skin', date: history.createdAt, description: history.skin });
      if (history.ent) historyData.push({ type: 'ENT', date: history.createdAt, description: history.ent });
      if (history.eye) historyData.push({ type: 'Eye', date: history.createdAt, description: history.eye });
      if (history.respiratorySystem) historyData.push({ type: 'Respiratory System', date: history.createdAt, description: history.respiratorySystem });
      if (history.cvs) historyData.push({ type: 'CVS', date: history.createdAt, description: history.cvs });
      if (history.cns) historyData.push({ type: 'CNS', date: history.createdAt, description: history.cns });
      if (history.abdomen) historyData.push({ type: 'Abdomen', date: history.createdAt, description: history.abdomen });
      if (history.otherFindings) historyData.push({ type: 'Other Findings', date: history.createdAt, description: history.otherFindings });

      // Report File
      if (history.reportFile) historyData.push({ type: 'Report File', date: history.createdAt, description: history.reportFile });
    }

    // Add existing test data from patient.tests array
    if (patient.tests && patient.tests.length > 0) {
      patient.tests.forEach((test, index) => {
        const testDate = test.date || patient.createdAt;
        const testDescription = [];
        
        // Add test results if available
        if (test.CBC) testDescription.push(`CBC: ${test.CBC}`);
        if (test.Hb) testDescription.push(`Hb: ${test.Hb}`);
        if (test.TC) testDescription.push(`TC: ${test.TC}`);
        if (test.DC) testDescription.push(`DC: ${test.DC}`);
        if (test.Neutrophils) testDescription.push(`Neutrophils: ${test.Neutrophils}`);
        if (test.Eosinophil) testDescription.push(`Eosinophil: ${test.Eosinophil}`);
        if (test.Lymphocytes) testDescription.push(`Lymphocytes: ${test.Lymphocytes}`);
        if (test.Monocytes) testDescription.push(`Monocytes: ${test.Monocytes}`);
        if (test.Platelets) testDescription.push(`Platelets: ${test.Platelets}`);
        if (test.ESR) testDescription.push(`ESR: ${test.ESR}`);
        if (test.SerumCreatinine) testDescription.push(`Serum Creatinine: ${test.SerumCreatinine}`);
        if (test.SerumIgELevels) testDescription.push(`Serum IgE Levels: ${test.SerumIgELevels}`);
        if (test.C3C4Levels) testDescription.push(`C3C4 Levels: ${test.C3C4Levels}`);
        if (test.ANA_IF) testDescription.push(`ANA IF: ${test.ANA_IF}`);
        if (test.UrineRoutine) testDescription.push(`Urine Routine: ${test.UrineRoutine}`);
        if (test.AllergyPanel) testDescription.push(`Allergy Panel: ${test.AllergyPanel}`);

        if (testDescription.length > 0) {
          historyData.push({
            type: `Lab Test ${index + 1}`,
            date: testDate,
            description: testDescription.join(', ')
          });
        }
      });
    }

    // Add assigned doctor information
    if (patient.assignedDoctor) {
      historyData.push({
        type: 'Doctor Assignment',
        date: patient.createdAt,
        description: `Assigned to Dr. ${patient.assignedDoctor.name}`
      });
    }

    res.json({
      historyData,
      medications,
      followups,
      allergicRhinitis,
      allergicConjunctivitis,
      allergicBronchitis,
      atopicDermatitis,
      gpe,
      prescriptions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient history', error: error.message });
  }
};

export const sendFeedbackToCenterDoctor = async (req, res) => {
  try {
    
    const { reportId, patientId, centerDoctorId, additionalTests, patientInstructions, notes } = req.body;

    // Update the test request with superadmin review and status
    const updatedTestRequest = await TestRequest.findByIdAndUpdate(
      reportId,
      {
        status: 'feedback_sent',
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

    if (!updatedTestRequest) {
      return res.status(404).json({ message: 'Test report not found' });
    }

    // Create a notification for the center doctor
    const notification = new Notification({
      recipient: centerDoctorId,
      sender: req.user.id,
      type: 'lab_report_feedback',
      title: 'Lab Report Feedback',
      message: `Superadmin doctor has reviewed the lab report for patient ${updatedTestRequest.patientName || 'Unknown'}`,
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
      testRequest: updatedTestRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending feedback', error: error.message });
  }
};

// Get all patients for superadmin doctor (only those with completed lab reports)
export const getSuperAdminDoctorPatients = async (req, res) => {
  try {
    
    // First, get all test requests with completed status
    const completedTestRequests = await TestRequest.find({
      status: { $in: ['Report_Generated', 'Report_Sent', 'Completed', 'feedback_sent'] }
    }).select('patientId');
    
    // Extract unique patient IDs from completed test requests
    const patientIds = [...new Set(completedTestRequests.map(tr => tr.patientId))];
    
    // Get patients who have completed lab reports
    const patients = await Patient.find({ _id: { $in: patientIds } })
      .populate('centerId', 'name code')
      .populate('assignedDoctor', 'name')
      .sort({ createdAt: -1 });

    res.json({
      patients,
      count: patients.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

// Get patient followups
export const getSuperAdminDoctorPatientFollowups = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get real followup data from database
    const followups = await FollowUp.find({ patientId })
      .populate('updatedBy', 'name')
      .populate('allergicRhinitisId')
      .sort({ createdAt: -1 });

    res.json(followups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient followups', error: error.message });
  }
};

// Get patient medications
export const getSuperAdminDoctorPatientMedications = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get real medication data from database
    const medications = await Medication.find({ patientId })
      .populate('prescribedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient medications', error: error.message });
  }
};

// Get patient lab reports
export const getSuperAdminDoctorPatientLabReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get comprehensive lab reports from TestRequest collection with PDF information
    const labReports = await TestRequest.find({ patientId })
      .populate('doctorId', 'name')
      .populate('assignedLabStaffId', 'name')
      .populate('sampleCollectorId', 'name')
      .populate('labTechnicianId', 'name')
      .sort({ createdAt: -1 });

    // Transform lab reports to include PDF file paths and comprehensive data
    const transformedReports = labReports.map(report => ({
      ...report.toObject(),
      pdfFile: report.reportFile || null, // PDF file path if available
      hasPdf: !!report.reportFile,
      reportGenerated: !!report.reportGeneratedDate,
      sampleCollected: !!report.sampleCollectionActualDate,
      testingCompleted: !!report.testingEndDate
    }));

    res.json(transformedReports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient lab reports', error: error.message });
  }
}; 