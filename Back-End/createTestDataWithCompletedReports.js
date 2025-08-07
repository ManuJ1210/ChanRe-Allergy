import mongoose from 'mongoose';
import TestRequest from './models/TestRequest.js';
import Patient from './models/Patient.js';
import Center from './models/Center.js';
import User from './models/User.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/allergy_clinic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createTestDataWithCompletedReports = async () => {
  try {
    console.log('🔧 Creating test data with completed lab reports...');
    
    // First, check if we have centers and doctors
    const centers = await Center.find({});
    const doctors = await User.find({ role: 'doctor' });
    
    if (centers.length === 0) {
      console.log('❌ No centers found. Please create centers first.');
      return;
    }
    
    if (doctors.length === 0) {
      console.log('❌ No doctors found. Please create doctors first.');
      return;
    }
    
    console.log(`✅ Found ${centers.length} centers and ${doctors.length} doctors`);
    
    // Create test patients
    const testPatients = [
      {
        name: 'John Smith',
        age: 35,
        gender: 'Male',
        phone: '1234567890',
        email: 'john.smith@email.com',
        address: '123 Main St, City',
        centerId: centers[0]._id,
        assignedDoctor: doctors[0]._id,
        createdAt: new Date()
      },
      {
        name: 'Sarah Johnson',
        age: 28,
        gender: 'Female',
        phone: '0987654321',
        email: 'sarah.johnson@email.com',
        address: '456 Oak Ave, Town',
        centerId: centers[0]._id,
        assignedDoctor: doctors[0]._id,
        createdAt: new Date()
      },
      {
        name: 'Michael Brown',
        age: 42,
        gender: 'Male',
        phone: '5551234567',
        email: 'michael.brown@email.com',
        address: '789 Pine Rd, Village',
        centerId: centers[0]._id,
        assignedDoctor: doctors[0]._id,
        createdAt: new Date()
      }
    ];
    
    // Create patients
    const createdPatients = [];
    for (const patientData of testPatients) {
      const patient = new Patient(patientData);
      await patient.save();
      createdPatients.push(patient);
      console.log(`✅ Created patient: ${patient.name}`);
    }
    
    // Create test requests with completed status
    const testRequests = [
      {
        patientId: createdPatients[0]._id,
        doctorId: doctors[0]._id,
        testType: 'Blood Test',
        testDescription: 'Complete blood count and allergy panel',
        urgency: 'Normal',
        status: 'Completed',
        reportGeneratedDate: new Date(),
        reportSummary: 'Normal blood count, mild allergy to pollen detected',
        clinicalInterpretation: 'Patient shows normal blood parameters with mild allergic response to environmental allergens',
        conclusion: 'Patient has mild seasonal allergies',
        recommendations: 'Consider antihistamines during pollen season',
        createdAt: new Date()
      },
      {
        patientId: createdPatients[1]._id,
        doctorId: doctors[0]._id,
        testType: 'Skin Prick Test',
        testDescription: 'Allergy skin testing for common allergens',
        urgency: 'Normal',
        status: 'Report_Generated',
        reportGeneratedDate: new Date(),
        reportSummary: 'Positive reactions to dust mites and pet dander',
        clinicalInterpretation: 'Patient shows moderate allergic response to indoor allergens',
        conclusion: 'Patient has moderate indoor allergies',
        recommendations: 'Consider immunotherapy and environmental controls',
        createdAt: new Date()
      },
      {
        patientId: createdPatients[2]._id,
        doctorId: doctors[0]._id,
        testType: 'IgE Test',
        testDescription: 'Serum IgE levels and specific allergen testing',
        urgency: 'Normal',
        status: 'Report_Sent',
        reportGeneratedDate: new Date(),
        reportSummary: 'Elevated IgE levels, specific allergies to food items detected',
        clinicalInterpretation: 'Patient shows elevated IgE levels indicating allergic predisposition',
        conclusion: 'Patient has multiple food allergies',
        recommendations: 'Strict avoidance of identified allergens, carry epinephrine',
        createdAt: new Date()
      }
    ];
    
    // Create test requests
    for (const requestData of testRequests) {
      const testRequest = new TestRequest(requestData);
      await testRequest.save();
      console.log(`✅ Created test request for ${requestData.testType} - Status: ${requestData.status}`);
    }
    
    console.log('\n🎉 Test data created successfully!');
    console.log(`📊 Created ${createdPatients.length} patients`);
    console.log(`📊 Created ${testRequests.length} test requests with completed status`);
    console.log('\n💡 Now you can test the superadmin doctor functionality:');
    console.log('1. Login as a superadmin doctor');
    console.log('2. Go to Patient Details page');
    console.log('3. You should see the test patients with completed lab reports');
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestDataWithCompletedReports();
