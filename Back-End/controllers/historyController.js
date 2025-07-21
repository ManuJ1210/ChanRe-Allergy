import History from '../models/historyModel.js';

export const createHistory = async (req, res) => {
  try {
    console.log("Request body:", req.body.formData);
    console.log("Uploaded file:", req.file);

    // Parse JSON string
    const parsedData = JSON.parse(req.body.formData);
    const fileName = req.file ? req.file.filename : null;

    // Validate required fields
    if (
      !parsedData.sectionOne ||
      !parsedData.sectionOne.conditions ||
      !Object.values(parsedData.sectionOne.conditions).some(Boolean)
    ) {
      return res.status(400).json({ message: "Please select at least one condition in Section One" });
    }

    const history = await History.create({
      patientId: req.user._id,
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
  } catch (err) {
    console.error('Error saving history:', err.message);
    res.status(500).json({ message: 'Failed to save history', error: err.message });
  }
};
