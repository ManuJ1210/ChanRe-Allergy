// src/features/center/centerThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Create center with admin
export const createCenterWithAdmin = createAsyncThunk(
  'center/createCenterWithAdmin',
  async ({ center, admin }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/centers/create-with-admin",
        { center, admin },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// Fetch all centers
export const fetchCenters = createAsyncThunk(
  'center/fetchCenters',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/centers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch centers");
    }
  }
);

// Delete a center
export const deleteCenter = createAsyncThunk(
  'center/deleteCenter',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/centers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id; // return deleted ID so we can remove it from Redux state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete center");
    }
  }
);

// Get a specific center by ID
export const getCenterById = createAsyncThunk(
  'center/getCenterById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/centers/withadmin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch center");
    }
  }
);

// Update a center
export const updateCenter = createAsyncThunk(
  'center/updateCenter',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/centers/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);
