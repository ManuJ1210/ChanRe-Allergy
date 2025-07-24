import express from 'express';
import { createFollowUp, getFollowUpsByPatient, getAllPatientsWithFollowUps } from '../controllers/followUpController.js';
import { protect, checkSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createFollowUp);
router.get('/', protect, getFollowUpsByPatient);
router.get('/patients', protect, checkSuperAdmin, getAllPatientsWithFollowUps);

export default router; 