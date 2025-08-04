import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },

  // Medical Conditions
  hayFever: String,
  asthma: String,
  breathingProblems: String,
  hivesSwelling: String,
  sinusTrouble: String,
  eczemaRashes: String,
  foodAllergies: String,
  arthriticDiseases: String,
  immuneDefect: String,
  drugAllergy: String,
  beeStingHypersensitivity: String,
  
  // Hay Fever Details
  feverGrade: String,
  itchingSoreThroat: String,
  specificDayExposure: String,
  
  // Asthma Details
  asthmaType: String,
  exacerbationsFrequency: String,
  
  // Medical Events
  hospitalAdmission: String,
  gpAttendances: String,
  aeAttendances: String,
  ituAdmissions: String,
  coughWheezeFrequency: String,
  intervalSymptoms: String,
  nightCoughFrequency: String,
  earlyMorningCough: String,
  exerciseInducedSymptoms: String,
  familySmoking: String,
  petsAtHome: String,
  
  // Triggers
  triggersUrtis: Boolean,
  triggersColdWeather: Boolean,
  triggersPollen: Boolean,
  triggersSmoke: Boolean,
  triggersExercise: Boolean,
  triggersPets: Boolean,
  triggersOthers: String,
  
  // Allergic Rhinitis
  allergicRhinitisType: String,
  rhinitisSneezing: String,
  rhinitisNasalCongestion: String,
  rhinitisRunningNose: String,
  rhinitisItchingNose: String,
  rhinitisItchingEyes: String,
  rhinitisCoughing: String,
  rhinitisWheezing: String,
  rhinitisCoughingWheezing: String,
  rhinitisWithExercise: String,
  rhinitisHeadaches: String,
  rhinitisPostNasalDrip: String,
  
  // Skin Allergy
  skinAllergyType: String,
  skinHeavesPresent: String,
  skinHeavesDistribution: String,
  skinEczemaPresent: String,
  skinEczemaDistribution: String,
  skinUlcerPresent: String,
  skinUlcerDistribution: String,
  skinPapuloSquamousRashesPresent: String,
  skinPapuloSquamousRashesDistribution: String,
  skinItchingNoRashesPresent: String,
  skinItchingNoRashesDistribution: String,
  
  // Medical History
  hypertension: String,
  diabetes: String,
  epilepsy: String,
  ihd: String,
  
  // New Drugs
  drugAllergyKnown: String,
  probable: String,
  definite: String,
  
  // Occupation and Exposure
  occupation: String,
  probableChemicalExposure: String,
  location: String,
  familyHistory: String,
  
  // Examination
  oralCavity: String,
  skin: String,
  ent: String,
  eye: String,
  respiratorySystem: String,
  cvs: String,
  cns: String,
  abdomen: String,
  otherFindings: String,
  
  // Report File
  reportFile: String

}, { timestamps: true });

const History = mongoose.model("History", historySchema);
export default History;
