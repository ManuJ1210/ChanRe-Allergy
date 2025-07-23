import FollowUp from '../models/FollowUp.js';

export const createFollowUp = async (req, res) => {
  try {
    const { patientId, type, notes } = req.body;
    const updatedBy = req.user._id;
    if (!patientId || !type) {
      return res.status(400).json({ message: 'patientId and type are required' });
    }
    const followUp = await FollowUp.create({ patientId, type, notes, updatedBy });
    res.status(201).json({ message: 'Follow up added', data: followUp });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add follow up', error: err.message });
  }
};

export const getFollowUpsByPatient = async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }
    const followUps = await FollowUp.find({ patientId })
      .populate('updatedBy', 'name')
      .populate('patientId', 'name age centerCode phone') // use phone, not contact
      .sort({ date: -1 });
    res.status(200).json(followUps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch follow ups', error: err.message });
  }
}; 