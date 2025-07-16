import express from 'express';
import {
  createCenterWithAdmin,
  getAllCenters,
  deleteCenter,
  updateCenter,
  getCenterById,
  getCenterWithAdmin,
} from '../controllers/centerController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Specific route first
router.get('/withadmin/:id', protect, getCenterWithAdmin);

router.post('/create-with-admin', createCenterWithAdmin);
router.get('/', getAllCenters);
router.delete('/:id', deleteCenter);
router.put('/:id', updateCenter);
router.get('/:id', getCenterById);

export default router;
