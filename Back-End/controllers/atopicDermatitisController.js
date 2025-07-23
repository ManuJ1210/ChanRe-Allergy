import AtopicDermatitis from '../models/AtopicDermatitis.js';

export const createAtopicDermatitis = async (req, res) => {
  try {
    const { patientId, ...rest } = req.body;
    const updatedBy = req.user._id;
    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }
    const record = await AtopicDermatitis.create({ patientId, ...rest, updatedBy });
    res.status(201).json({ message: 'Atopic Dermatitis record added', data: record });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add record', error: err.message });
  }
};

export const getAtopicDermatitisByPatient = async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }
    const records = await AtopicDermatitis.find({ patientId })
      .populate('patientId', 'name age centerCode phone gender')
      .sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records', error: err.message });
  }
};

export const getAtopicDermatitisById = async (req, res) => {
  try {
    const record = await AtopicDermatitis.findById(req.params.id)
      .populate('patientId', 'name age centerCode phone gender');
    if (!record) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch record', error: err.message });
  }
}; 