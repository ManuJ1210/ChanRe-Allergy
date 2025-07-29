// src/features/doctor/doctorSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createDoctor,
  fetchAllDoctors,
  fetchDoctorById,
  updateDoctor,
  deleteDoctor,
  fetchAssignedPatients,
  fetchPatientDetails,
  addTestRequest,
  fetchTestRequests,
  createTestRequest,
  fetchTestRequestById,
  downloadTestReport,
  fetchPatientTestRequests
} from './doctorThunks';

const initialState = {
  // Admin functionality
  loading: false,
  success: false,
  error: null,
  doctors: [],
  doctorData: null,
  updateSuccess: false,
  
  // Doctor-specific functionality
  assignedPatients: [],
  patientDetails: null,
  testRequests: [],
  patientTestRequests: [],
  singleTestRequest: null,
  patientsLoading: false,
  patientDetailsLoading: false,
  testRequestsLoading: false,
  singleTestRequestLoading: false,
  patientsError: null,
  patientDetailsError: null,
  testRequestsError: null,
  singleTestRequestError: null,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    resetDoctorState: () => initialState,
    resetUpdateStatus: (state) => {
      state.updateSuccess = false;
    },
    resetPatientDetails: (state) => {
      state.patientDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create doctor
      .addCase(createDoctor.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createDoctor.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to create doctor';
      })

      // Update doctor
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.updateSuccess = false;
        state.error = action.payload || 'Failed to update doctor';
      })

      // Fetch doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.doctorData = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorData = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.doctorData = null;
        state.error = action.payload || 'Failed to fetch doctor';
      })
      
      // Fetch all doctors
      .addCase(fetchAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
        state.error = null;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch doctors';
      })

      // Delete doctor
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        // Remove the deleted doctor from the doctors array
        state.doctors = state.doctors.filter(doctor => doctor._id !== action.meta.arg);
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete doctor';
      })

      // Fetch assigned patients
      .addCase(fetchAssignedPatients.pending, (state) => {
        state.patientsLoading = true;
        state.patientsError = null;
      })
      .addCase(fetchAssignedPatients.fulfilled, (state, action) => {
        state.patientsLoading = false;
        state.assignedPatients = action.payload;
        state.patientsError = null;
      })
      .addCase(fetchAssignedPatients.rejected, (state, action) => {
        state.patientsLoading = false;
        state.patientsError = action.payload || 'Failed to fetch assigned patients';
      })

      // Fetch patient details
      .addCase(fetchPatientDetails.pending, (state) => {
        state.patientDetailsLoading = true;
        state.patientDetailsError = null;
      })
      .addCase(fetchPatientDetails.fulfilled, (state, action) => {
        state.patientDetailsLoading = false;
        state.patientDetails = action.payload;
        state.patientDetailsError = null;
      })
      .addCase(fetchPatientDetails.rejected, (state, action) => {
        state.patientDetailsLoading = false;
        state.patientDetailsError = action.payload || 'Failed to fetch patient details';
      })

      // Add test request
      .addCase(addTestRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTestRequest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(addTestRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add test request';
      })

      // Fetch test requests
      .addCase(fetchTestRequests.pending, (state) => {
        state.testRequestsLoading = true;
        state.testRequestsError = null;
      })
      .addCase(fetchTestRequests.fulfilled, (state, action) => {
        state.testRequestsLoading = false;
        state.testRequests = action.payload;
        state.testRequestsError = null;
      })
      .addCase(fetchTestRequests.rejected, (state, action) => {
        state.testRequestsLoading = false;
        state.testRequestsError = action.payload || 'Failed to fetch test requests';
      })

      // Create test request
      .addCase(createTestRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestRequest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createTestRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create test request';
      })

      // Fetch test request by ID
      .addCase(fetchTestRequestById.pending, (state) => {
        state.singleTestRequestLoading = true;
        state.singleTestRequestError = null;
      })
      .addCase(fetchTestRequestById.fulfilled, (state, action) => {
        state.singleTestRequestLoading = false;
        state.singleTestRequest = action.payload;
        state.singleTestRequestError = null;
      })
      .addCase(fetchTestRequestById.rejected, (state, action) => {
        state.singleTestRequestLoading = false;
        state.singleTestRequestError = action.payload || 'Failed to fetch test request';
      })

      // Download test report
      .addCase(downloadTestReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadTestReport.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(downloadTestReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to download report';
      })

      // Fetch patient test requests
      .addCase(fetchPatientTestRequests.pending, (state) => {
        state.testRequestsLoading = true;
        state.testRequestsError = null;
      })
      .addCase(fetchPatientTestRequests.fulfilled, (state, action) => {
        state.testRequestsLoading = false;
        state.patientTestRequests = action.payload;
        state.testRequestsError = null;
      })
      .addCase(fetchPatientTestRequests.rejected, (state, action) => {
        state.testRequestsLoading = false;
        state.testRequestsError = action.payload || 'Failed to fetch patient test requests';
      });
  },
});

export const { resetDoctorState, resetUpdateStatus, resetPatientDetails } = doctorSlice.actions;
export default doctorSlice.reducer;
