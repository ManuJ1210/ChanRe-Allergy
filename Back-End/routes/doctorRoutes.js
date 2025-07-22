import express from 'express';
import {
  addDoctor,
  getAllDoctors,
  deleteDoctor,
  getDoctorById,
  updateDoctor
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addDoctor);
router.get('/', protect, getAllDoctors);
router.get('/:id', protect, getDoctorById); // ✅ Fetch for edit
router.delete('/:id', protect, deleteDoctor); // ✅ Delete
router.put('/:id', protect, updateDoctor); // ✅ Update

export default router;
