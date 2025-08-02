import express from 'express';
import {
  addSuperAdminDoctor,
  getAllSuperAdminDoctors,
  getSuperAdminDoctorById,
  updateSuperAdminDoctor,
  deleteSuperAdminDoctor,
  toggleSuperAdminDoctorStatus,
  getSuperAdminDoctorStats
} from '../controllers/superAdminDoctorController.js';
import { protect, checkSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and superadmin role
router.use(protect);
router.use(checkSuperAdmin);

// Super Admin Doctor routes
router.post('/', addSuperAdminDoctor);
router.get('/', getAllSuperAdminDoctors);
router.get('/stats', getSuperAdminDoctorStats);
router.get('/:id', getSuperAdminDoctorById);
router.put('/:id', updateSuperAdminDoctor);
router.delete('/:id', deleteSuperAdminDoctor);
router.patch('/:id/toggle-status', toggleSuperAdminDoctorStatus);

export default router; 