import mongoose from 'mongoose';
import User from '../models/User.js';

import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chenre-allergy';

async function checkDataSeparation() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 CHECKING DATA SEPARATION\n');

    // Check User model doctors
    const userDoctors = await User.find({ role: 'doctor' });
    console.log(`📋 User Model Doctors: ${userDoctors.length}`);
    
    const centerDoctors = userDoctors.filter(d => d.centerId && d.isSuperAdminStaff === false);
    const superadminDoctorsInUser = userDoctors.filter(d => d.isSuperAdminStaff === true);
    const unclearDoctors = userDoctors.filter(d => d.isSuperAdminStaff === undefined);
    
    console.log(`  - Center-specific doctors: ${centerDoctors.length}`);
    console.log(`  - Superadmin doctors (incorrect): ${superadminDoctorsInUser.length}`);
    console.log(`  - Unclear status: ${unclearDoctors.length}`);
    
    if (superadminDoctorsInUser.length > 0) {
      console.log('  ❌ ISSUE: Found superadmin doctors in User model:');
      superadminDoctorsInUser.forEach(d => {
        console.log(`    - ${d.name} (${d._id}) - isSuperAdminStaff: ${d.isSuperAdminStaff}`);
      });
    }

    // Check User model receptionists
    const userReceptionists = await User.find({ role: 'receptionist' });
    console.log(`\n📋 User Model Receptionists: ${userReceptionists.length}`);
    
    const centerReceptionists = userReceptionists.filter(r => r.centerId && r.isSuperAdminStaff === false);
    const superadminReceptionistsInUser = userReceptionists.filter(r => r.isSuperAdminStaff === true);
    const unclearReceptionists = userReceptionists.filter(r => r.isSuperAdminStaff === undefined);
    
    console.log(`  - Center-specific receptionists: ${centerReceptionists.length}`);
    console.log(`  - Superadmin receptionists (incorrect): ${superadminReceptionistsInUser.length}`);
    console.log(`  - Unclear status: ${unclearReceptionists.length}`);
    
    if (superadminReceptionistsInUser.length > 0) {
      console.log('  ❌ ISSUE: Found superadmin receptionists in User model:');
      superadminReceptionistsInUser.forEach(r => {
        console.log(`    - ${r.name} (${r._id}) - isSuperAdminStaff: ${r.isSuperAdminStaff}`);
      });
    }

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`Total center-specific doctors: ${centerDoctors.length}`);
    console.log(`Total center-specific receptionists: ${centerReceptionists.length}`);
    
    if (superadminDoctorsInUser.length > 0 || superadminReceptionistsInUser.length > 0) {
      console.log('\n❌ ISSUES FOUND:');
      console.log('- There are superadmin staff incorrectly stored in the User model');
      console.log('- These should be moved to the appropriate SuperAdmin models');
    } else {
      console.log('\n✅ DATA SEPARATION LOOKS GOOD!');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDataSeparation(); 