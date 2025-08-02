import TestRequest from '../models/TestRequest.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Center from '../models/Center.js';
import LabStaff from '../models/LabStaff.js';

// Get all test requests (for superadmin)
export const getAllTestRequests = async (req, res) => {
  try {
    const testRequests = await TestRequest.find({ isActive: true })
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName')
      .sort({ createdAt: -1 });

    res.status(200).json(testRequests);
  } catch (error) {
    console.error('Error fetching all test requests:', error);
    res.status(500).json({ message: 'Failed to fetch test requests' });
  }
};

// Get pending test requests
export const getPendingTestRequests = async (req, res) => {
  try {
    const testRequests = await TestRequest.find({ 
      status: { $in: ['Pending', 'Assigned'] },
      isActive: true 
    })
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .sort({ createdAt: -1 });

    res.status(200).json(testRequests);
  } catch (error) {
    console.error('Error fetching pending test requests:', error);
    res.status(500).json({ message: 'Failed to fetch pending test requests' });
  }
};

// Get completed test requests
export const getCompletedTestRequests = async (req, res) => {
  try {
    const testRequests = await TestRequest.find({ 
      status: 'Completed',
      isActive: true 
    })
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName')
      .sort({ createdAt: -1 });

    res.status(200).json(testRequests);
  } catch (error) {
    console.error('Error fetching completed test requests:', error);
    res.status(500).json({ message: 'Failed to fetch completed test requests' });
  }
};

// Get test requests by doctor
export const getTestRequestsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const testRequests = await TestRequest.find({ 
      doctorId, 
      isActive: true 
    })
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName')
      .sort({ createdAt: -1 });

    res.status(200).json(testRequests);
  } catch (error) {
    console.error('Error fetching test requests by doctor:', error);
    res.status(500).json({ message: 'Failed to fetch test requests' });
  }
};

// Get test requests for current doctor (authenticated)
export const getTestRequestsForCurrentDoctor = async (req, res) => {
  try {
    console.log('User object from token:', req.user);
    console.log('User ID:', req.user.id);
    console.log('User _ID:', req.user._id);
    
    const doctorId = req.user.id || req.user._id;
    
    if (!doctorId) {
      console.log('No doctor ID found in user object');
      return res.status(400).json({ message: 'Doctor ID not found in token' });
    }
    
    console.log('Searching for test requests with doctorId:', doctorId);
    
    const testRequests = await TestRequest.find({ 
      doctorId, 
      isActive: true 
    })
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName')
      .sort({ createdAt: -1 });

    console.log('Found test requests:', testRequests.length);
    res.status(200).json(testRequests);
  } catch (error) {
    console.error('Error fetching test requests for current doctor:', error);
    res.status(500).json({ message: 'Failed to fetch test requests' });
  }
};

// Get test requests by center
export const getTestRequestsByCenter = async (req, res) => {
  try {
    const { centerId } = req.params;
    
    const testRequests = await TestRequest.find({ 
      centerId, 
      isActive: true 
    })
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName')
      .sort({ createdAt: -1 });

    res.status(200).json(testRequests);
  } catch (error) {
    console.error('Error fetching test requests by center:', error);
    res.status(500).json({ message: 'Failed to fetch test requests' });
  }
};

// Get test requests by lab staff
export const getTestRequestsByLabStaff = async (req, res) => {
  try {
    const { labStaffId } = req.params;
    
    const testRequests = await TestRequest.find({ 
      assignedLabStaffId: labStaffId, 
      isActive: true 
    })
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName')
      .sort({ createdAt: -1 });

    res.status(200).json(testRequests);
  } catch (error) {
    console.error('Error fetching test requests by lab staff:', error);
    res.status(500).json({ message: 'Failed to fetch test requests' });
  }
};

// Get test requests for current lab staff (authenticated)
export const getTestRequestsForCurrentLabStaff = async (req, res) => {
  try {
    console.log('Lab staff user object from token:', req.user);
    console.log('Lab staff ID:', req.user.id);
    console.log('Lab staff _ID:', req.user._id);
    
    const labStaffId = req.user.id || req.user._id;
    
    if (!labStaffId) {
      console.log('No lab staff ID found in user object');
      return res.status(400).json({ message: 'Lab staff ID not found in token' });
    }
    
    console.log('Searching for test requests with labStaffId:', labStaffId);
    
    // Get all test requests (lab staff can see all, not just assigned ones)
    const testRequests = await TestRequest.find({ 
      isActive: true 
    })
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName')
      .sort({ createdAt: -1 });

    console.log('Found test requests for lab staff:', testRequests.length);
    res.status(200).json(testRequests);
  } catch (error) {
    console.error('Error fetching test requests for current lab staff:', error);
    res.status(500).json({ message: 'Failed to fetch test requests' });
  }
};

// Get test requests by patient
export const getTestRequestsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log('Backend getTestRequestsByPatient: received patientId:', patientId, typeof patientId);
    
    const testRequests = await TestRequest.find({ 
      patientId, 
      isActive: true 
    })
      .populate('doctorId', 'name email phone')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName')
      .sort({ createdAt: -1 });

    res.status(200).json(testRequests);
  } catch (error) {
    console.error('Error fetching test requests by patient:', error);
    res.status(500).json({ message: 'Failed to fetch test requests' });
  }
};

// Get test request by ID
export const getTestRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testRequest = await TestRequest.findById(id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName');

    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    res.status(200).json(testRequest);
  } catch (error) {
    console.error('Error fetching test request by ID:', error);
    res.status(500).json({ message: 'Failed to fetch test request' });
  }
};

// Create new test request
export const createTestRequest = async (req, res) => {
  try {
    console.log('createTestRequest called with body:', req.body);
    const {
      doctorId,
      patientId,
      testType,
      testDescription,
      urgency,
      notes
    } = req.body;
    console.log('Extracted data:', { doctorId, patientId, testType, testDescription, urgency, notes });

    // Get doctor information
    console.log('Looking for doctor with ID:', doctorId);
    const doctor = await User.findById(doctorId);
    console.log('Doctor found:', doctor);
    if (!doctor) {
      console.log('Doctor not found for ID:', doctorId);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get patient information
    console.log('Looking for patient with ID:', patientId);
    const patient = await Patient.findById(patientId);
    console.log('Patient found:', patient);
    if (!patient) {
      console.log('Patient not found for ID:', patientId);
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get center information from patient
    const center = await Center.findById(patient.centerId);
    console.log('Center found:', center);

    // Create new test request
    const newTestRequest = new TestRequest({
      doctorId,
      patientId,
      testType,
      testDescription,
      urgency: urgency || 'Normal',
      notes,
      centerId: patient.centerId,
      centerName: center ? center.name : 'Unknown Center',
      centerCode: center ? center.code : 'Unknown',
      doctorName: doctor.name,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientAddress: patient.address,
      status: 'Pending'
    });

    const savedTestRequest = await newTestRequest.save();
    console.log('Test request saved:', savedTestRequest);

    // Populate the saved test request
    const populatedTestRequest = await TestRequest.findById(savedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone');

    res.status(201).json({
      message: 'Test request created successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error creating test request:', error);
    res.status(500).json({ message: 'Failed to create test request', error: error.message });
  }
};

// Assign lab staff to test request
export const assignLabStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedLabStaffId, assignedLabStaffName } = req.body;

    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    testRequest.assignedLabStaffId = assignedLabStaffId;
    testRequest.assignedLabStaffName = assignedLabStaffName;
    testRequest.status = 'Assigned';
    testRequest.updatedAt = new Date();

    const updatedTestRequest = await testRequest.save();
    
    const populatedTestRequest = await TestRequest.findById(updatedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone');

    res.status(200).json({
      message: 'Lab staff assigned successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error assigning lab staff:', error);
    res.status(500).json({ message: 'Failed to assign lab staff' });
  }
};

// Schedule sample collection
export const scheduleSampleCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      sampleCollectorId, 
      sampleCollectorName, 
      sampleCollectionScheduledDate,
      sampleCollectionNotes 
    } = req.body;

    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    testRequest.sampleCollectorId = sampleCollectorId;
    testRequest.sampleCollectorName = sampleCollectorName;
    testRequest.sampleCollectionScheduledDate = sampleCollectionScheduledDate;
    testRequest.sampleCollectionNotes = sampleCollectionNotes;
    testRequest.sampleCollectionStatus = 'Scheduled';
    testRequest.status = 'Sample_Collection_Scheduled';
    testRequest.updatedAt = new Date();

    const updatedTestRequest = await testRequest.save();
    
    const populatedTestRequest = await TestRequest.findById(updatedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone');

    res.status(200).json({
      message: 'Sample collection scheduled successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error scheduling sample collection:', error);
    res.status(500).json({ message: 'Failed to schedule sample collection' });
  }
};

// Update sample collection status
export const updateSampleCollectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      sampleCollectionStatus, 
      sampleCollectionActualDate,
      sampleCollectionNotes 
    } = req.body;

    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    testRequest.sampleCollectionStatus = sampleCollectionStatus;
    if (sampleCollectionActualDate) {
      testRequest.sampleCollectionActualDate = sampleCollectionActualDate;
    }
    if (sampleCollectionNotes) {
      testRequest.sampleCollectionNotes = sampleCollectionNotes;
    }

    // Update main status based on sample collection status
    if (sampleCollectionStatus === 'Completed') {
      testRequest.status = 'Sample_Collected';
    } else if (sampleCollectionStatus === 'In_Progress') {
      testRequest.status = 'Sample_Collection_Scheduled';
    }

    testRequest.updatedAt = new Date();

    const updatedTestRequest = await testRequest.save();
    
    const populatedTestRequest = await TestRequest.findById(updatedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('sampleCollectorId', 'staffName phone');

    res.status(200).json({
      message: 'Sample collection status updated successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error updating sample collection status:', error);
    res.status(500).json({ message: 'Failed to update sample collection status' });
  }
};

// Start lab testing
export const startLabTesting = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      labTechnicianId, 
      labTechnicianName,
      testingNotes 
    } = req.body;

    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    testRequest.labTechnicianId = labTechnicianId;
    testRequest.labTechnicianName = labTechnicianName;
    testRequest.testingStartDate = new Date();
    testRequest.testingNotes = testingNotes;
    testRequest.status = 'In_Lab_Testing';
    testRequest.updatedAt = new Date();

    const updatedTestRequest = await testRequest.save();
    
    const populatedTestRequest = await TestRequest.findById(updatedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone');

    res.status(200).json({
      message: 'Lab testing started successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error starting lab testing:', error);
    res.status(500).json({ message: 'Failed to start lab testing' });
  }
};

// Complete lab testing
export const completeLabTesting = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      testResults,
      labTestingNotes,
      labTestingCompletedDate,
      testParameters,
      conclusion,
      recommendations
    } = req.body;

    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    // Map frontend field names to model field names
    testRequest.testResults = testResults;
    testRequest.testingNotes = labTestingNotes; // Map to correct field name
    testRequest.testingEndDate = labTestingCompletedDate || new Date(); // Map to correct field name
    testRequest.resultValues = testParameters || []; // Map to correct field name
    testRequest.conclusion = conclusion; // Use the new field
    testRequest.recommendations = recommendations; // Use the new field
    testRequest.labTestingCompletedDate = labTestingCompletedDate || new Date(); // Use the new field
    
    // Set the lab technician who completed the testing
    testRequest.labTechnicianId = req.user.id || req.user._id;
    testRequest.labTechnicianName = req.user.staffName || req.user.name;
    
    testRequest.status = 'Testing_Completed';
    testRequest.updatedAt = new Date();

    const updatedTestRequest = await testRequest.save();
    
    const populatedTestRequest = await TestRequest.findById(updatedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('labTechnicianId', 'staffName phone');

    res.status(200).json({
      message: 'Lab testing completed successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error completing lab testing:', error);
    res.status(500).json({ message: 'Failed to complete lab testing' });
  }
};

// Generate and upload test report
export const generateTestReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      reportNotes,
      reportSummary,
      clinicalInterpretation,
      qualityControl,
      methodUsed,
      equipmentUsed
    } = req.body;

    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    // Handle file upload if present
    let reportFilePath = null;
    if (req.file) {
      reportFilePath = req.file.path;
    }

    testRequest.reportGeneratedDate = new Date();
    testRequest.reportGeneratedBy = req.user.id || req.user._id;
    testRequest.reportGeneratedByName = req.user.staffName || req.user.name;
    testRequest.reportFilePath = reportFilePath;
    testRequest.reportNotes = reportNotes;
    testRequest.reportSummary = reportSummary;
    testRequest.clinicalInterpretation = clinicalInterpretation;
    testRequest.qualityControl = qualityControl;
    testRequest.methodUsed = methodUsed;
    testRequest.equipmentUsed = equipmentUsed;
    testRequest.status = 'Report_Generated';
    testRequest.updatedAt = new Date();

    const updatedTestRequest = await testRequest.save();
    
    const populatedTestRequest = await TestRequest.findById(updatedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName');

    res.status(200).json({
      message: 'Test report generated successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error generating test report:', error);
    res.status(500).json({ message: 'Failed to generate test report' });
  }
};

// Send report to doctor
export const sendReportToDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sendMethod,
      emailSubject,
      emailMessage,
      notificationMessage,
      reportSentDate,
      sentTo,
      deliveryConfirmation
    } = req.body;

    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    testRequest.reportSentDate = reportSentDate || new Date();
    testRequest.reportSentBy = req.user.id || req.user._id;
    testRequest.reportSentByName = req.user.staffName || req.user.name;
    testRequest.sendMethod = sendMethod;
    testRequest.emailSubject = emailSubject;
    testRequest.emailMessage = emailMessage;
    testRequest.notificationMessage = notificationMessage;
    testRequest.sentTo = sentTo;
    testRequest.deliveryConfirmation = deliveryConfirmation;
    testRequest.status = 'Completed'; // Set to Completed so it appears in completed tests
    testRequest.updatedAt = new Date();

    const updatedTestRequest = await testRequest.save();
    
    const populatedTestRequest = await TestRequest.findById(updatedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone')
      .populate('reportGeneratedBy', 'staffName');

    res.status(200).json({
      message: 'Report sent to doctor successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error sending report to doctor:', error);
    res.status(500).json({ message: 'Failed to send report to doctor' });
  }
};

// Update test request status
export const updateTestRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    testRequest.status = status;
    testRequest.updatedAt = new Date();

    const updatedTestRequest = await testRequest.save();
    
    const populatedTestRequest = await TestRequest.findById(updatedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone');

    res.status(200).json({
      message: 'Test request status updated successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error updating test request status:', error);
    res.status(500).json({ message: 'Failed to update test request status' });
  }
};

// Cancel test request
export const cancelTestRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    testRequest.status = 'Cancelled';
    testRequest.notes = cancellationReason ? `${testRequest.notes || ''}\nCancelled: ${cancellationReason}` : testRequest.notes;
    testRequest.updatedAt = new Date();

    const updatedTestRequest = await testRequest.save();
    
    const populatedTestRequest = await TestRequest.findById(updatedTestRequest._id)
      .populate('doctorId', 'name email phone')
      .populate('patientId', 'name phone address age gender')
      .populate('assignedLabStaffId', 'staffName phone');

    res.status(200).json({
      message: 'Test request cancelled successfully',
      testRequest: populatedTestRequest
    });
  } catch (error) {
    console.error('Error cancelling test request:', error);
    res.status(500).json({ message: 'Failed to cancel test request' });
  }
};

// Get test request statistics
export const getTestRequestStats = async (req, res) => {
  try {
    const stats = await TestRequest.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRequests = await TestRequest.countDocuments({ isActive: true });
    const pendingRequests = await TestRequest.countDocuments({ 
      status: { $in: ['Pending', 'Assigned'] }, 
      isActive: true 
    });
    const completedRequests = await TestRequest.countDocuments({ 
      status: 'Completed', 
      isActive: true 
    });

    res.status(200).json({
      totalRequests,
      pendingRequests,
      completedRequests,
      statusBreakdown: stats
    });
  } catch (error) {
    console.error('Error fetching test request statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

// Download test report
export const downloadTestReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testRequest = await TestRequest.findById(id);
    if (!testRequest) {
      return res.status(404).json({ message: 'Test request not found' });
    }

    // Check for report file path (new field) or report file (old field)
    const reportFilePath = testRequest.reportFilePath || testRequest.reportFile;
    
    if (!reportFilePath) {
      return res.status(404).json({ message: 'Report file not found' });
    }

    // For now, return the file path and metadata. In production, you'd serve the actual file
    res.status(200).json({
      message: 'Report file found',
      reportFile: reportFilePath,
      reportGeneratedDate: testRequest.reportGeneratedDate,
      reportGeneratedBy: testRequest.reportGeneratedByName,
      reportSummary: testRequest.reportSummary,
      clinicalInterpretation: testRequest.clinicalInterpretation,
      testResults: testRequest.testResults,
      conclusion: testRequest.conclusion,
      recommendations: testRequest.recommendations
    });
  } catch (error) {
    console.error('Error downloading test report:', error);
    res.status(500).json({ message: 'Failed to download test report' });
  }
};