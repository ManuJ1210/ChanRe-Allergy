import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { pdfAuth } from '../middleware/pdfAuthMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  getAllTestRequests,
  getPendingTestRequests,
  getCompletedTestRequests,
  getTestRequestsByDoctor,
  getTestRequestsForCurrentDoctor,
  getCompletedTestRequestsForCurrentDoctor,
  getTestRequestsByCenter,
  getTestRequestsByLabStaff,
  getTestRequestsForCurrentLabStaff,
  getTestRequestsByPatient,
  getTestRequestById,
  createTestRequest,
  assignLabStaff,
  scheduleSampleCollection,
  updateSampleCollectionStatus,
  startLabTesting,
  completeLabTesting,
  generateTestReport,
  sendReportToDoctor,
  updateTestRequestStatus,
  cancelTestRequest,
  deleteTestRequest,
  getTestRequestStats,
  downloadTestReport
} from '../controllers/testRequestController.js';

const router = express.Router();

// Get all test requests (for superadmin)
router.get('/', protect, getAllTestRequests);

// Get pending test requests
router.get('/pending', protect, getPendingTestRequests);

// Get completed test requests
router.get('/completed', protect, getCompletedTestRequests);

// Get test request statistics
router.get('/stats', protect, getTestRequestStats);

// Get test requests for current doctor (authenticated)
router.get('/doctor', protect, getTestRequestsForCurrentDoctor);

// Get completed test requests for current doctor (authenticated)
router.get('/doctor/completed', protect, getCompletedTestRequestsForCurrentDoctor);

// Get test requests for current lab staff (authenticated)
router.get('/lab-staff', protect, getTestRequestsForCurrentLabStaff);

// Get test requests by doctor
router.get('/doctor/:doctorId', protect, getTestRequestsByDoctor);

// Get test requests by center
router.get('/center/:centerId', protect, getTestRequestsByCenter);

// Get test requests by lab staff
router.get('/lab-staff/:labStaffId', protect, getTestRequestsByLabStaff);

// Get test requests by patient
router.get('/patient/:patientId', protect, getTestRequestsByPatient);

// Get test request by ID
router.get('/:id', protect, getTestRequestById);

// Create new test request
router.post('/', protect, createTestRequest);

// Assign lab staff to test request
router.put('/:id/assign', protect, assignLabStaff);

// Schedule sample collection
router.put('/:id/schedule-collection', protect, scheduleSampleCollection);

// Update sample collection status
router.put('/:id/collection-status', protect, updateSampleCollectionStatus);

// Start lab testing
router.put('/:id/start-testing', protect, startLabTesting);

// Complete lab testing
router.put('/:id/complete-testing', protect, completeLabTesting);

// Generate test report (PDF)
router.put('/:id/generate-report', protect, generateTestReport);

// Send report to doctor
router.put('/:id/send-report', protect, sendReportToDoctor);

// Update test request status
router.put('/:id/status', protect, updateTestRequestStatus);

// Cancel test request
router.put('/:id/cancel', protect, cancelTestRequest);

// Delete test request
router.delete('/:id', protect, deleteTestRequest);

// Download test report (PDF)
router.get('/:id/download-report', pdfAuth, downloadTestReport);

export default router; 