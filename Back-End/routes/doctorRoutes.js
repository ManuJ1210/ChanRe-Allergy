import express from 'express';
import { addDoctor } from '../controllers/doctorController.js';
import { getAllDoctors } from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/doctors
router.post('/', protect, addDoctor);
router.get('/', protect, getAllDoctors);

export default router;
