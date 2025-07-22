import express from 'express';
import {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addTestToPatient,
  getPatientAndTests
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Patient Routes
router.post('/', protect, addPatient);
router.get('/', protect, getPatients);
router.get('/:id', protect, getPatientById);
router.put('/:id', protect, updatePatient);
router.delete('/:id', protect, deletePatient);

// Test Routes for Patient
router.post('/:id/tests', protect, addTestToPatient);

router.get('/:id/show-tests', protect, getPatientAndTests);

export default router;
