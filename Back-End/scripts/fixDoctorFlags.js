import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chenre-allergy';

async function fixDoctorFlags() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Find all doctors in the User model
    const doctors = await User.find({ role: 'doctor' });
    console.log(`🔍 Found ${doctors.length} doctors in User model`);

    let updatedCount = 0;

    for (const doctor of doctors) {
      let needsUpdate = false;
      let updateData = {};

      // If doctor has centerId, ensure isSuperAdminStaff is false
      if (doctor.centerId) {
        if (doctor.isSuperAdminStaff !== false) {
          updateData.isSuperAdminStaff = false;
          needsUpdate = true;
          console.log(`🔧 Fixing doctor ${doctor.name} (${doctor._id}): Setting isSuperAdminStaff to false (has centerId: ${doctor.centerId})`);
        }
      } else {
        // If doctor has no centerId, ensure isSuperAdminStaff is true
        if (doctor.isSuperAdminStaff !== true) {
          updateData.isSuperAdminStaff = true;
          needsUpdate = true;
          console.log(`🔧 Fixing doctor ${doctor.name} (${doctor._id}): Setting isSuperAdminStaff to true (no centerId)`);
        }
      }

      if (needsUpdate) {
        await User.findByIdAndUpdate(doctor._id, updateData);
        updatedCount++;
      }
    }

    console.log(`✅ Updated ${updatedCount} doctors`);

    // Now let's check the receptionists too
    const receptionists = await User.find({ role: 'receptionist' });
    console.log(`🔍 Found ${receptionists.length} receptionists in User model`);

    let updatedReceptionistCount = 0;

    for (const receptionist of receptionists) {
      let needsUpdate = false;
      let updateData = {};

      // If receptionist has centerId, ensure isSuperAdminStaff is false
      if (receptionist.centerId) {
        if (receptionist.isSuperAdminStaff !== false) {
          updateData.isSuperAdminStaff = false;
          needsUpdate = true;
          console.log(`🔧 Fixing receptionist ${receptionist.name} (${receptionist._id}): Setting isSuperAdminStaff to false (has centerId: ${receptionist.centerId})`);
        }
      } else {
        // If receptionist has no centerId, ensure isSuperAdminStaff is true
        if (receptionist.isSuperAdminStaff !== true) {
          updateData.isSuperAdminStaff = true;
          needsUpdate = true;
          console.log(`🔧 Fixing receptionist ${receptionist.name} (${receptionist._id}): Setting isSuperAdminStaff to true (no centerId)`);
        }
      }

      if (needsUpdate) {
        await User.findByIdAndUpdate(receptionist._id, updateData);
        updatedReceptionistCount++;
      }
    }

    console.log(`✅ Updated ${updatedReceptionistCount} receptionists`);

    // Final summary
    console.log('\n📊 Summary:');
    console.log(`- Total doctors processed: ${doctors.length}`);
    console.log(`- Doctors updated: ${updatedCount}`);
    console.log(`- Total receptionists processed: ${receptionists.length}`);
    console.log(`- Receptionists updated: ${updatedReceptionistCount}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixDoctorFlags(); 