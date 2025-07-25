import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  CBC: { type: String },
  Hb: { type: String },
  TC: { type: String },
  DC: { type: String },
  Neutrophils: { type: String },
  Eosinophil: { type: String },
  Lymphocytes: { type: String },
  Monocytes: { type: String },
  Platelets: { type: String },
  ESR: { type: String },
  SerumCreatinine: { type: String },
  SerumIgELevels: { type: String },
  C3C4Levels: { type: String },
  ANA_IF: { type: String },
  UrineRoutine: { type: String },
  AllergyPanel: { type: String },
  date: { type: Date, default: Date.now }
});


const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
  },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  centerCode: { type: String },
  tests: [testSchema]
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
