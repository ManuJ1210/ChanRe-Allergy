import GPE from '../models/GPE.js';

export const createGPE = async (req, res) => {
  try {
    const { patientId, weight, pulse, bp, rr, temp, spo2, entExamination, cns, cvs, rs, pa, drugAdverseNotion, drugCompliance, followUpAdvice, eyeMedication } = req.body;
    const updatedBy = req.user._id;
    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }
    const record = await GPE.create({ patientId, weight, pulse, bp, rr, temp, spo2, entExamination, cns, cvs, rs, pa, drugAdverseNotion, drugCompliance, followUpAdvice, eyeMedication, updatedBy });
    res.status(201).json({ message: 'GPE record added', data: record });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add record', error: err.message });
  }
};

export const getGPEByPatient = async (req, res) => {
  try {
    const { patientId } = req.query;
    let records;
    if (patientId) {
      records = await GPE.find({ patientId })
        .populate('patientId', 'name age centerCode phone gender')
        .sort({ createdAt: -1 });
    } else {
      records = await GPE.find()
        .populate('patientId', 'name age centerCode phone gender')
        .sort({ createdAt: -1 });
    }
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records', error: err.message });
  }
};

export const getGPEById = async (req, res) => {
  try {
    const record = await GPE.findById(req.params.id)
      .populate('patientId', 'name age centerCode phone gender');
    if (!record) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch record', error: err.message });
  }
}; 