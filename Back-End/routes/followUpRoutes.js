import express from 'express';
import { createFollowUp, getFollowUpsByPatient } from '../controllers/followUpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createFollowUp);
router.get('/', protect, getFollowUpsByPatient);

export default router; 