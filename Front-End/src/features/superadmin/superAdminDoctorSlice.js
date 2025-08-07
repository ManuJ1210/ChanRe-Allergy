import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api.js';

// Management thunks (for superadmin to manage superadmin doctors)
export const fetchSuperAdminDoctors = createAsyncThunk(
  'superAdminDoctor/fetchSuperAdminDoctors',
  async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);

      const response = await API.get(`/superadmin/doctors?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch superadmin doctors');
    }
  }
);

export const addSuperAdminDoctor = createAsyncThunk(
  'superAdminDoctor/addSuperAdminDoctor',
  async (doctorData, { rejectWithValue }) => {
    try {
      const response = await API.post('/superadmin/doctors', doctorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add superadmin doctor');
    }
  }
);

export const deleteSuperAdminDoctor = createAsyncThunk(
  'superAdminDoctor/deleteSuperAdminDoctor',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/superadmin/doctors/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete superadmin doctor');
    }
  }
);

export const updateSuperAdminDoctor = createAsyncThunk(
  'superAdminDoctor/updateSuperAdminDoctor',
  async ({ id, doctorData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/superadmin/doctors/${id}`, doctorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update superadmin doctor');
    }
  }
);

export const toggleSuperAdminDoctorStatus = createAsyncThunk(
  'superAdminDoctor/toggleSuperAdminDoctorStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/superadmin/doctors/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle superadmin doctor status');
    }
  }
);

export const fetchSuperAdminDoctorStats = createAsyncThunk(
  'superAdminDoctor/fetchSuperAdminDoctorStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/superadmin/doctors/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch superadmin doctor stats');
    }
  }
);

export const fetchSuperAdminDoctorById = createAsyncThunk(
  'superAdminDoctor/fetchSuperAdminDoctorById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/superadmin/doctors/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch superadmin doctor');
    }
  }
);

// Working thunks (for superadmin doctors to perform their duties)
export const fetchSuperAdminDoctorAssignedPatients = createAsyncThunk(
  'superAdminDoctor/fetchSuperAdminDoctorAssignedPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/superadmin/doctors/working/assigned-patients');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assigned patients');
    }
  }
);

export const fetchSuperAdminDoctorPatientById = createAsyncThunk(
  'superAdminDoctor/fetchSuperAdminDoctorPatientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/superadmin/doctors/working/patients/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient');
    }
  }
);



export const fetchSuperAdminDoctorCompletedReports = createAsyncThunk(
  'superAdminDoctor/fetchSuperAdminDoctorCompletedReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/superadmin/doctors/working/completed-reports');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed reports');
    }
  }
);

export const fetchSuperAdminDoctorWorkingStats = createAsyncThunk(
  'superAdminDoctor/fetchSuperAdminDoctorWorkingStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/superadmin/doctors/working/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch working stats');
    }
  }
);

// Lab Reports functionality
export const fetchSuperAdminDoctorLabReports = createAsyncThunk(
  'superAdminDoctor/fetchSuperAdminDoctorLabReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/superadmin/doctors/working/lab-reports');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lab reports');
    }
  }
);

export const sendFeedbackToCenterDoctor = createAsyncThunk(
  'superAdminDoctor/sendFeedbackToCenterDoctor',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await API.post('/superadmin/doctors/working/send-feedback', feedbackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send feedback');
    }
  }
);

const initialState = {
  // Management state
  doctors: [],
  currentDoctor: null,
  stats: null,
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
  
  // Working state
  assignedPatients: [],
  selectedPatient: null,
  completedReports: [],
  labReports: [],
  workingStats: null,
  workingLoading: false,
  workingError: null
};

const superAdminDoctorSlice = createSlice({
  name: 'superAdminDoctor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.workingError = null;
    },
    clearWorkingError: (state) => {
      state.workingError = null;
    },
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = '';
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    // Management reducers
    builder
      .addCase(fetchSuperAdminDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchSuperAdminDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSuperAdminDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSuperAdminDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Superadmin doctor added successfully';
        state.doctors.push(action.payload);
      })
      .addCase(addSuperAdminDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSuperAdminDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSuperAdminDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Superadmin doctor deleted successfully';
        state.doctors = state.doctors.filter(doctor => doctor._id !== action.payload);
      })
      .addCase(deleteSuperAdminDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSuperAdminDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSuperAdminDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Superadmin doctor updated successfully';
        const index = state.doctors.findIndex(doctor => doctor._id === action.payload._id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
      })
      .addCase(updateSuperAdminDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleSuperAdminDoctorStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSuperAdminDoctorStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Superadmin doctor status updated successfully';
        const index = state.doctors.findIndex(doctor => doctor._id === action.payload._id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
      })
      .addCase(toggleSuperAdminDoctorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      })
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
      });

    // Working reducers
    builder
      .addCase(fetchSuperAdminDoctorAssignedPatients.pending, (state) => {
        state.workingLoading = true;
        state.workingError = null;
      })
      .addCase(fetchSuperAdminDoctorAssignedPatients.fulfilled, (state, action) => {
        state.workingLoading = false;
        state.assignedPatients = action.payload;
      })
      .addCase(fetchSuperAdminDoctorAssignedPatients.rejected, (state, action) => {
        state.workingLoading = false;
        state.workingError = action.payload;
      })
      .addCase(fetchSuperAdminDoctorPatientById.pending, (state) => {
        state.workingLoading = true;
        state.workingError = null;
      })
      .addCase(fetchSuperAdminDoctorPatientById.fulfilled, (state, action) => {
        state.workingLoading = false;
        state.selectedPatient = action.payload;
      })
      .addCase(fetchSuperAdminDoctorPatientById.rejected, (state, action) => {
        state.workingLoading = false;
        state.workingError = action.payload;
      })

      .addCase(fetchSuperAdminDoctorCompletedReports.pending, (state) => {
        state.workingLoading = true;
        state.workingError = null;
      })
      .addCase(fetchSuperAdminDoctorCompletedReports.fulfilled, (state, action) => {
        state.workingLoading = false;
        state.completedReports = action.payload;
      })
      .addCase(fetchSuperAdminDoctorCompletedReports.rejected, (state, action) => {
        state.workingLoading = false;
        state.workingError = action.payload;
      })
      .addCase(fetchSuperAdminDoctorWorkingStats.pending, (state) => {
        state.workingLoading = true;
        state.workingError = null;
      })
      .addCase(fetchSuperAdminDoctorWorkingStats.fulfilled, (state, action) => {
        state.workingLoading = false;
        state.workingStats = action.payload;
      })
      .addCase(fetchSuperAdminDoctorWorkingStats.rejected, (state, action) => {
        state.workingLoading = false;
        state.workingError = action.payload;
      })
      .addCase(fetchSuperAdminDoctorLabReports.pending, (state) => {
        state.workingLoading = true;
        state.workingError = null;
      })
      .addCase(fetchSuperAdminDoctorLabReports.fulfilled, (state, action) => {
        state.workingLoading = false;
        state.labReports = action.payload;
      })
      .addCase(fetchSuperAdminDoctorLabReports.rejected, (state, action) => {
        state.workingLoading = false;
        state.workingError = action.payload;
      })
      .addCase(sendFeedbackToCenterDoctor.pending, (state) => {
        state.workingLoading = true;
        state.workingError = null;
      })
      .addCase(sendFeedbackToCenterDoctor.fulfilled, (state, action) => {
        state.workingLoading = false;
        state.success = true;
        state.message = 'Feedback sent successfully to center doctor';
        // Update the report status in labReports
        const reportIndex = state.labReports.findIndex(report => report._id === action.payload.reportId);
        if (reportIndex !== -1) {
          state.labReports[reportIndex].status = 'feedback_sent';
        }
      })
      .addCase(sendFeedbackToCenterDoctor.rejected, (state, action) => {
        state.workingLoading = false;
        state.workingError = action.payload;
      });
  }
});

export const { clearError, clearWorkingError, setSelectedPatient, clearSuccess, setFilters } = superAdminDoctorSlice.actions;
export default superAdminDoctorSlice.reducer; 