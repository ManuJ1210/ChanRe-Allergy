import mongoose from 'mongoose';
import SuperAdminDoctor from './models/SuperAdminDoctor.js';
import User from './models/User.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/allergy-clinic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkSuperadminDoctors = async () => {
  try {
    console.log('🔍 Checking existing users...');
    
    // Check regular users
    const regularUsers = await User.find({ role: 'doctor' });
    console.log('Regular Users with doctor role:', regularUsers.length);
    regularUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ID: ${user._id}`);
    });
    
    // Check superadmin doctors
    const superadminDoctors = await SuperAdminDoctor.find({});
    console.log('\nSuperadmin Doctors:', superadminDoctors.length);
    superadminDoctors.forEach(doctor => {
      console.log(`- ${doctor.name} (${doctor.email}) - ID: ${doctor._id} - isSuperAdminStaff: ${doctor.isSuperAdminStaff}`);
    });
    
    // Check if manu@gmail.com exists in SuperAdminDoctor
    const manuSuperadmin = await SuperAdminDoctor.findOne({ email: 'manu@gmail.com' });
    if (manuSuperadmin) {
      console.log('\n✅ Manu found in SuperAdminDoctor model');
      console.log('Manu details:', {
        id: manuSuperadmin._id,
        name: manuSuperadmin.name,
        email: manuSuperadmin.email,
        role: manuSuperadmin.role,
        isSuperAdminStaff: manuSuperadmin.isSuperAdminStaff
      });
    } else {
      console.log('\n❌ Manu not found in SuperAdminDoctor model');
      
      // Check if manu exists in regular User model
      const manuRegular = await User.findOne({ email: 'manu@gmail.com' });
      if (manuRegular) {
        console.log('Manu found in regular User model:', {
          id: manuRegular._id,
          name: manuRegular.name,
          email: manuRegular.email,
          role: manuRegular.role
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkSuperadminDoctors();


