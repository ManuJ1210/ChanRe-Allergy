import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  sectionOne: {
    conditions: { type: Map, of: String } // e.g., { "Asthma": "yes", ... }
  },

  sectionTwo: {
    feverGrade: String,
    itchingThroat: String,
    specificDay: String,
    asthmaType: String,
    asthmaFrequency: String,
  },

  sectionThree: {
    questions: { type: Map, of: String }, // e.g., { "Admission to hospital": "yes" }
    triggers: [String],
    otherTrigger: String,
  },

  sectionFour: {
    rhinitisType: String,
    symptoms: { type: Map, of: String } // e.g., { Sneezing: "Mild", ... }
  },

  sectionFive: {
    allergyType: String,
    skinAllergy: {
      type: Map,
      of: new mongoose.Schema({
        answer: String, // "Yes" or "No"
        distribution: String
      }, { _id: false })
    },
    history: { type: Map, of: String } // e.g., { Hypertension: "Yes" }
  },

  sectionSix: {
    DrugAllergyKnown: String,
    Probable: String,
    Definite: String,

    Occupation: String,
    ProbableChemicalExposure: String,
    Location: String,
    FamilyHistory: String,

    OralCavity: String,
    Skin: String,
    ENT: String,
    Eye: String,
    RespiratorySystem: String,
    CVS: String,
    CNS: String,
    Abdomen: String,
    AnyOtherFindings: String,

    reportFile: String, // path or filename of uploaded report
  }
}, { timestamps: true });

const History = mongoose.model("History", historySchema);
export default History;
