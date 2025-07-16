import express from 'express';
import {
  getAllCenterAdmins,
  getCenterAdminById,
  updateCenterAdmin,
  deleteCenterAdmin
} from '../controllers/centerAdminController.js';

const router = express.Router();

// ✅ Existing route
router.get('/', getAllCenterAdmins);

// ✅ New routes
router.get('/:id', getCenterAdminById);
router.put('/:id', updateCenterAdmin);
router.delete('/:id', deleteCenterAdmin);

export default router;
