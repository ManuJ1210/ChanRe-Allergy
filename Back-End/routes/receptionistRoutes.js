import express from 'express';
import {
  createReceptionist,
  getAllReceptionists,
  deleteReceptionist,
  getReceptionistById,
  updateReceptionist
} from '../controllers/receptionistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create receptionist
router.post('/', protect, createReceptionist);
// Get all receptionists
router.get('/', protect, getAllReceptionists);
// Get single receptionist by ID
router.get('/:id', protect, getReceptionistById);
// Update receptionist by ID
router.put('/:id', protect, updateReceptionist);
// Delete receptionist by ID
router.delete('/:id', protect, deleteReceptionist);

export default router; 