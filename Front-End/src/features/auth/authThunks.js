import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);
