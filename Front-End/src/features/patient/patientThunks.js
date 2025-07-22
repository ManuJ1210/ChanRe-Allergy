// src/features/patient/patientThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ADD PATIENT
export const createPatient = createAsyncThunk(
  'patient/createPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/patients',
        patientData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add patient');
    }
  }
);

// SUBMIT TESTS
export const submitPatientTests = createAsyncThunk(
  'patient/submitPatientTests',
  async ({ patientId, testData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/patients/${patientId}/tests`,
        testData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Test submission failed');
    }
  }
);

// GET SINGLE PATIENT
export const getSinglePatient = createAsyncThunk(
  "patient/getSinglePatient",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch patient");
    }
  }
);

// UPDATE (EDIT) PATIENT
export const updatePatient = createAsyncThunk(
  "patient/updatePatient",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:5000/api/patients/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update patient");
    }
  }
);

// ✅ ALIAS for compatibility with older imports
export const editPatient = updatePatient;

// FETCH ALL PATIENTS
export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      return Array.isArray(data) ? data : data.patients || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

// OPTIONAL ALIAS
export const getPatients = fetchPatients;

// DELETE PATIENT
export const deletePatient = createAsyncThunk(
  'patient/deletePatient',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// FETCH PATIENT + TESTS FOR SHOW-TESTS PAGE
export const fetchPatientAndTests = createAsyncThunk(
  'patient/fetchPatientAndTests',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/patients/${id}/show-tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        patient: response.data.patient || null,
        tests: response.data.tests || [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load patient tests');
    }
  }
);

// ✅ Aliases for legacy component imports (AddTest.jsx & ShowTests.jsx)
export const submitTestReport = submitPatientTests;
export const fetchPatientTests = fetchPatientAndTests;
