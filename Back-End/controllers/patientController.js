import Patient from '../models/patient.js';

// ✅ Create Patient
export const addPatient = async (req, res) => {
  try {
    const {
      name,
      gender,
      age,
      contact,
      email,
      address,
      referringPhysician
    } = req.body;

    const centerId = req.user.centerId;

    if (!centerId) {
      return res.status(400).json({ message: "Center ID is missing from user." });
    }

    const newPatient = new Patient({
      name,
      gender,
      age,
      contact,
      email,
      address,
      referringPhysician,
      centerId,
    });

    const savedPatient = await newPatient.save();
    res.status(201).json({ message: "Patient created successfully", patient: savedPatient });
  } catch (error) {
    console.error("Create patient error:", error);
    res.status(500).json({ message: "Failed to create patient" });
  }
};

// ✅ Get All Patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ centerId: req.user.centerId }).populate('centerId', 'name');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patients', error: err.message });
  }
};

// ✅ Get Single Patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error("Get patient by ID error:", error);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

// ✅ Update Patient (Edit)
export const updatePatient = async (req, res) => {
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
        contact,
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
export const deletePatient = async (req, res) => {
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
