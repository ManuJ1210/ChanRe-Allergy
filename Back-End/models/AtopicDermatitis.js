import mongoose from 'mongoose';

const atopicDermatitisSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  symptoms: String,
  affectedAreas: String,
  intensity: Object,
  drynessWithoutEczema: String,
  drynessWithEczema: String,
  itching: Number,
  sleepDisturbance: Number,
  localApplications: String,
  otherMedications: String,
  skinExamination: String,
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('AtopicDermatitis', atopicDermatitisSchema); 