import express from 'express';
import {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addPatient);
router.get('/', protect, getPatients);
router.get('/:id', protect, getPatientById); // 🔹 Get patient by ID
router.put('/:id', protect, updatePatient);
router.delete('/:id', protect, deletePatient);

export default router;
