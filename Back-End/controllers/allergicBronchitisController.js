import AllergicBronchitis from '../models/AllergicBronchitis.js';

export const createAllergicBronchitis = async (req, res) => {
  try {
    const { patientId, symptoms, type, ginaGrading, pftGrading, habits } = req.body;
    const updatedBy = req.user._id;
    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }
    const record = await AllergicBronchitis.create({ patientId, symptoms, type, ginaGrading, pftGrading, habits, updatedBy });
    res.status(201).json({ message: 'Allergic Bronchitis record added', data: record });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add record', error: err.message });
  }
};

export const getAllergicBronchitisByPatient = async (req, res) => {
  try {
    const { patientId } = req.query;
    let records;
    if (patientId) {
      records = await AllergicBronchitis.find({ patientId })
        .populate('patientId', 'name age centerCode phone gender')
        .sort({ createdAt: -1 });
    } else {
      records = await AllergicBronchitis.find()
        .populate('patientId', 'name age centerCode phone gender')
        .sort({ createdAt: -1 });
    }
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records', error: err.message });
  }
};

export const getAllergicBronchitisById = async (req, res) => {
  try {
    const record = await AllergicBronchitis.findById(req.params.id)
      .populate('patientId', 'name age centerCode phone gender');
    if (!record) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch record', error: err.message });
  }
}; 