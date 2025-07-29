import express from 'express';
import {
  addDoctor,
  getAllDoctors,
  deleteDoctor,
  getDoctorById,
  updateDoctor,
  getAssignedPatients,
  getPatientDetails,
  addTestRequest,
  getTestRequests
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Doctor-specific routes (for doctors to manage their patients) - PUT THESE FIRST
router.get('/assigned-patients', protect, getAssignedPatients);
router.get('/test-requests', protect, getTestRequests);
router.get('/patient/:patientId', protect, getPatientDetails);
router.post('/patient/:patientId/test-request', protect, addTestRequest);

// Admin routes (for center admin to manage doctors) - PUT THESE AFTER
router.post('/', protect, addDoctor);
router.get('/', protect, getAllDoctors);
router.get('/:id', protect, getDoctorById);
router.delete('/:id', protect, deleteDoctor);
router.put('/:id', protect, updateDoctor);

export default router;
