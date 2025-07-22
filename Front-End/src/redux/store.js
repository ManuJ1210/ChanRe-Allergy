import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/slices/userSlice';
import authReducer from '../features/auth/authSlice';
import centerReducer from '../features/center/centerSlice';
import centerAdminReducer from '../features/admin/adminSlice';
import patientReducer from '../features/patient/patientSlice';
import doctorReducer from '../features/doctor/doctorSlice'; 
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    admin: adminReducer,
    center: centerReducer,
    centerAdmin: centerAdminReducer,
    patient: patientReducer,
    doctor: doctorReducer,
  },
});
