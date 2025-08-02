import express from 'express';
import {
  addSuperAdminReceptionist,
  getAllSuperAdminReceptionists,
  getSuperAdminReceptionistById,
  updateSuperAdminReceptionist,
  deleteSuperAdminReceptionist,
  toggleSuperAdminReceptionistStatus,
  getSuperAdminReceptionistStats
} from '../controllers/superAdminReceptionistController.js';
import { protect, checkSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and superadmin role
router.use(protect);
router.use(checkSuperAdmin);

// Super Admin Receptionist routes
router.post('/', addSuperAdminReceptionist);
router.get('/', getAllSuperAdminReceptionists);
router.get('/stats', getSuperAdminReceptionistStats);
router.get('/:id', getSuperAdminReceptionistById);
router.put('/:id', updateSuperAdminReceptionist);
router.delete('/:id', deleteSuperAdminReceptionist);
router.patch('/:id/toggle-status', toggleSuperAdminReceptionistStatus);

export default router; 