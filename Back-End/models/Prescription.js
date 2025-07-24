import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  medicationName: String,
  dosage: String,
  duration: String,
  instructions: String
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  visit: String,
  date: { type: Date, default: Date.now },
  medications: [medicationSchema],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema); 