import Prescription from '../models/Prescription.js';

export const createPrescription = async (req, res) => {
  try {
    console.log('Prescription create request body:', req.body);
    const { patientId, visit, date, medications } = req.body;
    const updatedBy = req.user._id;
    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }
    const record = await Prescription.create({ patientId, visit, date, medications, updatedBy });
    res.status(201).json({ message: 'Prescription added', data: record });
  } catch (err) {
    console.error('Failed to add prescription:', err);
    res.status(500).json({ message: 'Failed to add prescription', error: err.message });
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.query;
    let records;
    if (patientId) {
      records = await Prescription.find({ patientId })
        .populate('patientId', 'name age centerCode phone')
        .populate('updatedBy', 'name')
        .sort({ createdAt: -1 });
    } else {
      records = await Prescription.find()
        .populate('patientId', 'name age centerCode phone')
        .populate('updatedBy', 'name')
        .sort({ createdAt: -1 });
    }
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch prescriptions', error: err.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const record = await Prescription.findById(req.params.id)
      .populate('patientId', 'name age centerCode phone')
      .populate('updatedBy', 'name');
    if (!record) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch prescription', error: err.message });
  }
}; 