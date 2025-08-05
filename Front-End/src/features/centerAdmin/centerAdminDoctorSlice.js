import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchCenterAdminDoctors = createAsyncThunk(
  'centerAdminDoctors/fetchCenterAdminDoctors',
  async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const response = await fetch(`/api/doctors?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch doctors');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch doctors');
    }
  }
);

export const fetchCenterAdminDoctorById = createAsyncThunk(
  'centerAdminDoctors/fetchCenterAdminDoctorById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/doctors/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch doctor');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch doctor');
    }
  }
);

export const addCenterAdminDoctor = createAsyncThunk(
  'centerAdminDoctors/addCenterAdminDoctor',
  async (doctorData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(doctorData)
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to add doctor');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add doctor');
    }
  }
);

export const updateCenterAdminDoctor = createAsyncThunk(
  'centerAdminDoctors/updateCenterAdminDoctor',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update doctor');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update doctor');
    }
  }
);

export const deleteCenterAdminDoctor = createAsyncThunk(
  'centerAdminDoctors/deleteCenterAdminDoctor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to delete doctor');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete doctor');
    }
  }
);

export const toggleCenterAdminDoctorStatus = createAsyncThunk(
  'centerAdminDoctors/toggleCenterAdminDoctorStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/doctors/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to toggle doctor status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle doctor status');
    }
  }
);

export const fetchCenterAdminDoctorStats = createAsyncThunk(
  'centerAdminDoctors/fetchCenterAdminDoctorStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/doctors/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch doctor stats');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch doctor stats');
    }
  }
);

const initialState = {
  doctors: [],
  currentDoctor: null,
  loading: false,
  error: null,
  success: false,
  message: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  },
  filters: {
    search: '',
    status: ''
  },
  stats: {
    total: 0,
    active: 0,
    inactive: 0
  }
};

const centerAdminDoctorSlice = createSlice({
  name: 'centerAdminDoctors',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = '';
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: ''
      };
      state.pagination.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch doctors
      .addCase(fetchCenterAdminDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterAdminDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchCenterAdminDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch doctor by ID
      .addCase(fetchCenterAdminDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterAdminDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchCenterAdminDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add doctor
      .addCase(addCenterAdminDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCenterAdminDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Doctor added successfully';
        state.doctors.unshift(action.payload);
      })
      .addCase(addCenterAdminDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update doctor
      .addCase(updateCenterAdminDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCenterAdminDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Doctor updated successfully';
        const index = state.doctors.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.currentDoctor && state.currentDoctor._id === action.payload._id) {
          state.currentDoctor = action.payload;
        }
      })
      .addCase(updateCenterAdminDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete doctor
      .addCase(deleteCenterAdminDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCenterAdminDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Doctor deleted successfully';
        state.doctors = state.doctors.filter(d => d._id !== action.payload);
        if (state.currentDoctor && state.currentDoctor._id === action.payload) {
          state.currentDoctor = null;
        }
      })
      .addCase(deleteCenterAdminDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Toggle status
      .addCase(toggleCenterAdminDoctorStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(toggleCenterAdminDoctorStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Doctor status updated successfully';
        const index = state.doctors.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.currentDoctor && state.currentDoctor._id === action.payload._id) {
          state.currentDoctor = action.payload;
        }
      })
      .addCase(toggleCenterAdminDoctorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch stats
      .addCase(fetchCenterAdminDoctorStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterAdminDoctorStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCenterAdminDoctorStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  clearSuccess,
  setFilters,
  clearFilters
} = centerAdminDoctorSlice.actions;

export default centerAdminDoctorSlice.reducer; 