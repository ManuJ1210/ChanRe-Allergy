// src/features/doctor/doctorSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createDoctor, updateDoctor, fetchDoctorById, fetchAllDoctors } from './doctorThunks'; // 👈 import fetchAllDoctors

const initialState = {
  loading: false,
  success: false,
  error: null,
  updateSuccess: false, // ✅ for tracking doctor update status
  doctorData: null, // Store fetched doctor details
  doctors: [], // Store all doctors for dropdowns
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    resetDoctorState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.updateSuccess = false;
      state.doctorData = null;
      state.doctors = [];
    },
    // ✅ Add this reducer for update reset
    resetUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.error = null;
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

      // ✅ Update doctor
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

      // ✅ Fetch doctor by ID
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
        state.doctors = [];
        state.error = action.payload || 'Failed to fetch doctors';
      });
  },
});

export const { resetDoctorState, resetUpdateStatus } = doctorSlice.actions; // ✅ export it
export default doctorSlice.reducer;
