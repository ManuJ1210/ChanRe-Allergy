import AllergicRhinitis from '../models/AllergicRhinitis.js';

export const createAllergicRhinitis = async (req, res) => {
  try {
    const { patientId, nasalSymptoms, nonNasalSymptoms, qualityOfLife, medications, entExamination } = req.body;
    const updatedBy = req.user._id;
    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }
    // 1. Create AllergicRhinitis record
    const record = await AllergicRhinitis.create({
      patientId,
      nasalSymptoms,
      nonNasalSymptoms,
      qualityOfLife,
      medications,
      entExamination,
      updatedBy
    });
    // 2. Create FollowUp record linked to this Allergic Rhinitis
    const followUp = await (await import('../models/FollowUp.js')).default.create({
      patientId,
      type: 'Allergic Rhinitis',
      allergicRhinitisId: record._id,
      updatedBy
    });
    // 3. Return both records
    res.status(201).json({ message: 'Allergic Rhinitis record and follow-up added', allergicRhinitis: record, followUp });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add record', error: err.message });
  }
};

export const getAllergicRhinitisById = async (req, res) => {
  try {
    console.log('Fetching AllergicRhinitis with ID:', req.params.id);
    const record = await AllergicRhinitis.findById(req.params.id)
      .populate('patientId', 'name age centerCode phone gender');
    if (!record) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch record', error: err.message });
  }
};

export const getAllergicRhinitisByPatient = async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }
    const records = await AllergicRhinitis.find({ patientId })
      .populate('patientId', 'name age centerCode phone gender')
      .populate('updatedBy', 'name')
      .sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records', error: err.message });
  }
}; 