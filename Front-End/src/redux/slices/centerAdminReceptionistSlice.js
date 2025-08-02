import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchCenterAdminReceptionists = createAsyncThunk(
  'centerAdminReceptionists/fetchCenterAdminReceptionists',
  async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const response = await fetch(`/api/receptionists?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch receptionists');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch receptionists');
    }
  }
);

export const fetchCenterAdminReceptionistById = createAsyncThunk(
  'centerAdminReceptionists/fetchCenterAdminReceptionistById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/receptionists/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch receptionist');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch receptionist');
    }
  }
);

export const addCenterAdminReceptionist = createAsyncThunk(
  'centerAdminReceptionists/addCenterAdminReceptionist',
  async (receptionistData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/receptionists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(receptionistData)
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to add receptionist');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add receptionist');
    }
  }
);

export const updateCenterAdminReceptionist = createAsyncThunk(
  'centerAdminReceptionists/updateCenterAdminReceptionist',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/receptionists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update receptionist');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update receptionist');
    }
  }
);

export const deleteCenterAdminReceptionist = createAsyncThunk(
  'centerAdminReceptionists/deleteCenterAdminReceptionist',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/receptionists/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to delete receptionist');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete receptionist');
    }
  }
);

export const toggleCenterAdminReceptionistStatus = createAsyncThunk(
  'centerAdminReceptionists/toggleCenterAdminReceptionistStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/receptionists/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to toggle receptionist status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle receptionist status');
    }
  }
);

export const fetchCenterAdminReceptionistStats = createAsyncThunk(
  'centerAdminReceptionists/fetchCenterAdminReceptionistStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/receptionists/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch receptionist stats');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch receptionist stats');
    }
  }
);

const initialState = {
  receptionists: [],
  currentReceptionist: null,
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

const centerAdminReceptionistSlice = createSlice({
  name: 'centerAdminReceptionists',
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
      // Fetch receptionists
      .addCase(fetchCenterAdminReceptionists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterAdminReceptionists.fulfilled, (state, action) => {
        state.loading = false;
        state.receptionists = action.payload.receptionists || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchCenterAdminReceptionists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch receptionist by ID
      .addCase(fetchCenterAdminReceptionistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterAdminReceptionistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReceptionist = action.payload;
      })
      .addCase(fetchCenterAdminReceptionistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add receptionist
      .addCase(addCenterAdminReceptionist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCenterAdminReceptionist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Receptionist added successfully';
        state.receptionists.unshift(action.payload);
      })
      .addCase(addCenterAdminReceptionist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update receptionist
      .addCase(updateCenterAdminReceptionist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCenterAdminReceptionist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Receptionist updated successfully';
        const index = state.receptionists.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.receptionists[index] = action.payload;
        }
        if (state.currentReceptionist && state.currentReceptionist._id === action.payload._id) {
          state.currentReceptionist = action.payload;
        }
      })
      .addCase(updateCenterAdminReceptionist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete receptionist
      .addCase(deleteCenterAdminReceptionist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCenterAdminReceptionist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Receptionist deleted successfully';
        state.receptionists = state.receptionists.filter(r => r._id !== action.payload);
        if (state.currentReceptionist && state.currentReceptionist._id === action.payload) {
          state.currentReceptionist = null;
        }
      })
      .addCase(deleteCenterAdminReceptionist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Toggle status
      .addCase(toggleCenterAdminReceptionistStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(toggleCenterAdminReceptionistStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Receptionist status updated successfully';
        const index = state.receptionists.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.receptionists[index] = action.payload;
        }
        if (state.currentReceptionist && state.currentReceptionist._id === action.payload._id) {
          state.currentReceptionist = action.payload;
        }
      })
      .addCase(toggleCenterAdminReceptionistStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch stats
      .addCase(fetchCenterAdminReceptionistStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterAdminReceptionistStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCenterAdminReceptionistStats.rejected, (state, action) => {
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
} = centerAdminReceptionistSlice.actions;

export default centerAdminReceptionistSlice.reducer; 