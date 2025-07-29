import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';
import {
  setLoading,
  setError,
  setPatients,
  setStats,
  setFollowUps,
  setPrescriptions,
  setPrescription,
  setMedications,
  setHistory,
  setTests,
  setSinglePatient,
  setPatientLoading,
  setPatientError,
  setAddSuccess,
  setAddTestSuccess,
  setAddAllergicRhinitisSuccess,
  setAddAtopicDermatitisSuccess,
  setAddAllergicConjunctivitisSuccess,
  setAddAllergicBronchitisSuccess,
  setAddGPESuccess,
  setUpdateSuccess,
  setDeleteSuccess,
  addPatient,
  updatePatient,
  deletePatient,
  addFollowUp,
  addPrescription,
  addMedication,
  addTest,
  resetState,
  setAddHistorySuccess,
  setAddMedicationSuccess
} from './receptionistSlice';

// Fetch patients for receptionist
export const fetchReceptionistPatients = createAsyncThunk(
  'receptionist/fetchPatients',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await API.get('/patients/receptionist/mine');
      dispatch(setPatients(res.data));
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayPatients = res.data.filter(p => 
        new Date(p.createdAt).toDateString() === today
      ).length;
      
      // Fetch additional stats
      try {
        const statsResponse = await API.get('/dashboard/receptionist/stats');
        dispatch(setStats(statsResponse.data));
      } catch (error) {
        // Fallback to calculated stats
        dispatch(setStats({
          totalPatients: res.data.length,
          todayPatients,
          pendingTests: 0,
          completedTests: 0
        }));
      }
      
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch patients'));
      throw error;
    }
  }
);

// Add new patient
export const createReceptionistPatient = createAsyncThunk(
  'receptionist/createPatient',
  async (patientData, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await API.post('/patients', patientData);
      dispatch(addPatient(res.data));
      dispatch(setAddSuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add patient'));
      throw error;
    }
  }
);

// Update patient
export const updateReceptionistPatient = createAsyncThunk(
  'receptionist/updatePatient',
  async ({ id, patientData }, { dispatch }) => {
    try {
      dispatch(setPatientLoading(true));
      const res = await API.put(`/patients/${id}`, patientData);
      dispatch(updatePatient(res.data));
      dispatch(setUpdateSuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setPatientError(error.response?.data?.message || 'Failed to update patient'));
      throw error;
    }
  }
);

// Delete patient
export const deleteReceptionistPatient = createAsyncThunk(
  'receptionist/deletePatient',
  async (id, { dispatch }) => {
    try {
      await API.delete(`/patients/${id}`);
      dispatch(deletePatient(id));
      dispatch(setDeleteSuccess(true));
      return id;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to delete patient'));
      throw error;
    }
  }
);

// Fetch single patient
export const fetchReceptionistSinglePatient = createAsyncThunk(
  'receptionist/fetchSinglePatient',
  async (id, { dispatch }) => {
    try {
      dispatch(setPatientLoading(true));
      const res = await API.get(`/patients/${id}`);
      dispatch(setSinglePatient(res.data));
      return res.data;
    } catch (error) {
      dispatch(setPatientError(error.response?.data?.message || 'Failed to fetch patient'));
      throw error;
    }
  }
);

// Fetch patient history
export const fetchReceptionistPatientHistory = createAsyncThunk(
  'receptionist/fetchPatientHistory',
  async (id, { dispatch }) => {
    try {
      const res = await API.get(`/history/${id}`);
      dispatch(setHistory(res.data));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch patient history'));
      throw error;
    }
  }
);

// Add patient history
export const createReceptionistPatientHistory = createAsyncThunk(
  'receptionist/createPatientHistory',
  async (historyData, { dispatch }) => {
    try {
      const formData = new FormData();
      const formCopy = { ...historyData };
      const file = formCopy.reportFile;
      delete formCopy.reportFile;

      formData.append('formData', JSON.stringify(formCopy));
      if (file) formData.append('reportFile', file);

      const res = await API.post('/history/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(setAddHistorySuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add patient history'));
      throw error;
    }
  }
);

// Fetch patient tests
export const fetchReceptionistPatientTests = createAsyncThunk(
  'receptionist/fetchPatientTests',
  async (id, { dispatch }) => {
    try {
      const res = await API.get(`/patients/${id}/show-tests`);
      dispatch(setTests(res.data));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch patient tests'));
      throw error;
    }
  }
);

// Add patient tests
export const createReceptionistPatientTests = createAsyncThunk(
  'receptionist/createPatientTests',
  async ({ patientId, testData }, { dispatch }) => {
    try {
      const res = await API.post(`/patients/${patientId}/tests`, testData);
      dispatch(addTest(res.data));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add patient tests'));
      throw error;
    }
  }
);

// Add receptionist test
export const createReceptionistTest = createAsyncThunk(
  'receptionist/createTest',
  async (testData, { dispatch }) => {
    try {
      const res = await API.post('/tests', testData);
      dispatch(addTest(res.data));
      dispatch(setAddTestSuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add test'));
      throw error;
    }
  }
);

// Fetch follow-ups
export const fetchReceptionistFollowUps = createAsyncThunk(
  'receptionist/fetchFollowUps',
  async (patientId, { dispatch }) => {
    try {
      const res = await API.get(`/followups?patientId=${patientId}`);
      dispatch(setFollowUps(res.data));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch follow-ups'));
      throw error;
    }
  }
);

// Add follow-up
export const createReceptionistFollowUp = createAsyncThunk(
  'receptionist/createFollowUp',
  async (followUpData, { dispatch }) => {
    try {
      const res = await API.post('/followups', followUpData);
      dispatch(addFollowUp(res.data));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add follow-up'));
      throw error;
    }
  }
);

// Fetch prescriptions
export const fetchReceptionistPrescriptions = createAsyncThunk(
  'receptionist/fetchPrescriptions',
  async (patientId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/prescriptions?patientId=${patientId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch prescriptions');
    }
  }
);

// Add prescription
export const createReceptionistPrescription = createAsyncThunk(
  'receptionist/createPrescription',
  async (prescriptionData, { dispatch }) => {
    try {
      const res = await API.post('/prescriptions', prescriptionData);
      dispatch(addPrescription(res.data));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add prescription'));
      throw error;
    }
  }
);

// Fetch medications
export const fetchReceptionistMedications = createAsyncThunk(
  'receptionist/fetchMedications',
  async (patientId, { dispatch }) => {
    try {
      const res = await API.get(`/medications?patientId=${patientId}`);
      dispatch(setMedications(res.data));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch medications'));
      throw error;
    }
  }
);

// Add medication
export const createReceptionistMedication = createAsyncThunk(
  'receptionist/createMedication',
  async (medicationData, { dispatch }) => {
    try {
      const res = await API.post('/medications', medicationData);
      dispatch(addMedication(res.data));
      dispatch(setAddMedicationSuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add medication'));
      throw error;
    }
  }
);

// Specific follow-up type thunks
export const createAllergicRhinitis = createAsyncThunk(
  'receptionist/createAllergicRhinitis',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/allergic-rhinitis', data);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add allergic rhinitis'));
      throw error;
    }
  }
);

// Add receptionist allergic rhinitis
export const addReceptionistAllergicRhinitis = createAsyncThunk(
  'receptionist/addAllergicRhinitis',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/allergic-rhinitis', data);
      dispatch(setAddAllergicRhinitisSuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add allergic rhinitis'));
      throw error;
    }
  }
);

// Fetch receptionist allergic rhinitis
export const fetchReceptionistAllergicRhinitis = createAsyncThunk(
  'receptionist/fetchAllergicRhinitis',
  async (patientId, { dispatch }) => {
    try {
      const res = await API.get(`/allergic-rhinitis?patientId=${patientId}`);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch allergic rhinitis'));
      throw error;
    }
  }
);

export const createAllergicConjunctivitis = createAsyncThunk(
  'receptionist/createAllergicConjunctivitis',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/allergic-conjunctivitis', data);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add allergic conjunctivitis'));
      throw error;
    }
  }
);

// Add receptionist allergic conjunctivitis
export const addReceptionistAllergicConjunctivitis = createAsyncThunk(
  'receptionist/addAllergicConjunctivitis',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/allergic-conjunctivitis', data);
      dispatch(setAddAllergicConjunctivitisSuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add allergic conjunctivitis'));
      throw error;
    }
  }
);

// Fetch receptionist allergic conjunctivitis
export const fetchReceptionistAllergicConjunctivitis = createAsyncThunk(
  'receptionist/fetchAllergicConjunctivitis',
  async (patientId, { dispatch }) => {
    try {
      const res = await API.get(`/allergic-conjunctivitis?patientId=${patientId}`);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch allergic conjunctivitis'));
      throw error;
    }
  }
);

export const createAllergicBronchitis = createAsyncThunk(
  'receptionist/createAllergicBronchitis',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/allergic-bronchitis', data);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add allergic bronchitis'));
      throw error;
    }
  }
);

// Add receptionist allergic bronchitis
export const addReceptionistAllergicBronchitis = createAsyncThunk(
  'receptionist/addAllergicBronchitis',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/allergic-bronchitis', data);
      dispatch(setAddAllergicBronchitisSuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add allergic bronchitis'));
      throw error;
    }
  }
);

// Fetch receptionist allergic bronchitis
export const fetchReceptionistAllergicBronchitis = createAsyncThunk(
  'receptionist/fetchAllergicBronchitis',
  async (patientId, { dispatch }) => {
    try {
      const res = await API.get(`/allergic-bronchitis?patientId=${patientId}`);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch allergic bronchitis'));
      throw error;
    }
  }
);

export const createAtopicDermatitis = createAsyncThunk(
  'receptionist/createAtopicDermatitis',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/atopic-dermatitis', data);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add atopic dermatitis'));
      throw error;
    }
  }
);

// Add receptionist atopic dermatitis
export const addReceptionistAtopicDermatitis = createAsyncThunk(
  'receptionist/addAtopicDermatitis',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/atopic-dermatitis', data);
      dispatch(setAddAtopicDermatitisSuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add atopic dermatitis'));
      throw error;
    }
  }
);

// Fetch receptionist atopic dermatitis
export const fetchReceptionistAtopicDermatitis = createAsyncThunk(
  'receptionist/fetchAtopicDermatitis',
  async (patientId, { dispatch }) => {
    try {
      const res = await API.get(`/atopic-dermatitis?patientId=${patientId}`);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch atopic dermatitis'));
      throw error;
    }
  }
);

export const createGPE = createAsyncThunk(
  'receptionist/createGPE',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/gpe', data);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add GPE'));
      throw error;
    }
  }
);

// Add receptionist GPE
export const addReceptionistGPE = createAsyncThunk(
  'receptionist/addGPE',
  async (data, { dispatch }) => {
    try {
      const res = await API.post('/gpe', data);
      dispatch(setAddGPESuccess(true));
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to add GPE'));
      throw error;
    }
  }
);

// Fetch receptionist GPE
export const fetchReceptionistGPE = createAsyncThunk(
  'receptionist/fetchGPE',
  async (patientId, { dispatch }) => {
    try {
      const res = await API.get(`/gpe?patientId=${patientId}`);
      return res.data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch GPE'));
      throw error;
    }
  }
); 

// Fetch single prescription
export const fetchReceptionistPrescription = createAsyncThunk(
  'receptionist/fetchPrescription',
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/prescriptions/${prescriptionId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch prescription');
    }
  }
);

// Delete prescription
export const deleteReceptionistPrescription = createAsyncThunk(
  'receptionist/deletePrescription',
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/prescriptions/${prescriptionId}`);
      return prescriptionId; // Return the ID so we can remove it from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete prescription');
    }
  }
);

// Reset receptionist state
export const resetReceptionistState = createAsyncThunk(
  'receptionist/resetState',
  async (_, { dispatch }) => {
    dispatch(resetState());
  }
); 