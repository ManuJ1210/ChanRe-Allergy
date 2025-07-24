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
import ViewHistory from '../pages/CenterAdmin/patients/AddHistory/ViewHistory';
import AddMedications from '../pages/CenterAdmin/patients/profile/AddMedications';
import ViewProfile from '../pages/CenterAdmin/patients/profile/ViewProfile';
import FollowUp from '../pages/CenterAdmin/patients/FollowUp/FollowUp';
import AddAllergicRhinitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Rhinitis/AddAllergicRhinitis';
import CenterProfile from '../pages/CenterAdmin/CenterProfile';
import ViewAllergicRhinitis from "../pages/CenterAdmin/patients/FollowUp/Allergic Rhinitis/ViewAllergicRhinitis";
import AtopicDermatitis from '../pages/CenterAdmin/patients/FollowUp/Atopic Dermatitis/AtopicDermatitis';
import ViewAtopicDermatitis from '../pages/CenterAdmin/patients/FollowUp/Atopic Dermatitis/ViewAtopicDermatitis';
import AddAllergicConjunctivitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Conjunctivitis/AddAllergicConjunctivitis';
import ViewAllergicConjunctivitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Conjunctivitis/ViewAllergicConjunctivitis';
import AddAllergicBronchitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Bronchitis/AddAllergicBronchitis';
import ViewAllergicBronchitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Bronchitis/ViewAllergicBronchitis';
import AddGPE from '../pages/CenterAdmin/patients/FollowUp/GPE/AddGPE';
import ViewGPE from '../pages/CenterAdmin/patients/FollowUp/GPE/ViewGPE';
import PrescriptionList from '../pages/CenterAdmin/patients/FollowUp/Prescription/PrescriptionList';
import AddPrescription from '../pages/CenterAdmin/patients/FollowUp/Prescription/AddPrescription';
import ViewPrescription from '../pages/CenterAdmin/patients/FollowUp/Prescription/ViewPrescription';

import Home from '../pages/Homepage';
import Contact from '../pages/Contact';
import About from '../pages/About';
import ViewPatientFollowUps from '../pages/Superadmin/ViewPatientFollowUps';
import SuperadminAllergicRhinitisList from '../pages/Superadmin/AllergicRhinitisList';
import SuperadminAtopicDermatitisList from '../pages/Superadmin/AtopicDermatitisList';
import SuperadminAllergicConjunctivitisList from '../pages/Superadmin/AllergicConjunctivitisList';
import SuperadminAllergicBronchitisList from '../pages/Superadmin/AllergicBronchitisList';
import ReceptionistDashboard from '../pages/Receptionist/Dashboard';
import AddReceptionistPatient from '../pages/Receptionist/AddPatient';
import ReceptionistPatientList from '../pages/Receptionist/PatientList';
import ReceptionistShowTests from '../pages/Receptionist/ShowTests';
import ReceptionistEditPatient from '../pages/Receptionist/EditPatient';
import ReceptionistManagePatients from '../pages/Receptionist/ManagePatients';
import ReceptionistPatientHistory from '../pages/Receptionist/PatientHistory';
import ReceptionistPatientFollowUp from '../pages/Receptionist/PatientFollowUp';
import ReceptionistViewProfile from '../pages/Receptionist/profile/ViewProfile';
import ReceptionistAddTest from '../pages/Receptionist/AddTest';
import ReceptionistAddHistory from '../pages/CenterAdmin/patients/AddHistory/AddHistory';
import ReceptionistAddMedications from '../pages/Receptionist/profile/AddMedications';


export default function AppRoutes() {
  return (
    <Routes>

      <Route path='/' element={<Home />} />
      <Route path='/Contact' element={<Contact />} />
      <Route path='/About' element={<About />} />

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
        <Route path="/Superadmin/ViewPatientFollowUps/:id" element={<ViewPatientFollowUps />} />
        <Route path="/Superadmin/AllergicRhinitisList/:patientId" element={<SuperadminAllergicRhinitisList />} />
        <Route path="/Superadmin/AtopicDermatitisList/:patientId" element={<SuperadminAtopicDermatitisList />} />
        <Route path="/Superadmin/AllergicConjunctivitisList/:patientId" element={<SuperadminAllergicConjunctivitisList />} />
        <Route path="/Superadmin/AllergicBronchitisList/:patientId" element={<SuperadminAllergicBronchitisList />} />

        <Route path="/superadmin/edit-center/:id" element={<EditCenter />} />
        <Route path="/superadmin/view-center/:id" element={<ViewCenterInfo />} />
        <Route path="/superadmin/edit-admin/:id" element={<EditCenterAdmin />} />

        <Route path="/CenterAdmin/Dashboard" element={<CenterAdminDashboard />} />
        <Route path='/CenterAdmin/patients/addpatient' element={<AddPatient />} />
        <Route path='/CenterAdmin/patients/PatientList' element={<PatientList />} />
        <Route path='CenterAdmin/patients/ManagePatients' element={<ManagePatients />} />
        <Route path='CenterAdmin/patients/EditPatient/:id' element={<EditPatient />} />
        <Route path="/CenterAdmin/patients/AddTest/:id" element={<AddTest />} />
        <Route path="/CenterAdmin/patients/show-tests/:id" element={<ShowTests />} />
        <Route path="/CenterAdmin/patients/AddHistory/:id" element={<AddHistory />} />
        <Route path="/CenterAdmin/patients/ViewHistory/:patientId" element={<ViewHistory />} />
        <Route path="/CenterAdmin/Docters/AddDocter" element={<AddDoctor />} />
        <Route path="/CenterAdmin/Docters/DocterList" element={<DoctorList />} />
        <Route path="/CenterAdmin/Docters/EditDoctor/:id" element={<EditDoctor />} />
        <Route path="/CenterAdmin/Receptionist/ManageReceptionists" element={<ManageReceptionists />} />
        <Route path="/CenterAdmin/Receptionist/AddReceptionist" element={<AddReceptionist />} />
        <Route path="/CenterAdmin/Receptionist/EditReceptionist/:id" element={<EditReceptionist />} />
        <Route path="/CenterAdmin/center-profile" element={<CenterProfile />} />
        <Route path="/CenterAdmin/patients/AddMedications/:id" element={<AddMedications />} />
        <Route path="/CenterAdmin/patients/ViewProfile/:id" element={<ViewProfile />} />
        <Route path="/CenterAdmin/patients/FollowUp/:id" element={<FollowUp />} />
        <Route
          path="/CenterAdmin/patients/FollowUp/AddAllergicRhinitis/:patientId"
          element={<AddAllergicRhinitis />}
        />
        <Route path="/CenterAdmin/patients/FollowUp/ViewAllergicRhinitis/:allergicRhinitisId" element={<ViewAllergicRhinitis />} />
        <Route path="/CenterAdmin/patients/FollowUp/AddAllergicConjunctivitis/:patientId" element={<AddAllergicConjunctivitis />} />
        <Route path="/CenterAdmin/patients/FollowUp/ViewAllergicConjunctivitis/:id" element={<ViewAllergicConjunctivitis />} />
        <Route path="/CenterAdmin/patients/FollowUp/AtopicDermatitis/:patientId" element={<AtopicDermatitis />} />
        <Route path="/CenterAdmin/patients/FollowUp/ViewAtopicDermatitis/:atopicDermatitisId" element={<ViewAtopicDermatitis />} />
        <Route path="/CenterAdmin/patients/FollowUp/AddAllergicBronchitis/:patientId" element={<AddAllergicBronchitis />} />
        <Route path="/CenterAdmin/patients/FollowUp/ViewAllergicBronchitis/:id" element={<ViewAllergicBronchitis />} />
        <Route path="/CenterAdmin/patients/FollowUp/AddGPE/:patientId" element={<AddGPE />} />
        <Route path="/CenterAdmin/patients/FollowUp/ViewGPE/:id" element={<ViewGPE />} />
        <Route path="/CenterAdmin/patients/FollowUp/PrescriptionList/:patientId" element={<PrescriptionList />} />
        <Route path="/CenterAdmin/patients/FollowUp/AddPrescription/:patientId" element={<AddPrescription />} />
        <Route path="/CenterAdmin/patients/FollowUp/ViewPrescription/:id" element={<ViewPrescription />} />

        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/add-patient" element={<AddReceptionistPatient />} />
        <Route path="/receptionist/patients" element={<ReceptionistPatientList />} />
        <Route path="/receptionist/patients/show-tests/:id" element={<ReceptionistShowTests />} />
        <Route path="/receptionist/manage-patients" element={<ReceptionistManagePatients />} />
        <Route path="/receptionist/edit-patient/:id" element={<ReceptionistEditPatient />} />
        <Route path="/receptionist/patient-history/:id" element={<ReceptionistPatientHistory />} />
        <Route path="/receptionist/patient-followup/:id" element={<ReceptionistPatientFollowUp />} />
        <Route path="/receptionist/profile/:id" element={<ReceptionistViewProfile />} />
        <Route path="/receptionist/add-test/:id" element={<ReceptionistAddTest />} />
        <Route path="/receptionist/add-history/:id" element={<ReceptionistAddHistory />} />
        <Route path="/receptionist/add-medications/:id" element={<ReceptionistAddMedications />} />








      </Route>
    </Routes>
  );
}
