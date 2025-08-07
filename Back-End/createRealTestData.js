import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './models/Patient.js';
import TestRequest from './models/TestRequest.js';
import Center from './models/Center.js';
import User from './models/User.js';
import SuperAdminDoctor from './models/SuperAdminDoctor.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/allergy-clinic';

async function createRealTestData() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Create a test center if it doesn't exist
    let center = await Center.findOne({ name: 'Chenre Allergy Center' });
    if (!center) {
      center = await Center.create({
        name: 'Chenre Allergy Center',
        code: 'CAC001',
        location: 'Chennai',
        address: '123 Allergy Street, Chennai',
        phone: '9876543210',
        email: 'info@chenreallergy.com'
      });
      console.log('✅ Created center:', center._id);
    }

    // Create a regular doctor if it doesn't exist
    let doctor = await User.findOne({ email: 'doctor@chenreallergy.com' });
    if (!doctor) {
      doctor = await User.create({
        name: 'Dr. Sarah Johnson',
        email: 'doctor@chenreallergy.com',
        password: 'password123',
        role: 'doctor',
        phone: '9876543211',
        centerId: center._id,
        qualification: 'MBBS, MD',
        designation: 'Senior Consultant',
        kmcNumber: 'KMC123456',
        hospitalName: 'Chenre Allergy Center',
        experience: '8 years',
        specializations: ['Allergy', 'Immunology'],
        status: 'active'
      });
      console.log('✅ Created doctor:', doctor._id);
    }

    // Create real patients
    const patients = [
      {
        name: 'Rajesh Kumar',
        gender: 'male',
        age: 35,
        phone: '9876543212',
        email: 'rajesh.kumar@email.com',
        address: '456 Patient Street, Chennai',
        centerId: center._id,
        registeredBy: doctor._id
      },
      {
        name: 'Priya Sharma',
        gender: 'female',
        age: 28,
        phone: '9876543213',
        email: 'priya.sharma@email.com',
        address: '789 Patient Avenue, Chennai',
        centerId: center._id,
        registeredBy: doctor._id
      },
      {
        name: 'Amit Patel',
        gender: 'male',
        age: 42,
        phone: '9876543214',
        email: 'amit.patel@email.com',
        address: '321 Patient Road, Chennai',
        centerId: center._id,
        registeredBy: doctor._id
      }
    ];

    const createdPatients = [];
    for (const patientData of patients) {
      let patient = await Patient.findOne({ email: patientData.email });
      if (!patient) {
        patient = await Patient.create(patientData);
        console.log('✅ Created patient:', patient.name, patient._id);
      }
      createdPatients.push(patient);
    }

    // Create completed test requests
    const testRequests = [
      {
        doctorId: doctor._id,
        patientId: createdPatients[0]._id,
        testType: 'Complete Blood Work',
        testDescription: 'Comprehensive blood analysis including CBC, IgE levels, and allergy panel',
        urgency: 'Normal',
        notes: 'Patient experiencing seasonal allergies',
        centerId: center._id,
        centerName: center.name,
        centerCode: center.code,
        doctorName: doctor.name,
        patientName: createdPatients[0].name,
        patientPhone: createdPatients[0].phone,
        patientAddress: createdPatients[0].address,
        status: 'Completed',
        testResults: 'Completed',
        resultDetails: 'CBC: Normal, Hb: 14.2, IgE: Elevated (450 IU/mL), Allergy Panel: Positive for dust mites and pollen',
        resultValues: [
          { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '12-16', status: 'Normal' },
          { parameter: 'White Blood Cells', value: '7500', unit: '/μL', normalRange: '4000-11000', status: 'Normal' },
          { parameter: 'IgE Level', value: '450', unit: 'IU/mL', normalRange: '<100', status: 'High' },
          { parameter: 'Dust Mite Allergy', value: 'Positive', unit: '', normalRange: 'Negative', status: 'High' },
          { parameter: 'Pollen Allergy', value: 'Positive', unit: '', normalRange: 'Negative', status: 'High' }
        ],
        reportGeneratedDate: new Date(),
        reportGeneratedBy: doctor._id,
        reportGeneratedByName: doctor.name,
        reportSummary: 'Patient shows elevated IgE levels and positive allergy reactions to dust mites and pollen',
        clinicalInterpretation: 'Allergic rhinitis with elevated IgE levels. Recommend allergen avoidance and immunotherapy consideration.',
        conclusion: 'Positive allergy test results for dust mites and pollen',
        recommendations: '1. Avoid dust exposure\n2. Use HEPA filters\n3. Consider immunotherapy\n4. Monitor symptoms',
        labTestingCompletedDate: new Date(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        doctorId: doctor._id,
        patientId: createdPatients[1]._id,
        testType: 'Allergy Panel',
        testDescription: 'Comprehensive allergy testing for food and environmental allergens',
        urgency: 'Urgent',
        notes: 'Patient with severe allergic reactions',
        centerId: center._id,
        centerName: center.name,
        centerCode: center.code,
        doctorName: doctor.name,
        patientName: createdPatients[1].name,
        patientPhone: createdPatients[1].phone,
        patientAddress: createdPatients[1].address,
        status: 'Completed',
        testResults: 'Completed',
        resultDetails: 'Severe allergy to peanuts, moderate allergy to shellfish, mild allergy to dust',
        resultValues: [
          { parameter: 'Peanut Allergy', value: 'Strong Positive', unit: '', normalRange: 'Negative', status: 'Critical' },
          { parameter: 'Shellfish Allergy', value: 'Moderate Positive', unit: '', normalRange: 'Negative', status: 'High' },
          { parameter: 'Dust Allergy', value: 'Mild Positive', unit: '', normalRange: 'Negative', status: 'High' },
          { parameter: 'IgE Level', value: '680', unit: 'IU/mL', normalRange: '<100', status: 'High' }
        ],
        reportGeneratedDate: new Date(),
        reportGeneratedBy: doctor._id,
        reportGeneratedByName: doctor.name,
        reportSummary: 'Patient shows severe peanut allergy and moderate shellfish allergy',
        clinicalInterpretation: 'Severe food allergies detected. Patient requires strict avoidance and emergency action plan.',
        conclusion: 'Multiple food allergies detected with severe peanut allergy',
        recommendations: '1. Strict peanut avoidance\n2. Carry epinephrine auto-injector\n3. Emergency action plan\n4. Regular follow-up',
        labTestingCompletedDate: new Date(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        doctorId: doctor._id,
        patientId: createdPatients[2]._id,
        testType: 'Skin Allergy Test',
        testDescription: 'Comprehensive skin prick testing for environmental allergens',
        urgency: 'Normal',
        notes: 'Patient with chronic skin conditions',
        centerId: center._id,
        centerName: center.name,
        centerCode: center.code,
        doctorName: doctor.name,
        patientName: createdPatients[2].name,
        patientPhone: createdPatients[2].phone,
        patientAddress: createdPatients[2].address,
        status: 'Completed',
        testResults: 'Completed',
        resultDetails: 'Positive reactions to multiple environmental allergens including mold, pet dander, and grass pollen',
        resultValues: [
          { parameter: 'Mold Allergy', value: 'Positive', unit: '', normalRange: 'Negative', status: 'High' },
          { parameter: 'Pet Dander', value: 'Positive', unit: '', normalRange: 'Negative', status: 'High' },
          { parameter: 'Grass Pollen', value: 'Positive', unit: '', normalRange: 'Negative', status: 'High' },
          { parameter: 'Tree Pollen', value: 'Negative', unit: '', normalRange: 'Negative', status: 'Normal' }
        ],
        reportGeneratedDate: new Date(),
        reportGeneratedBy: doctor._id,
        reportGeneratedByName: doctor.name,
        reportSummary: 'Multiple environmental allergies detected',
        clinicalInterpretation: 'Patient shows sensitivity to multiple environmental allergens. Recommend environmental control measures.',
        conclusion: 'Environmental allergies to mold, pet dander, and grass pollen',
        recommendations: '1. Use air purifiers\n2. Avoid pet exposure\n3. Monitor pollen counts\n4. Consider immunotherapy',
        labTestingCompletedDate: new Date(),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    for (const testRequestData of testRequests) {
      let testRequest = await TestRequest.findOne({ 
        patientId: testRequestData.patientId, 
        testType: testRequestData.testType 
      });
      if (!testRequest) {
        testRequest = await TestRequest.create(testRequestData);
        console.log('✅ Created test request:', testRequest.testType, 'for patient:', testRequest.patientName);
      }
    }

    console.log('\n✅ Real test data created successfully!');
    console.log('📋 Summary:');
    console.log('- 1 Center created');
    console.log('- 1 Doctor created');
    console.log('- 3 Patients created');
    console.log('- 3 Completed test requests created');
    console.log('\n🔑 Test Credentials:');
    console.log('Superadmin Doctor: superadmin.doctor@test.com / password123');
    console.log('Regular Doctor: doctor@chenreallergy.com / password123');

  } catch (error) {
    console.error('❌ Error creating real test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

createRealTestData();
