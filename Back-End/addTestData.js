// Script to add test data for patients, tests, and history
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './models/Patient.js';
import Test from './models/Test.js';
import History from './models/historyModel.js';
import Center from './models/Center.js';
import User from './models/User.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chenre-allergy';

async function addTestData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Create a test center if it doesn't exist
    let center = await Center.findOne({ name: 'Test Center' });
    if (!center) {
      center = await Center.create({
        name: 'Test Center',
        code: 'TEST001',
        location: 'Test City',
        address: '123 Test Street',
        phone: '1234567890',
        email: 'test@center.com'
      });
      console.log('Created test center:', center._id);
    }

    // Create a test user if it doesn't exist
    let user = await User.findOne({ email: 'test@user.com' });
    if (!user) {
      user = await User.create({
        name: 'Test User',
        email: 'test@user.com',
        password: 'password123',
        role: 'receptionist',
        phone: '1234567890'
      });
      console.log('Created test user:', user._id);
    }

    // Create a test patient if it doesn't exist
    let patient = await Patient.findOne({ name: 'John Doe' });
    if (!patient) {
      patient = await Patient.create({
        name: 'John Doe',
        gender: 'male',
        age: 35,
        phone: '9876543210',
        email: 'john.doe@email.com',
        address: '456 Patient Street',
        centerId: center._id,
        registeredBy: user._id,
        tests: [
          {
            CBC: 'Normal',
            Hb: '14.5',
            TC: '7500',
            DC: 'Normal',
            Neutrophils: '65%',
            Eosinophil: '3%',
            Lymphocytes: '25%',
            Monocytes: '7%',
            Platelets: '250000',
            ESR: '15',
            SerumCreatinine: '0.9',
            SerumIgELevels: '150',
            C3C4Levels: 'Normal',
            ANA_IF: 'Negative',
            UrineRoutine: 'Normal',
            AllergyPanel: 'Positive for dust mites',
            date: new Date()
          }
        ]
      });
      console.log('Created test patient:', patient._id);
    }

    // Create test history if it doesn't exist
    let history = await History.findOne({ patientId: patient._id });
    if (!history) {
      history = await History.create({
        patientId: patient._id,
        hayFever: 'Yes',
        asthma: 'No',
        breathingProblems: 'Occasional',
        hivesSwelling: 'No',
        foodAllergies: 'Peanuts',
        drugAllergy: 'None',
        feverGrade: 'Mild',
        itchingSoreThroat: 'Yes',
        specificDayExposure: 'Spring',
        triggersPollen: true,
        triggersDust: true,
        occupation: 'Office worker',
        familyHistory: 'Father has hay fever'
      });
      console.log('Created test history:', history._id);
    }

    // Create test in Test collection if it doesn't exist
    let test = await Test.findOne({ patient: patient._id });
    if (!test) {
      test = await Test.create({
        patient: patient._id,
        CBC: 'Normal',
        Hb: '14.5',
        TC: '7500',
        DC: 'Normal',
        Neutrophils: '65%',
        Eosinophil: '3%',
        Lymphocytes: '25%',
        Monocytes: '7%',
        Platelets: '250000',
        ESR: '15',
        SerumCreatinine: '0.9',
        SerumIgELevels: '150',
        C3C4Levels: 'Normal',
        ANA_IF: 'Negative',
        UrineRoutine: 'Normal',
        AllergyPanel: 'Positive for dust mites',
        testType: 'Complete Blood Work',
        status: 'completed',
        date: new Date()
      });
      console.log('Created test in Test collection:', test._id);
    }

    console.log('\n✅ Test data added successfully!');
    console.log('Patient ID:', patient._id);
    console.log('You can now test with this patient ID in the frontend.');

  } catch (error) {
    console.error('Error adding test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addTestData(); 