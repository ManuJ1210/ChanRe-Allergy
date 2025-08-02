import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LabStaff from './models/LabStaff.js';
import User from './models/User.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for creating test accounts'))
.catch((err) => console.error('MongoDB connection failed:', err));

// Create test accounts for different lab roles
const createTestAccounts = async () => {
  try {
    console.log('Creating test accounts...\n');

    // 1. Lab Technician (can access dashboard)
    const labTechnician = new LabStaff({
      staffName: 'John Technician',
      email: 'technician@lab.com',
      phone: '1234567890',
      role: 'Lab Technician',
      password: 'password123',
      labId: 'CENTRAL_LAB',
      isActive: true
    });
    await labTechnician.save();
    console.log('✅ Lab Technician created: technician@lab.com / password123');

    // 2. Lab Assistant (can access dashboard)
    const labAssistant = new LabStaff({
      staffName: 'Sarah Assistant',
      email: 'assistant@lab.com',
      phone: '1234567891',
      role: 'Lab Assistant',
      password: 'password123',
      labId: 'CENTRAL_LAB',
      isActive: true
    });
    await labAssistant.save();
    console.log('✅ Lab Assistant created: assistant@lab.com / password123');

    // 3. Lab Manager (can access dashboard)
    const labManager = new LabStaff({
      staffName: 'Mike Manager',
      email: 'manager@lab.com',
      phone: '1234567892',
      role: 'Lab Manager',
      password: 'password123',
      labId: 'CENTRAL_LAB',
      isActive: true
    });
    await labManager.save();
    console.log('✅ Lab Manager created: manager@lab.com / password123');

    // 4. Lab Staff (sample collection only)
    const labStaff = new LabStaff({
      staffName: 'Alex Collector',
      email: 'collector@lab.com',
      phone: '1234567893',
      role: 'Lab Staff',
      password: 'password123',
      labId: 'CENTRAL_LAB',
      isActive: true
    });
    await labStaff.save();
    console.log('✅ Lab Staff created: collector@lab.com / password123');

    console.log('\n🎉 All test accounts created successfully!');
    console.log('\n📋 Test Account Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 Superadmin: test@test.com / password123');
    console.log('🔬 Lab Technician: technician@lab.com / password123 (Dashboard Access)');
    console.log('🔬 Lab Assistant: assistant@lab.com / password123 (Dashboard Access)');
    console.log('🔬 Lab Manager: manager@lab.com / password123 (Dashboard Access)');
    console.log('🔬 Lab Staff: collector@lab.com / password123 (Sample Collection Only)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test accounts:', error);
    process.exit(1);
  }
};

createTestAccounts(); 