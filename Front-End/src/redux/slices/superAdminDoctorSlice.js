import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchSuperAdminDoctors = createAsyncThunk(
  'superAdminDoctors/fetchAll',
  async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(status && { status })
      });

      const response = await fetch(`/api/superadmin/doctors?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch doctors');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSuperAdminDoctorById = createAsyncThunk(
  'superAdminDoctors/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/doctors/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch doctor');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSuperAdminDoctor = createAsyncThunk(
  'superAdminDoctors/add',
  async (doctorData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/superadmin/doctors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctorData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add doctor');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSuperAdminDoctor = createAsyncThunk(
  'superAdminDoctors/update',
  async ({ id, doctorData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctorData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update doctor');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSuperAdminDoctor = createAsyncThunk(
  'superAdminDoctors/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete doctor');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleSuperAdminDoctorStatus = createAsyncThunk(
  'superAdminDoctors/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/doctors/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle status');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSuperAdminDoctorStats = createAsyncThunk(
  'superAdminDoctors/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/superadmin/doctors/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch stats');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  doctors: [],
  currentDoctor: null,
  stats: {
    total: 0,
    active: 0,
    inactive: 0
  },
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
  loading: false,
  error: null,
  success: false,
  message: ''
};

// Slice
const superAdminDoctorSlice = createSlice({
  name: 'superAdminDoctors',
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
    },
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null;
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch all doctors
      .addCase(fetchSuperAdminDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: 10
        };
      })
      .addCase(fetchSuperAdminDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch doctor by ID
      .addCase(fetchSuperAdminDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchSuperAdminDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add doctor
      .addCase(addSuperAdminDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addSuperAdminDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        if (action.payload.doctor) {
          state.doctors.unshift(action.payload.doctor);
          state.pagination.total += 1;
        }
      })
      .addCase(addSuperAdminDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update doctor
      .addCase(updateSuperAdminDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSuperAdminDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        if (action.payload.doctor && action.payload.doctor._id) {
          const index = state.doctors.findIndex(doc => doc._id === action.payload.doctor._id);
          if (index !== -1) {
            state.doctors[index] = action.payload.doctor;
          }
          if (state.currentDoctor && state.currentDoctor._id === action.payload.doctor._id) {
            state.currentDoctor = action.payload.doctor;
          }
        }
      })
      .addCase(updateSuperAdminDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete doctor
      .addCase(deleteSuperAdminDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSuperAdminDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Doctor deleted successfully';
        state.doctors = state.doctors.filter(doc => doc._id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentDoctor && state.currentDoctor._id === action.payload) {
          state.currentDoctor = null;
        }
      })
      .addCase(deleteSuperAdminDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Toggle status
      .addCase(toggleSuperAdminDoctorStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSuperAdminDoctorStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        if (action.payload.doctor && action.payload.doctor._id) {
          const index = state.doctors.findIndex(doc => doc._id === action.payload.doctor._id);
          if (index !== -1) {
            state.doctors[index].status = action.payload.status;
          }
          if (state.currentDoctor && state.currentDoctor._id === action.payload.doctor._id) {
            state.currentDoctor.status = action.payload.status;
          }
        }
      })
      .addCase(toggleSuperAdminDoctorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchSuperAdminDoctorStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminDoctorStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchSuperAdminDoctorStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearSuccess, 
  setFilters, 
  clearCurrentDoctor, 
  resetState 
} = superAdminDoctorSlice.actions;

export default superAdminDoctorSlice.reducer; 