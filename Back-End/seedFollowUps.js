import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FollowUp from './models/FollowUp.js';
import User from './models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

// TODO: Replace with real ObjectIds from your database
const patientId = 'PUT_YOUR_PATIENT_OBJECTID_HERE';
const userId = 'PUT_A_VALID_USER_OBJECTID_HERE'; // e.g., a superadmin or centeradmin

const types = [
  'Allergic Rhinitis',
  'Atopic Dermatitis',
  'Allergic Conjunctivitis',
  'Allergic Bronchitis',
  'GPE'
];

for (const type of types) {
  await FollowUp.create({
    patientId,
    type,
    notes: `Seeded note for ${type}`,
    updatedBy: userId
  });
}

console.log('Seeded follow-ups!');
process.exit(); 