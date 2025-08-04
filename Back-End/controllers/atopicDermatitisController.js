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
    console.log('getAtopicDermatitisByPatient called with patientId:', patientId);
    
    let records;
    if (patientId && patientId !== 'undefined') {
      records = await AtopicDermatitis.find({ patientId })
        .populate('patientId', 'name age centerCode phone gender')
        .sort({ createdAt: -1 });
      console.log(`Found ${records.length} records for patientId: ${patientId}`);
    } else {
      console.log('No valid patientId provided, returning empty array');
      records = [];
    }
    
    res.status(200).json(records);
  } catch (err) {
    console.error('Error in getAtopicDermatitisByPatient:', err);
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