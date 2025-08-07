import express from 'express';
import {
  getAllSuperAdminDoctors,
  addSuperAdminDoctor,
  deleteSuperAdminDoctor,
  getSuperAdminDoctorById,
  updateSuperAdminDoctor,
  toggleSuperAdminDoctorStatus,
  getSuperAdminDoctorStats,
  // Working functions
  getSuperAdminDoctorPatients,
  getSuperAdminDoctorAssignedPatients,
  getSuperAdminDoctorPatientById,
  getSuperAdminDoctorPatientHistory,
  getSuperAdminDoctorPatientFollowups,
  getSuperAdminDoctorPatientMedications,
  getSuperAdminDoctorPatientLabReports,
  createSuperAdminDoctorTestRequest,
  getSuperAdminDoctorTestRequests,
  getSuperAdminDoctorCompletedReports,
  getSuperAdminDoctorWorkingStats,
  // Lab Reports functionality
  getSuperAdminDoctorLabReports,
  sendFeedbackToCenterDoctor
} from '../controllers/superAdminDoctorController.js';
import { protect, checkSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Working routes (for superadmin doctors to perform their duties) - Only protect, no checkSuperAdmin
router.get('/working/patients', protect, getSuperAdminDoctorPatients);
router.get('/working/assigned-patients', protect, getSuperAdminDoctorAssignedPatients);
router.get('/working/patients/:id', protect, getSuperAdminDoctorPatientById);
router.get('/working/patients/:patientId/history', protect, getSuperAdminDoctorPatientHistory);
router.get('/working/patients/:patientId/followups', protect, getSuperAdminDoctorPatientFollowups);
router.get('/working/patients/:patientId/medications', protect, getSuperAdminDoctorPatientMedications);
router.get('/working/patients/:patientId/lab-reports', protect, getSuperAdminDoctorPatientLabReports);
router.post('/working/test-requests', protect, createSuperAdminDoctorTestRequest);
router.get('/working/test-requests', protect, getSuperAdminDoctorTestRequests);
router.get('/working/completed-reports', protect, getSuperAdminDoctorCompletedReports);
router.get('/working/stats', protect, getSuperAdminDoctorWorkingStats);

// Lab Reports functionality
router.get('/working/lab-reports', protect, getSuperAdminDoctorLabReports);
router.post('/working/send-feedback', protect, sendFeedbackToCenterDoctor);

// Management routes (for superadmin to manage superadmin doctors)
router.use(protect);
router.use(checkSuperAdmin);

router.get('/', getAllSuperAdminDoctors);
router.post('/', addSuperAdminDoctor);
router.get('/stats', getSuperAdminDoctorStats);
router.get('/:id', getSuperAdminDoctorById);
router.put('/:id', updateSuperAdminDoctor);
router.delete('/:id', deleteSuperAdminDoctor);
router.patch('/:id/toggle-status', toggleSuperAdminDoctorStatus);

export default router; 