import mongoose from 'mongoose';
import SuperAdminDoctor from './models/SuperAdminDoctor.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/allergy-clinic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testPassword = async () => {
  try {
    console.log('🔍 Testing password for superadmin doctor...');
    
    // Find the test doctor
    const doctor = await SuperAdminDoctor.findOne({ email: 'superadmin.doctor@test.com' });
    if (!doctor) {
      console.log('❌ Test doctor not found');
      return;
    }
    
    console.log('✅ Found test doctor:', {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
      isSuperAdminStaff: doctor.isSuperAdminStaff
    });
    
    // Test password comparison
    const isPasswordCorrect = await doctor.matchPassword('password123');
    console.log('🔍 Password match result:', isPasswordCorrect);
    
    if (isPasswordCorrect) {
      console.log('✅ Password comparison working correctly');
    } else {
      console.log('❌ Password comparison failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing password:', error);
  } finally {
    mongoose.connection.close();
  }
};

testPassword();
