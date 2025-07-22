import express from 'express';
import {
  getAllCenterAdmins,
  getCenterAdminById,
  updateCenterAdmin,
  deleteCenterAdmin,
  createCenterAdmin
} from '../controllers/centerAdminController.js';

const router = express.Router();

// ✅ Existing route
router.get('/', getAllCenterAdmins);

// ✅ New routes
router.get('/:id', getCenterAdminById);
router.put('/:id', updateCenterAdmin);
router.delete('/:id', deleteCenterAdmin);
router.post('/', createCenterAdmin);

export default router;
