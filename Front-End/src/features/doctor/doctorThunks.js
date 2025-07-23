// src/features/doctor/doctorThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Create a doctor
export const createDoctor = createAsyncThunk(
  'doctor/createDoctor',
  async (doctorData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/doctors',
        doctorData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add doctor'
      );
    }
  }
);

// ✅ Update a doctor
export const updateDoctor = createAsyncThunk(
  'doctor/updateDoctor',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/doctors/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update doctor'
      );
    }
  }
);
export const fetchDoctorById = createAsyncThunk(
  'doctor/fetchDoctorById',
  async (doctorId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/doctors/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor');
    }
  }
);

// Fetch all doctors
export const fetchAllDoctors = createAsyncThunk(
  'doctor/fetchAllDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);