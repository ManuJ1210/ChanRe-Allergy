import mongoose from 'mongoose';
import User from '../models/User.js';

import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chenre-allergy';

async function debugData() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 DETAILED DATA DEBUG\n');

    // Check User model doctors
    const userDoctors = await User.find({ role: 'doctor' });
    console.log(`📋 User Model Doctors: ${userDoctors.length}`);
    
    userDoctors.forEach((doctor, index) => {
      console.log(`\nDoctor ${index + 1}:`);
      console.log(`  - ID: ${doctor._id}`);
      console.log(`  - Name: ${doctor.name}`);
      console.log(`  - Email: ${doctor.email}`);
      console.log(`  - CenterId: ${doctor.centerId}`);
      console.log(`  - isSuperAdminStaff: ${doctor.isSuperAdminStaff}`);
      console.log(`  - Role: ${doctor.role}`);
      console.log(`  - Created: ${doctor.createdAt}`);
    });

    // Check User model receptionists
    const userReceptionists = await User.find({ role: 'receptionist' });
    console.log(`\n📋 User Model Receptionists: ${userReceptionists.length}`);
    
    userReceptionists.forEach((receptionist, index) => {
      console.log(`\nReceptionist ${index + 1}:`);
      console.log(`  - ID: ${receptionist._id}`);
      console.log(`  - Name: ${receptionist.name}`);
      console.log(`  - Email: ${receptionist.email}`);
      console.log(`  - CenterId: ${receptionist.centerId}`);
      console.log(`  - isSuperAdminStaff: ${receptionist.isSuperAdminStaff}`);
      console.log(`  - Role: ${receptionist.role}`);
      console.log(`  - Created: ${receptionist.createdAt}`);
    });



    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugData(); 