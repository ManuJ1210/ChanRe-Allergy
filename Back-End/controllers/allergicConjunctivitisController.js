import AllergicConjunctivitis from '../models/AllergicConjunctivitis.js';

export const createAllergicConjunctivitis = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { patientId, symptoms, type, grading } = req.body;
    const updatedBy = req.user._id;
    
    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }

    // Validate required fields
    if (!symptoms || !type || !grading) {
      return res.status(400).json({ 
        message: 'Missing required fields: symptoms, type, and grading are required' 
      });
    }

    const record = await AllergicConjunctivitis.create({ 
      patientId, 
      symptoms, 
      type, 
      grading, 
      updatedBy 
    });
    
    console.log('Created record:', record);
    res.status(201).json({ message: 'Allergic Conjunctivitis record added', data: record });
  } catch (err) {
    console.error('Error creating allergic conjunctivitis record:', err);
    res.status(500).json({ message: 'Failed to add record', error: err.message });
  }
};

export const getAllergicConjunctivitisByPatient = async (req, res) => {
  try {
    const { patientId } = req.query;
    console.log('getAllergicConjunctivitisByPatient called with patientId:', patientId);
    
    let records;
    if (patientId && patientId !== 'undefined') {
      records = await AllergicConjunctivitis.find({ patientId })
        .populate('patientId', 'name age centerCode phone gender')
        .sort({ createdAt: -1 });
      console.log(`Found ${records.length} records for patientId: ${patientId}`);
    } else {
      console.log('No valid patientId provided, returning empty array');
      records = [];
    }
    
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching allergic conjunctivitis records:', err);
    res.status(500).json({ message: 'Failed to fetch records', error: err.message });
  }
};

export const getAllergicConjunctivitisById = async (req, res) => {
  try {
    const record = await AllergicConjunctivitis.findById(req.params.id)
      .populate('patientId', 'name age centerCode phone gender');
    if (!record) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(record);
  } catch (err) {
    console.error('Error fetching allergic conjunctivitis record by ID:', err);
    res.status(500).json({ message: 'Failed to fetch record', error: err.message });
  }
}; 