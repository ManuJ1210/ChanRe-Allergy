import FollowUp from '../models/FollowUp.js';
import Patient from '../models/Patient.js';

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

// Superadmin: Get all patients with their follow-up types (conditions)
export const getAllPatientsWithFollowUps = async (req, res) => {
  try {
    // Get all patients
    const patients = await Patient.find().select('name centerCode createdAt centerId').populate('centerId', 'name');
    // Get all followups
    const followups = await FollowUp.find().select('patientId type');
    // Map patientId to set of follow-up types
    const patientFollowupMap = {};
    followups.forEach(fu => {
      const pid = fu.patientId.toString();
      if (!patientFollowupMap[pid]) patientFollowupMap[pid] = new Set();
      patientFollowupMap[pid].add(fu.type);
    });
    // Build result
    const result = patients.map(p => ({
      _id: p._id,
      name: p.name,
      centerCode: p.centerCode,
      centerName: p.centerId?.name || '',
      createdAt: p.createdAt,
      conditions: Array.from(patientFollowupMap[p._id.toString()] || [])
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patients with follow ups', error: err.message });
  }
}; 