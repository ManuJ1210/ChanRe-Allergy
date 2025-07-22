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
  date: { type: Date, default: Date.now },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  }
});

const Test = mongoose.model('Test', testSchema);
export default Test; 