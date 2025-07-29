import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchCenterInfo, 
  fetchFollowUpPatients, 
  fetchDetailedFollowUps,
  fetchPatientFollowUps,
  fetchAllergicRhinitisList,
  fetchAllergicConjunctivitisList,
  fetchAllergicBronchitisList,
  fetchAtopicDermatitisList,
  fetchCenterAdmin,
  createCenterAdmin,
  updateCenterAdmin,
  deleteCenterAdmin,
  fetchDashboardStats,
  fetchCenters,
  fetchCenterAdmins,
  fetchLabStaff,
  createLabStaff,
  updateLabStaff,
  deleteLabStaff
} from './superadminThunks';

const initialState = {
  center: null,
  centerLoading: false,
  centerError: null,
  centerAdmin: null,
  isNewAdmin: false,
  followUpPatients: [],
  patientFollowUps: [],
  allergicRhinitisList: [],
  allergicConjunctivitisList: [],
  allergicBronchitisList: [],
  atopicDermatitisList: [],
  dashboardStats: {
    totalCenters: 0,
    totalAdmins: 0,
    totalPatients: 0,
    totalTests: 0
  },
  centers: [],
  centerAdmins: [],
  labStaff: [],
  loading: false,
  error: null,
  success: false, // Added for general success state
  addSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  addLabStaffSuccess: false
};

const superadminSlice = createSlice({
  name: 'superadmin',
  initialState,
  reducers: {
    resetSuperadminState: (state) => {
      state.addSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.success = false;
      state.error = null;
      state.centerError = null;
      state.centerAdmin = null;
      state.isNewAdmin = false;
      state.addLabStaffSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
      state.centerError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch centers
      .addCase(fetchCenters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenters.fulfilled, (state, action) => {
        state.loading = false;
        state.centers = action.payload;
        state.error = null;
      })
      .addCase(fetchCenters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch center admins
      .addCase(fetchCenterAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.centerAdmins = action.payload;
        state.error = null;
      })
      .addCase(fetchCenterAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch center info
      .addCase(fetchCenterInfo.pending, (state) => {
        state.centerLoading = true;
        state.centerError = null;
      })
      .addCase(fetchCenterInfo.fulfilled, (state, action) => {
        state.centerLoading = false;
        state.center = action.payload;
        state.centerError = null;
      })
      .addCase(fetchCenterInfo.rejected, (state, action) => {
        state.centerLoading = false;
        state.centerError = action.payload;
      })
      
      // Fetch follow-up patients
      .addCase(fetchFollowUpPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowUpPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.followUpPatients = action.payload;
        state.error = null;
      })
      .addCase(fetchFollowUpPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch patient follow-ups
      .addCase(fetchPatientFollowUps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientFollowUps.fulfilled, (state, action) => {
        state.loading = false;
        state.patientFollowUps = action.payload;
        state.error = null;
      })
      .addCase(fetchPatientFollowUps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch detailed follow-ups
      .addCase(fetchDetailedFollowUps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailedFollowUps.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming action.payload is an array of detailed follow-ups
        // You might need to adjust this based on the actual structure of detailed follow-ups
        // For now, we'll just set it to the payload
        state.patientFollowUps = action.payload; // Assuming patientFollowUps is the correct state for detailed follow-ups
        state.error = null;
      })
      .addCase(fetchDetailedFollowUps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch allergic rhinitis list
      .addCase(fetchAllergicRhinitisList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllergicRhinitisList.fulfilled, (state, action) => {
        state.loading = false;
        state.allergicRhinitisList = action.payload;
        state.error = null;
      })
      .addCase(fetchAllergicRhinitisList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch allergic conjunctivitis list
      .addCase(fetchAllergicConjunctivitisList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllergicConjunctivitisList.fulfilled, (state, action) => {
        state.loading = false;
        state.allergicConjunctivitisList = action.payload;
        state.error = null;
      })
      .addCase(fetchAllergicConjunctivitisList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch allergic bronchitis list
      .addCase(fetchAllergicBronchitisList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllergicBronchitisList.fulfilled, (state, action) => {
        state.loading = false;
        state.allergicBronchitisList = action.payload;
        state.error = null;
      })
      .addCase(fetchAllergicBronchitisList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch atopic dermatitis list
      .addCase(fetchAtopicDermatitisList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAtopicDermatitisList.fulfilled, (state, action) => {
        state.loading = false;
        state.atopicDermatitisList = action.payload;
        state.error = null;
      })
      .addCase(fetchAtopicDermatitisList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch center admin
      .addCase(fetchCenterAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.centerAdmin = action.payload;
        state.isNewAdmin = !action.payload; // Set to true if no admin found (null), false if admin exists
        state.error = null;
      })
      .addCase(fetchCenterAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isNewAdmin = true; // If error occurs, assume we're creating a new one
      })
      
      // Create center admin
      .addCase(createCenterAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCenterAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.centerAdmin = action.payload;
        state.isNewAdmin = false;
        state.addSuccess = true;
        state.success = true;
        state.error = null;
      })
      .addCase(createCenterAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update center admin
      .addCase(updateCenterAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCenterAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.centerAdmin = action.payload;
        state.updateSuccess = true;
        state.success = true;
        state.error = null;
      })
      .addCase(updateCenterAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete center admin
      .addCase(deleteCenterAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCenterAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteCenterAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch lab staff
      .addCase(fetchLabStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.labStaff = action.payload;
        state.error = null;
      })
      .addCase(fetchLabStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create lab staff
      .addCase(createLabStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLabStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.addLabStaffSuccess = true;
        state.success = true;
        state.error = null;
      })
      .addCase(createLabStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update lab staff
      .addCase(updateLabStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLabStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.success = true;
        state.error = null;
      })
      .addCase(updateLabStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete lab staff
      .addCase(deleteLabStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLabStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteLabStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  resetSuperadminState,
  clearError
} = superadminSlice.actions;

export default superadminSlice.reducer; 