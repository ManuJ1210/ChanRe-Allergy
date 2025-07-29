import express from 'express';
import { createFollowUp, getFollowUpsByPatient, getAllPatientsWithFollowUps, getAllDetailedFollowUps, getFollowUpsByCenter } from '../controllers/followUpController.js';
import { protect, checkSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createFollowUp);
router.get('/', protect, getFollowUpsByPatient);
router.get('/center', protect, getFollowUpsByCenter);
router.get('/patients', protect, checkSuperAdmin, getAllPatientsWithFollowUps);
router.get('/detailed', protect, checkSuperAdmin, getAllDetailedFollowUps);

export default router; 