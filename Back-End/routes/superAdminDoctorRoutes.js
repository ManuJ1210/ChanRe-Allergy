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
  getSuperAdminDoctorAssignedPatients,
  getSuperAdminDoctorPatientById,
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

// Working routes (for superadmin doctors to perform their duties)
router.get('/working/assigned-patients', getSuperAdminDoctorAssignedPatients);
router.get('/working/patients/:id', getSuperAdminDoctorPatientById);
router.post('/working/test-requests', createSuperAdminDoctorTestRequest);
router.get('/working/test-requests', getSuperAdminDoctorTestRequests);
router.get('/working/completed-reports', getSuperAdminDoctorCompletedReports);
router.get('/working/stats', getSuperAdminDoctorWorkingStats);

// Lab Reports functionality
router.get('/working/lab-reports', getSuperAdminDoctorLabReports);
router.post('/working/send-feedback', sendFeedbackToCenterDoctor);

export default router; 