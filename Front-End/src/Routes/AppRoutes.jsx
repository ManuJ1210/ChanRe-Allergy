import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SuperadminDashboard from '../pages/Superadmin/Dashboard';
import CentersList from '../pages/Superadmin/CentersList';
import AddCenter from '../pages/Superadmin/AddCenter';
import DashboardLayout from '../layouts/DashboardLayout';
import ManageAdmins from '../pages/Superadmin/ManageAdmins';
import ViewFollowUpPatients from '../pages/Superadmin/ViewFollowUpPatients';
import EditCenter from '../pages/Superadmin/EditCenter';
import ViewCenterInfo from '../pages/Superadmin/ViewCenterInfo';
import EditCenterAdmin from '../pages/Superadmin/EditCenterAdmin';
import ForgotPassword from '../pages/ForgotPassword';
import PrivateRoute from '../components/PrivateRoute';
import CenterAdminDashboard from '../pages/CenterAdmin/Dashboard';
import AddPatient from '../pages/CenterAdmin/patients/AddPatient';
import PatientList from '../pages/CenterAdmin/patients/PatientList';
import ManagePatients from '../pages/CenterAdmin/patients/ManagePatients';
import EditPatient from '../pages/CenterAdmin/patients/EditPatient';
import AddTest from '../pages/CenterAdmin/patients/AddTest';
import ShowTests from '../pages/CenterAdmin/patients/ShowTests';
import AddHistory from '../pages/CenterAdmin/patients/AddHistory/AddHistory';
import AddDoctor from '../pages/CenterAdmin/Docters/AddDocter';
import DoctorList from '../pages/CenterAdmin/Docters/DoctorList';
import EditDoctor from '../pages/CenterAdmin/Docters/EditDoctor';
import ManageReceptionists from '../pages/CenterAdmin/Receptionist/ManageReceptionists';
import AddReceptionist from '../pages/CenterAdmin/Receptionist/AddReceptionist';
import EditReceptionist from '../pages/CenterAdmin/Receptionist/EditReceptionist';
import CenterProfile from '../pages/CenterAdmin/CenterProfile';

import Home from '../pages/Homepage';
import Contact from '../pages/Contact';
import About from '../pages/About';


export default function AppRoutes() {
  return (
    <Routes>

       <Route path='/' element={<Home/>}/>
       <Route path='/Contact' element={<Contact/>}/>
       <Route path='/About' element={<About/>}/>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/superadmin/dashboard" element={<SuperadminDashboard />} />
        <Route path="/superadmin/centers" element={<CentersList />} />
        <Route path="/superadmin/centers/add" element={<AddCenter />} />
        <Route path="/superadmin/manage-admins" element={<ManageAdmins />} />
        <Route path="/superadmin/follow-up/view" element={<ViewFollowUpPatients />} />
        
        <Route path="/superadmin/edit-center/:id" element={<EditCenter />} />
        <Route path="/superadmin/view-center/:id" element={<ViewCenterInfo />} />
        <Route path="/superadmin/edit-admin/:id" element={<EditCenterAdmin />} />

        <Route path="/CenterAdmin/Dashboard" element={<CenterAdminDashboard />} />
        <Route path='/CenterAdmin/patients/addpatient' element={<AddPatient />} />
        <Route path='/CenterAdmin/patients/PatientList' element={<PatientList />} />
        <Route path='CenterAdmin/patients/ManagePatients' element={<ManagePatients />} />
        <Route path='CenterAdmin/patients/EditPatient/:id' element={<EditPatient/>} />
        <Route path="/CenterAdmin/patients/AddTest/:id" element={<AddTest />} />
        <Route path="/CenterAdmin/patients/show-tests/:id" element={<ShowTests />} />
        <Route path="/CenterAdmin/patients/AddHistory/:id" element={<AddHistory />} />
        <Route path="/CenterAdmin/Docters/AddDocter" element={<AddDoctor/>} />
        <Route path="/CenterAdmin/Docters/DocterList" element={<DoctorList/>} />
        <Route path="/CenterAdmin/Docters/EditDoctor/:id" element={<EditDoctor/>} />
        <Route path="/CenterAdmin/Receptionist/ManageReceptionists" element={<ManageReceptionists/>} />
        <Route path="/CenterAdmin/Receptionist/AddReceptionist" element={<AddReceptionist/>} />
        <Route path="/CenterAdmin/Receptionist/EditReceptionist/:id" element={<EditReceptionist/>} />
        <Route path="/CenterAdmin/center-profile" element={<CenterProfile />} />









      </Route>
    </Routes>
  );
}
