import Patient from '../models/Patient.js';
import Test from '../models/Test.js'; // Make sure this import is correct

// ✅ Add New Patient
const addPatient = async (req, res) => {
  try {
    const {
      name,
      gender,
      age,
      contact,
      email,
      address,
      assignedDoctor,
      centerCode
    } = req.body;

    const centerId = req.user.centerId;
    if (!centerId) {
      return res.status(400).json({ message: "Center ID is missing from user." });
    }

    const newPatient = new Patient({
      name,
      gender,
      age,
      phone: contact,
      email,
      address,
      centerId,
      assignedDoctor,
      centerCode,
    });

    const savedPatient = await newPatient.save();
    res.status(201).json({ message: "Patient created successfully", patient: savedPatient });
  } catch (error) {
    console.error("Create patient error:", error);
    res.status(500).json({ message: "Failed to create patient" });
  }
};

// ✅ Get All Patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ centerId: req.user.centerId })
      .populate('centerId', 'name code')
      .populate('assignedDoctor', 'name'); // populate doctor name
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patients', error: err.message });
  }
};

// ✅ Get Single Patient by ID
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id).populate('assignedDoctor', 'name');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error("Get patient by ID error:", error);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

// ✅ Update Patient
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      gender,
      age,
      contact,
      email,
      address,
      referringPhysician
    } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      {
        name,
        gender,
        age,
        phone: contact,
        email,
        address,
        referringPhysician
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient updated successfully", patient: updatedPatient });
  } catch (error) {
    console.error("Update patient error:", error);
    res.status(500).json({ message: "Failed to update patient" });
  }
};

// ✅ Delete Patient
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Delete patient error:", error);
    res.status(500).json({ message: "Failed to delete patient" });
  }
};

// ✅ Add Test to Patient
const addTestToPatient = async (req, res) => {
  try {
    const { id } = req.params;
    // Map frontend keys to schema keys (as before)
    const fieldMap = {
      "CBC": "CBC",
      "Hb": "Hb",
      "TC": "TC",
      "DC": "DC",
      "Neutrophils": "Neutrophils",
      "Eosinophil": "Eosinophil",
      "Lymphocytes": "Lymphocytes",
      "Monocytes": "Monocytes",
      "Platelets": "Platelets",
      "ESR": "ESR",
      "Serum Creatinine": "SerumCreatinine",
      "Serum IgE Levels": "SerumIgELevels",
      "C3, C4 Levels": "C3C4Levels",
      "ANA (IF)": "ANA_IF",
      "Urine Routine": "UrineRoutine",
      "Allergy Panel": "AllergyPanel"
    };
    const testData = {};
    for (const [frontendKey, value] of Object.entries(req.body)) {
      if (fieldMap[frontendKey]) {
        testData[fieldMap[frontendKey]] = value;
      }
    }
    testData.date = new Date();
    testData.patient = id; // Add patient reference

    // Save to Test collection
    const newTest = await Test.create(testData);

    // Optionally, also push to embedded array
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    patient.tests.push(testData);
    await patient.save();

    res.status(200).json({ message: 'Test added successfully', test: newTest });
  } catch (error) {
    console.error('Add test error:', error);
    res.status(500).json({ message: 'Failed to add test' });
  }
};

// ✅ Get Tests by Patient
const getTestsByPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ tests: patient.tests });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ message: 'Failed to fetch tests' });
  }
};

export const getPatientAndTests = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Fetch tests from Test collection
    const tests = await Test.find({ patient: patient._id });

    res.json({ patient, tests });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patient tests", error: err.message });
  }
};

// ✅ Named exports (required for ESM import)
export {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addTestToPatient,
  getTestsByPatient
};
