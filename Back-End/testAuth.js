import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LabStaff from './models/LabStaff.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for testing'))
.catch((err) => console.error('MongoDB connection failed:', err));

// Test function to create a lab staff user
const createTestLabStaff = async () => {
  try {
    // Check if test user already exists
    const existingUser = await LabStaff.findOne({ email: 'labstaff@test.com' });
    
    if (existingUser) {
      console.log('Test lab staff user already exists');
      return existingUser;
    }

    // Create test lab staff user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testLabStaff = new LabStaff({
      staffName: 'Test Lab Staff',
      email: 'labstaff@test.com',
      phone: '1234567890',
      role: 'Lab Staff',
      password: hashedPassword,
      labId: 'CENTRAL_LAB',
      isActive: true
    });

    await testLabStaff.save();
    console.log('Test lab staff user created successfully:', testLabStaff);
    return testLabStaff;
  } catch (error) {
    console.error('Error creating test lab staff:', error);
  }
};

// Test function to create a regular user
const createTestUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@test.com' });
    
    if (existingUser) {
      console.log('Test user already exists');
      return existingUser;
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'superadmin',
      phone: '1234567890'
    });

    await testUser.save();
    console.log('Test user created successfully:', testUser);
    return testUser;
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

// Test authentication
const testAuthentication = async () => {
  try {
    console.log('\n=== Testing Authentication ===');
    
    // Test lab staff login
    const labStaff = await LabStaff.findOne({ email: 'labstaff@test.com' });
    if (labStaff) {
      const isPasswordValid = await labStaff.matchPassword('password123');
      console.log('Lab staff password validation:', isPasswordValid);
    }

    // Test regular user login
    const user = await User.findOne({ email: 'test@test.com' });
    if (user) {
      const isPasswordValid = await user.matchPassword('password123');
      console.log('User password validation:', isPasswordValid);
    }

    console.log('Authentication test completed');
  } catch (error) {
    console.error('Error testing authentication:', error);
  }
};

// Run tests
const runTests = async () => {
  try {
    console.log('Starting authentication tests...\n');
    
    await createTestUser();
    await createTestLabStaff();
    await testAuthentication();
    
    console.log('\nAll tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

runTests(); 