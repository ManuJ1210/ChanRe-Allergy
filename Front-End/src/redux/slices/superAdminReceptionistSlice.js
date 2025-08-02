import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchSuperAdminReceptionists = createAsyncThunk(
  'superAdminReceptionists/fetchAll',
  async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(status && { status })
      });

      const response = await fetch(`/api/superadmin/receptionists?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch receptionists');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSuperAdminReceptionistById = createAsyncThunk(
  'superAdminReceptionists/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/receptionists/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch receptionist');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSuperAdminReceptionist = createAsyncThunk(
  'superAdminReceptionists/add',
  async (receptionistData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/superadmin/receptionists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(receptionistData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add receptionist');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSuperAdminReceptionist = createAsyncThunk(
  'superAdminReceptionists/update',
  async ({ id, receptionistData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/receptionists/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(receptionistData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update receptionist');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSuperAdminReceptionist = createAsyncThunk(
  'superAdminReceptionists/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/receptionists/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete receptionist');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleSuperAdminReceptionistStatus = createAsyncThunk(
  'superAdminReceptionists/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/receptionists/${id}/toggle-status`, {
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

export const fetchSuperAdminReceptionistStats = createAsyncThunk(
  'superAdminReceptionists/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/superadmin/receptionists/stats', {
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
  receptionists: [],
  currentReceptionist: null,
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
const superAdminReceptionistSlice = createSlice({
  name: 'superAdminReceptionists',
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
    clearCurrentReceptionist: (state) => {
      state.currentReceptionist = null;
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch all receptionists
      .addCase(fetchSuperAdminReceptionists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminReceptionists.fulfilled, (state, action) => {
        state.loading = false;
        state.receptionists = action.payload.receptionists;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: 10
        };
      })
      .addCase(fetchSuperAdminReceptionists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch receptionist by ID
      .addCase(fetchSuperAdminReceptionistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminReceptionistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReceptionist = action.payload;
      })
      .addCase(fetchSuperAdminReceptionistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add receptionist
      .addCase(addSuperAdminReceptionist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addSuperAdminReceptionist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.receptionists.unshift(action.payload.receptionist);
        state.pagination.total += 1;
      })
      .addCase(addSuperAdminReceptionist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update receptionist
      .addCase(updateSuperAdminReceptionist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSuperAdminReceptionist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        const index = state.receptionists.findIndex(rec => rec._id === action.payload.receptionist._id);
        if (index !== -1) {
          state.receptionists[index] = action.payload.receptionist;
        }
        if (state.currentReceptionist && state.currentReceptionist._id === action.payload.receptionist._id) {
          state.currentReceptionist = action.payload.receptionist;
        }
      })
      .addCase(updateSuperAdminReceptionist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete receptionist
      .addCase(deleteSuperAdminReceptionist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSuperAdminReceptionist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Receptionist deleted successfully';
        state.receptionists = state.receptionists.filter(rec => rec._id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentReceptionist && state.currentReceptionist._id === action.payload) {
          state.currentReceptionist = null;
        }
      })
      .addCase(deleteSuperAdminReceptionist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Toggle status
      .addCase(toggleSuperAdminReceptionistStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSuperAdminReceptionistStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        const index = state.receptionists.findIndex(rec => rec._id === action.payload.receptionist._id);
        if (index !== -1) {
          state.receptionists[index].status = action.payload.status;
        }
        if (state.currentReceptionist && state.currentReceptionist._id === action.payload.receptionist._id) {
          state.currentReceptionist.status = action.payload.status;
        }
      })
      .addCase(toggleSuperAdminReceptionistStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchSuperAdminReceptionistStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminReceptionistStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchSuperAdminReceptionistStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearSuccess, 
  setFilters, 
  clearCurrentReceptionist, 
  resetState 
} = superAdminReceptionistSlice.actions;

export default superAdminReceptionistSlice.reducer; 