import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming patients are stored in User model
    required: true,
  },

  // Section One: General Info
  patientName: String,
  age: String,
  sex: String,
  referredBy: String,
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
  },

  // Section Two: Chief complaints
  complaints: [String],

  // Section Three: History Duration
  onset: String,
  duration: String,
  frequency: String,

  // Section Four: Skin Allergy and Medical History
  skinAllergy: {
    hives: Boolean,
    hivesDistribution: String,
    eczema: Boolean,
    eczemaDistribution: String,
    ulcer: Boolean,
    ulcerDistribution: String,
    papuloRashes: Boolean,
    papuloRashesDistribution: String,
    itching: Boolean,
    itchingDistribution: String,
  },
  medicalHistory: {
    hypertension: Boolean,
    diabetes: Boolean,
    epilepsy: Boolean,
    ihd: Boolean,
  },

  // Section Five: Drug & Exposure
  drugs: {
    drugAllergyKnown: String,
    probable: String,
    definite: String,
  },
  exposure: {
    occupation: String,
    probableChemicalExposure: String,
    location: String,
    familyHistory: String,
  },

  // Section Six: Examination + Report
  examination: {
    oralCavity: String,
    skin: String,
    ent: String,
    eye: String,
    respiratorySystem: String,
    cvs: String,
    cns: String,
    abdomen: String,
    otherFindings: String,
  },

  reportFile: {
    type: String, // store filename or file path
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('History', historySchema);
