import express from 'express';
import {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addTestToPatient,
  getPatientAndTests,
  getPatientsByReceptionist,
  getPatientsByDoctor
} from '../controllers/patientController.js';
import { protect, ensureCenterIsolation, ensureDoctor } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
// Apply center isolation middleware to ensure data security
router.use(ensureCenterIsolation);

// Patient Routes - Only doctors can create/update/delete
router.post('/', ensureDoctor, addPatient);
router.get('/', getPatients);
router.get('/receptionist/mine', getPatientsByReceptionist);
router.get('/doctor/:doctorId', getPatientsByDoctor);
router.get('/:id', getPatientById);
router.put('/:id', ensureDoctor, updatePatient);
router.delete('/:id', ensureDoctor, deletePatient);

// Test Routes for Patient - Only doctors can add tests
router.post('/:id/tests', ensureDoctor, addTestToPatient);
router.get('/:id/show-tests', getPatientAndTests);

export default router;
