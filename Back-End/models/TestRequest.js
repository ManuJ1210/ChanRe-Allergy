import mongoose from 'mongoose';

const testRequestSchema = new mongoose.Schema({
  // Basic request info
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  testType: {
    type: String,
    required: true
  },
  testDescription: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['Normal', 'Urgent', 'Emergency'],
    default: 'Normal'
  },
  notes: String,
  
  // Center and doctor info (derived)
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center'
  },
  centerName: String,
  centerCode: String,
  doctorName: String,
  patientName: String,
  patientPhone: String,
  patientAddress: String,
  
  // Lab workflow fields
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Sample_Collection_Scheduled', 'Sample_Collected', 'In_Lab_Testing', 'Testing_Completed', 'Report_Generated', 'Report_Sent', 'Completed', 'Cancelled', 'feedback_sent'],
    default: 'Pending'
  },
  
  // Lab staff assignment
  assignedLabStaffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabStaff'
  },
  assignedLabStaffName: String,
  
  // Sample collection details
  sampleCollectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabStaff'
  },
  sampleCollectorName: String,
  sampleCollectionScheduledDate: Date,
  sampleCollectionActualDate: Date,
  sampleCollectionNotes: String,
  sampleCollectionStatus: {
    type: String,
    enum: ['Not_Scheduled', 'Scheduled', 'In_Progress', 'Completed', 'Failed'],
    default: 'Not_Scheduled'
  },
  
  // Lab testing details
  labTechnicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabStaff'
  },
  labTechnicianName: String,
  testingStartDate: Date,
  testingEndDate: Date,
  testingNotes: String,
  
  // Test results
  testResults: {
    type: String,
    default: 'Pending'
  },
  resultDetails: String,
  resultValues: [{
    parameter: String,
    value: String,
    unit: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['Normal', 'High', 'Low', 'Critical'],
      default: 'Normal'
    }
  }],
  
  // Report generation
  reportGeneratedDate: Date,
  reportGeneratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabStaff'
  },
  reportGeneratedByName: String,
  reportFile: String, // PDF file path
  reportNotes: String,
  reportFilePath: String, // For uploaded files
  reportSummary: String,
  clinicalInterpretation: String,
  qualityControl: String,
  methodUsed: String,
  equipmentUsed: String,
  
  // Additional fields for complete testing workflow
  conclusion: String,
  recommendations: String,
  labTestingCompletedDate: Date,
  
  // Report sending fields
  reportSentDate: Date,
  reportSentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabStaff'
  },
  reportSentByName: String,
  sendMethod: String,
  emailSubject: String,
  emailMessage: String,
  notificationMessage: String,
  sentTo: String,
  deliveryConfirmation: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Status tracking
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update the updatedAt field on save
testRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const TestRequest = mongoose.model('TestRequest', testRequestSchema);

export default TestRequest; 