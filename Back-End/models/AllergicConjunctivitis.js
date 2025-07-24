import mongoose from 'mongoose';

const allergicConjunctivitisSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  symptoms: [String],
  type: String,
  grading: Object,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('AllergicConjunctivitis', allergicConjunctivitisSchema); 