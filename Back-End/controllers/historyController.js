import History from '../models/historyModel.js';

export const createHistory = async (req, res) => {
  try {
    console.log("Request body:", req.body.formData);
    console.log("Uploaded file:", req.file);

    // Parse JSON string
    const parsedData = JSON.parse(req.body.formData);
    const fileName = req.file ? req.file.filename : null;

    // Use patientId from formData if provided, else fallback to req.user._id
    const patientId = parsedData.patientId || parsedData.patient || req.user._id;

    // Check if this is a simple medical history form or complex allergy form
    if (parsedData.medicalHistory || parsedData.familyHistory || parsedData.socialHistory) {
      // Simple medical history format
      const history = await History.create({
        patientId,
        sectionSix: {
          FamilyHistory: parsedData.familyHistory || '',
          reportFile: fileName,
          // Add other simple fields to sectionSix
          medicalHistory: parsedData.medicalHistory || '',
          socialHistory: parsedData.socialHistory || '',
          allergies: parsedData.allergies || '',
          currentMedications: parsedData.currentMedications || '',
        }
      });

      res.status(201).json({
        message: 'Medical history saved successfully',
        data: history,
      });
    } else {
      // Complex allergy history format
      // Validate required fields
      if (
        !parsedData.sectionOne ||
        !parsedData.sectionOne.conditions ||
        !Object.values(parsedData.sectionOne.conditions).some(Boolean)
      ) {
        return res.status(400).json({ message: "Please select at least one condition in Section One" });
      }

      const history = await History.create({
        patientId,
        sectionOne: parsedData.sectionOne,
        sectionTwo: parsedData.sectionTwo || {},
        sectionThree: parsedData.sectionThree || {},
        sectionFour: parsedData.sectionFour || {},
        sectionFive: parsedData.sectionFive || {},
        sectionSix: {
          ...parsedData.sectionSix,
          reportFile: fileName,
        },
      });

      res.status(201).json({
        message: 'History saved successfully',
        data: history,
      });
    }
  } catch (err) {
    console.error('Error saving history:', err.message);
    res.status(500).json({ message: 'Failed to save history', error: err.message });
  }
};

// Fetch all history records for a patient
export const getHistoryByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log('Fetching history for patientId:', patientId);
    const histories = await History.find({ patientId }).sort({ createdAt: -1 });
    console.log('Found histories:', histories.length);
    res.status(200).json(histories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};
