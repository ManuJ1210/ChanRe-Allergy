import mongoose from 'mongoose';
import SuperAdminDoctor from './models/SuperAdminDoctor.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/allergy-clinic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createTestSuperadminDoctor = async () => {
  try {
    console.log('🔧 Creating test superadmin doctor...');
    
    // Check if test doctor already exists
    const existingDoctor = await SuperAdminDoctor.findOne({ email: 'superadmin.doctor@test.com' });
    if (existingDoctor) {
      console.log('✅ Test superadmin doctor already exists');
      console.log('Email: superadmin.doctor@test.com');
      console.log('Password: password123');
      return;
    }
    
    // Create test superadmin doctor
    const testDoctor = new SuperAdminDoctor({
      name: 'Test Superadmin Doctor',
      email: 'superadmin.doctor@test.com',
      password: 'password123',
      mobile: '1234567890',
      username: 'superadmin_doctor',
      qualification: 'MBBS, MD',
      designation: 'Senior Consultant',
      kmcNumber: 'KMC123456',
      hospitalName: 'Test Hospital',
      experience: '10 years',
      specializations: ['Allergy', 'Immunology', 'Dermatology'],
      bio: 'Experienced superadmin doctor specializing in allergy and immunology.',
      role: 'doctor',
      isSuperAdminStaff: true,
      status: 'active'
    });
    
    await testDoctor.save();
    
    console.log('✅ Test superadmin doctor created successfully!');
    console.log('Email: superadmin.doctor@test.com');
    console.log('Password: password123');
    console.log('ID:', testDoctor._id);
    
  } catch (error) {
    console.error('❌ Error creating test superadmin doctor:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestSuperadminDoctor();
