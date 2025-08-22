import express from 'express';
import {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addTestToPatient,
  getPatientAndTests,
  getPatientsByReceptionist,
  getPatientsByDoctor,
  getPatientHistory,
  getPatientMedications,
  getPatientFollowUps,
  addSampleData,
  testEndpoint
} from '../controllers/patientController.js';
import { protect, ensureCenterIsolation, ensureDoctor, ensureDoctorOrReceptionist, ensureDoctorOrCenterAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
// Apply center isolation middleware to ensure data security
router.use(ensureCenterIsolation);

// Patient Routes - Doctors, receptionists, and CenterAdmin can create patients
router.post('/', ensureDoctorOrCenterAdmin, addPatient);
router.get('/', getPatients);
router.get('/receptionist/mine', getPatientsByReceptionist);
router.get('/doctor/:doctorId', getPatientsByDoctor);
router.get('/:id', getPatientById);
// Doctors and CenterAdmin can update/delete patients
router.put('/:id', ensureDoctorOrCenterAdmin, updatePatient);
router.delete('/:id', ensureDoctorOrCenterAdmin, deletePatient);

// Test Routes for Patient - Doctors and CenterAdmin can add tests
router.post('/:id/tests', ensureDoctorOrCenterAdmin, addTestToPatient);
router.get('/:id/show-tests', getPatientAndTests);

// Patient Data Routes - Doctors and CenterAdmin can access
router.get('/:id/history', ensureDoctorOrCenterAdmin, getPatientHistory);
router.get('/:id/medications', ensureDoctorOrCenterAdmin, getPatientMedications);
router.get('/:id/follow-ups', ensureDoctorOrCenterAdmin, getPatientFollowUps);

// Temporary route for adding sample data (remove in production)
router.post('/:id/add-sample-data', ensureDoctorOrCenterAdmin, addSampleData);

// Test endpoint (remove in production)
router.get('/test', testEndpoint);

export default router;
