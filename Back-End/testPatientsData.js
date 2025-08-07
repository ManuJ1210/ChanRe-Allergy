import mongoose from 'mongoose';
import TestRequest from './models/TestRequest.js';
import Patient from './models/Patient.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/allergy_clinic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testPatientsData = async () => {
  try {
    console.log('🔍 Checking patients with completed lab reports...');
    
    // Check all test requests
    const allTestRequests = await TestRequest.find({});
    console.log('📊 Total test requests:', allTestRequests.length);
    
    // Check completed test requests
    const completedTestRequests = await TestRequest.find({
      status: { $in: ['Report_Generated', 'Report_Sent', 'Completed'] }
    });
    console.log('✅ Completed test requests:', completedTestRequests.length);
    
    // Get unique patient IDs from completed test requests
    const patientIds = [...new Set(completedTestRequests.map(tr => tr.patientId))];
    console.log('👥 Unique patients with completed reports:', patientIds.length);
    
    // Get patients who have completed lab reports
    const patients = await Patient.find({ _id: { $in: patientIds } })
      .populate('centerId', 'name')
      .populate('assignedDoctor', 'name');
    
    console.log('🏥 Patients with completed lab reports:', patients.length);
    
    if (patients.length > 0) {
      console.log('📋 Patient details:');
      patients.forEach((patient, index) => {
        console.log(`${index + 1}. ${patient.name} (${patient.age} years, ${patient.gender})`);
        console.log(`   Center: ${patient.centerId?.name || 'N/A'}`);
        console.log(`   Doctor: ${patient.assignedDoctor?.name || 'Not assigned'}`);
        console.log(`   Phone: ${patient.phone}`);
        console.log('---');
      });
    } else {
      console.log('❌ No patients found with completed lab reports');
      console.log('💡 You need to create test data with completed lab reports');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testPatientsData();
