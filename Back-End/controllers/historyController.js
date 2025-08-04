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

    // Create history record with all form data as direct fields
    const history = await History.create({
      patientId,
      ...parsedData, // Spread all the form fields directly
      reportFile: fileName,
    });

    res.status(201).json({
      message: 'Medical history saved successfully',
      data: history,
    });
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
    
    // Validate patientId
    if (!patientId) {
      console.log('No patientId provided');
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    // Check if patient exists first
    const Patient = (await import('../models/Patient.js')).default;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      console.log('Patient not found with ID:', patientId);
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Try to find histories with both string and ObjectId formats
    let histories = await History.find({ patientId }).sort({ createdAt: -1 });
    
    // If no results with string, try with ObjectId
    if (histories.length === 0) {
      console.log('No histories found with string patientId, trying ObjectId...');
      const mongoose = (await import('mongoose')).default;
      histories = await History.find({ 
        patientId: new mongoose.Types.ObjectId(patientId) 
      }).sort({ createdAt: -1 });
    }
    
    console.log('Found histories:', histories.length);
    console.log('History records:', histories.map(h => ({ 
      id: h._id, 
      patientId: h.patientId, 
      patientIdType: typeof h.patientId,
      createdAt: h.createdAt 
    })));
    
    res.status(200).json(histories);
  } catch (err) {
    console.error('Error fetching history:', err.message);
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};
