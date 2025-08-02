import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chenre-allergy';

async function updateExistingData() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔧 UPDATING EXISTING DATA\n');

    // Update doctors
    const doctors = await User.find({ role: 'doctor' });
    console.log(`📋 Found ${doctors.length} doctors to update`);

    for (const doctor of doctors) {
      // If doctor has centerId, they are center-specific
      if (doctor.centerId) {
        await User.findByIdAndUpdate(doctor._id, { isSuperAdminStaff: false });
        console.log(`✅ Updated doctor ${doctor.name}: Set isSuperAdminStaff to false (center-specific)`);
      } else {
        // If no centerId, they are superadmin staff
        await User.findByIdAndUpdate(doctor._id, { isSuperAdminStaff: true });
        console.log(`✅ Updated doctor ${doctor.name}: Set isSuperAdminStaff to true (superadmin staff)`);
      }
    }

    // Update receptionists
    const receptionists = await User.find({ role: 'receptionist' });
    console.log(`📋 Found ${receptionists.length} receptionists to update`);

    for (const receptionist of receptionists) {
      // If receptionist has centerId, they are center-specific
      if (receptionist.centerId) {
        await User.findByIdAndUpdate(receptionist._id, { isSuperAdminStaff: false });
        console.log(`✅ Updated receptionist ${receptionist.name}: Set isSuperAdminStaff to false (center-specific)`);
      } else {
        // If no centerId, they are superadmin staff
        await User.findByIdAndUpdate(receptionist._id, { isSuperAdminStaff: true });
        console.log(`✅ Updated receptionist ${receptionist.name}: Set isSuperAdminStaff to true (superadmin staff)`);
      }
    }

    // Verify the updates
    console.log('\n🔍 VERIFICATION:');
    
    const updatedDoctors = await User.find({ role: 'doctor' });
    const updatedReceptionists = await User.find({ role: 'receptionist' });

    console.log('\n📊 Updated Data:');
    console.log('Doctors:');
    updatedDoctors.forEach(doctor => {
      console.log(`  - ${doctor.name}: isSuperAdminStaff = ${doctor.isSuperAdminStaff}, centerId = ${doctor.centerId}`);
    });

    console.log('\nReceptionists:');
    updatedReceptionists.forEach(receptionist => {
      console.log(`  - ${receptionist.name}: isSuperAdminStaff = ${receptionist.isSuperAdminStaff}, centerId = ${receptionist.centerId}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateExistingData(); 