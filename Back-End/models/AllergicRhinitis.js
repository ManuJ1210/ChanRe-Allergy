import mongoose from 'mongoose';

const allergicRhinitisSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  nasalSymptoms: { type: Object }, // e.g., { sneezing: 0, runningNose: 0, ... }
  nonNasalSymptoms: { type: Object }, // e.g., { eyeSymptoms: 0, ... }
  qualityOfLife: { type: Number },
  medications: { type: Object }, // e.g., { nonNasal: '', nasal: '', antihistamine: '', other: '' }
  entExamination: { type: String },
  date: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const AllergicRhinitis = mongoose.model('AllergicRhinitis', allergicRhinitisSchema);
export default AllergicRhinitis; 