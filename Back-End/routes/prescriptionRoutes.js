import express from 'express';
import { createPrescription, getPrescriptionsByPatient, getPrescriptionById } from '../controllers/prescriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPrescription);
router.get('/', protect, getPrescriptionsByPatient);
router.get('/:id', protect, getPrescriptionById);

export default router; 