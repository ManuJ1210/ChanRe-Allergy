import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Homepage';
import Contact from '../pages/Contact';
import About from '../pages/About';
import DashboardLayout from '../layouts/DashboardLayout';
import PrivateRoute from '../components/PrivateRoute';

// Superadmin Pages
import SuperadminDashboard from '../pages/Superadmin/Dashboard';
import CentersList from '../pages/Superadmin/Centers/CentersList';
import AddCenter from '../pages/Superadmin/Centers/AddCenter';
import EditCenter from '../pages/Superadmin/Centers/EditCenter';
import ViewCenterInfo from '../pages/Superadmin/Centers/ViewCenterInfo';
import ManageAdmins from '../pages/Superadmin/Centers/ManageAdmins';
import EditCenterAdmin from '../pages/Superadmin/Centers/EditCenterAdmin';
import ViewFollowUpPatients from '../pages/Superadmin/Followups/ViewFollowUpPatients';
import ViewPatientFollowUps from '../pages/Superadmin/Followups/ViewPatientFollowUps';
import ManageFollowUp from '../pages/Superadmin/Followups/ManageFollowUp';
import SuperadminAllergicRhinitisList from '../pages/Superadmin/Followups/AllergicRhinitisList';
import SuperadminAtopicDermatitisList from '../pages/Superadmin/Followups/AtopicDermatitisList';
import SuperadminAllergicConjunctivitisList from '../pages/Superadmin/Followups/AllergicConjunctivitisList';
import SuperadminAllergicBronchitisList from '../pages/Superadmin/Followups/AllergicBronchitisList';
import GPEList from '../pages/Superadmin/Followups/GPEList';
import ViewAllergicRhinitis from '../pages/Superadmin/Followups/ViewAllergicRhinitis';
import ViewAtopicDermatitis from '../pages/Superadmin/Followups/ViewAtopicDermatitis';
import ViewAllergicConjunctivitis from '../pages/Superadmin/Followups/ViewAllergicConjunctivitis';
import ViewAllergicBronchitis from '../pages/Superadmin/Followups/ViewAllergicBronchitis';
import ViewGPE from '../pages/Superadmin/Followups/ViewGPE';
import LabStaffList from '../pages/Superadmin/Lab/LabStaffList';
import AddLabStaff from '../pages/Superadmin/Lab/AddLabStaff';
import EditLabStaff from '../pages/Superadmin/Lab/EditLabStaff';
import SuperAdminDoctorList from '../pages/Superadmin/Docters/SuperadminDoctorList';
import AddSuperAdminDoctor from '../pages/Superadmin/Docters/AddSuperadminDoctor';
import ViewSuperadminDoctor from '../pages/Superadmin/Docters/ViewSuperadminDoctor';
import EditSuperadminDoctor from '../pages/Superadmin/Docters/EditSuperadminDoctor';
import SuperAdminReceptionistList from '../pages/Superadmin/Receptionists/SuperadminReceptionistList';
import AddSuperAdminReceptionist from '../pages/Superadmin/Receptionists/AddSuperadminReceptionist';
import ViewSuperadminReceptionist from '../pages/Superadmin/Receptionists/ViewSuperadminReceptionist';
import EditSuperadminReceptionist from '../pages/Superadmin/Receptionists/EditSuperadminReceptionist';

// Lab Pages
import LabDashboard from '../pages/Lab/Dashboard';
import LabTestRequests from '../pages/Lab/TestRequests';
import LabPendingRequests from '../pages/Lab/PendingRequests';
import LabCompletedRequests from '../pages/Lab/CompletedRequests';
import LabTestRequestDetails from '../pages/Lab/TestRequestDetails';
import LabUpdateStatus from '../pages/Lab/UpdateStatus';
import LabScheduleCollection from '../pages/Lab/ScheduleCollection';
import LabStartTesting from '../pages/Lab/StartTesting';
import LabCompleteTesting from '../pages/Lab/CompleteTesting';
import LabGenerateReport from '../pages/Lab/GenerateReport';
import LabSendReport from '../pages/Lab/SendReport';
import LabRouteProtection from '../components/LabRouteProtection';

// Center Admin Pages
import CenterAdminDashboard from '../pages/CenterAdmin/Dashboard';
import CenterProfile from '../pages/CenterAdmin/CenterProfile';
import AddPatient from '../pages/CenterAdmin/patients/AddPatient';
import PatientList from '../pages/CenterAdmin/patients/PatientList';
import ManagePatients from '../pages/CenterAdmin/patients/ManagePatients';
import EditPatient from '../pages/CenterAdmin/patients/EditPatient';
import ViewProfile from '../pages/CenterAdmin/patients/profile/ViewProfile';
import AddTest from '../pages/CenterAdmin/patients/AddTest';
import ShowTests from '../pages/CenterAdmin/patients/ShowTests';
import AddHistory from '../pages/CenterAdmin/patients/AddHistory/AddHistory';
import ViewHistory from '../pages/CenterAdmin/patients/AddHistory/ViewHistory';
import AddMedications from '../pages/CenterAdmin/patients/profile/AddMedications';
import CenterAdminAddDoctor from '../pages/CenterAdmin/Docters/AddDocter';
import CenterAdminDoctorList from '../pages/CenterAdmin/Docters/DoctorList';
import CenterAdminEditDoctor from '../pages/CenterAdmin/Docters/EditDoctor';
import CenterAdminViewDoctor from '../pages/CenterAdmin/Docters/ViewDoctor';
import ManageReceptionists from '../pages/CenterAdmin/Receptionist/ManageReceptionists';
import CenterAdminAddReceptionist from '../pages/CenterAdmin/Receptionist/AddReceptionist';
import EditReceptionist from '../pages/CenterAdmin/Receptionist/EditReceptionist';
import CenterAdminViewReceptionist from '../pages/CenterAdmin/Receptionist/ViewReceptionist';
import FollowUp from '../pages/CenterAdmin/patients/FollowUp/FollowUp';
import AddAllergicRhinitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Rhinitis/AddAllergicRhinitis';
import CenterAdminViewAllergicRhinitis from "../pages/CenterAdmin/patients/FollowUp/Allergic Rhinitis/ViewAllergicRhinitis";
import AddAllergicConjunctivitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Conjunctivitis/AddAllergicConjunctivitis';
import CenterAdminViewAllergicConjunctivitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Conjunctivitis/ViewAllergicConjunctivitis';
import AtopicDermatitis from '../pages/CenterAdmin/patients/FollowUp/Atopic Dermatitis/AtopicDermatitis';
import CenterAdminViewAtopicDermatitis from '../pages/CenterAdmin/patients/FollowUp/Atopic Dermatitis/ViewAtopicDermatitis';
import AddAllergicBronchitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Bronchitis/AddAllergicBronchitis';
import CenterAdminViewAllergicBronchitis from '../pages/CenterAdmin/patients/FollowUp/Allergic Bronchitis/ViewAllergicBronchitis';
import AddGPE from '../pages/CenterAdmin/patients/FollowUp/GPE/AddGPE';
import CenterAdminViewGPE from '../pages/CenterAdmin/patients/FollowUp/GPE/ViewGPE';
import PrescriptionList from '../pages/CenterAdmin/patients/FollowUp/Prescription/PrescriptionList';
import AddPrescription from '../pages/CenterAdmin/patients/FollowUp/Prescription/AddPrescription';
import ViewPrescription from '../pages/CenterAdmin/patients/FollowUp/Prescription/ViewPrescription';

// Receptionist Pages
import ReceptionistDashboard from '../pages/Receptionist/Dashboard';
import AddReceptionistPatient from '../pages/Receptionist/AddPatient';
import ReceptionistPatientList from '../pages/Receptionist/PatientList';
import ReceptionistManagePatients from '../pages/Receptionist/ManagePatients';
import ReceptionistEditPatient from '../pages/Receptionist/EditPatient';
import ReceptionistViewProfile from '../pages/Receptionist/profile/ViewProfile';
import ReceptionistAddTest from '../pages/Receptionist/AddTest';
import ReceptionistShowTests from '../pages/Receptionist/ShowTests';
import ReceptionistAddHistory from '../pages/CenterAdmin/patients/AddHistory/AddHistory';
import ReceptionistAddMedications from '../pages/Receptionist/profile/AddMedications';
import ReceptionistPatientHistory from '../pages/Receptionist/PatientHistory';
import ReceptionistPatientFollowUp from '../pages/Receptionist/PatientFollowUp';
import ReceptionistAddAllergicRhinitis from '../pages/Receptionist/FollowUp/Allergic Rhinitis/AddAllergicRhinitis';
import ReceptionistViewAllergicRhinitis from '../pages/Receptionist/FollowUp/Allergic Rhinitis/ViewAllergicRhinitis';
import ReceptionistAddAtopicDermatitis from '../pages/Receptionist/FollowUp/Atopic Dermatitis/AtopicDermatitis';
import ReceptionistViewAtopicDermatitis from '../pages/Receptionist/FollowUp/Atopic Dermatitis/ViewAtopicDermatitis';
import ReceptionistAddAllergicConjunctivitis from '../pages/Receptionist/FollowUp/Allergic Conjunctivitis/AddAllergicConjunctivitis';
import ReceptionistViewAllergicConjunctivitis from '../pages/Receptionist/FollowUp/Allergic Conjunctivitis/ViewAllergicConjunctivitis';
import ReceptionistAddAllergicBronchitis from '../pages/Receptionist/FollowUp/Allergic Bronchitis/AddAllergicBronchitis';
import ReceptionistViewAllergicBronchitis from '../pages/Receptionist/FollowUp/Allergic Bronchitis/ViewAllergicBronchitis';
import ReceptionistAddGPE from '../pages/Receptionist/FollowUp/GPE/AddGPE';
import ReceptionistViewGPE from '../pages/Receptionist/FollowUp/GPE/ViewGPE';
import ReceptionistPrescriptionList from '../pages/Receptionist/FollowUp/Prescription/PrescriptionList';
import ReceptionistAddPrescription from '../pages/Receptionist/FollowUp/Prescription/AddPrescription';
import ReceptionistViewPrescription from '../pages/Receptionist/FollowUp/Prescription/ViewPrescription';

// Doctor Pages
import DoctorDashboard from '../pages/Doctor/Dashboard';
import DoctorPatientDetails from '../pages/Doctor/PatientDetails';
import MyPatients from '../pages/Doctor/MyPatients';
import TestRequests from '../pages/Doctor/TestRequests';
import NewTestRequest from '../pages/Doctor/NewTestRequest';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        {/* Superadmin Routes */}
        <Route path="Superadmin/Dashboard" element={<SuperadminDashboard />} />
        
        {/* Centers Routes */}
        <Route path="Superadmin/Centers/CentersList" element={<CentersList />} />
        <Route path="Superadmin/Centers/AddCenter" element={<AddCenter />} />
        <Route path="Superadmin/Centers/EditCenter/:id" element={<EditCenter />} />
        <Route path="Superadmin/Centers/ViewCenterInfo/:id" element={<ViewCenterInfo />} />
        <Route path="Superadmin/Centers/ManageAdmins" element={<ManageAdmins />} />
        <Route path="Superadmin/Centers/EditCenterAdmin/:id" element={<EditCenterAdmin />} />
        
        {/* Followups Routes */}
        <Route path="Superadmin/Followups/ViewFollowUpPatients" element={<ViewFollowUpPatients />} />
        <Route path="Superadmin/Followups/ViewPatientFollowUps/:patientId" element={<ViewPatientFollowUps />} />
        <Route path="Superadmin/Followups/ManageFollowUp" element={<ManageFollowUp />} />
        <Route path="Superadmin/Followups/AllergicRhinitisList" element={<SuperadminAllergicRhinitisList />} />
        <Route path="Superadmin/Followups/AtopicDermatitisList" element={<SuperadminAtopicDermatitisList />} />
        <Route path="Superadmin/Followups/AllergicConjunctivitisList" element={<SuperadminAllergicConjunctivitisList />} />
        <Route path="Superadmin/Followups/AllergicBronchitisList" element={<SuperadminAllergicBronchitisList />} />
        <Route path="Superadmin/Followups/GPEList" element={<GPEList />} />
        <Route path="Superadmin/Followups/ViewAllergicRhinitis/:patientId" element={<ViewAllergicRhinitis />} />
        <Route path="Superadmin/Followups/ViewAtopicDermatitis/:patientId" element={<ViewAtopicDermatitis />} />
        <Route path="Superadmin/Followups/ViewAllergicConjunctivitis/:patientId" element={<ViewAllergicConjunctivitis />} />
        <Route path="Superadmin/Followups/ViewAllergicBronchitis/:patientId" element={<ViewAllergicBronchitis />} />
        <Route path="Superadmin/Followups/ViewGPE/:patientId" element={<ViewGPE />} />
        
        {/* Lab Routes */}
        <Route path="Superadmin/Lab/LabStaffList" element={<LabStaffList />} />
        <Route path="Superadmin/Lab/AddLabStaff" element={<AddLabStaff />} />
        <Route path="Superadmin/Lab/EditLabStaff/:id" element={<EditLabStaff />} />
        
        {/* Doctors Routes */}
        <Route path="Superadmin/Docters/SuperAdminDoctorList" element={<SuperAdminDoctorList />} />
        <Route path="Superadmin/Docters/AddSuperAdminDoctor" element={<AddSuperAdminDoctor />} />
        <Route path="Superadmin/Docters/ViewSuperadminDoctor/:id" element={<ViewSuperadminDoctor />} />
        <Route path="Superadmin/Docters/EditSuperadminDoctor/:id" element={<EditSuperadminDoctor />} />
        
        {/* Receptionists Routes */}
        <Route path="Superadmin/Receptionists/SuperAdminReceptionistList" element={<SuperAdminReceptionistList />} />
        <Route path="Superadmin/Receptionists/AddSuperAdminReceptionist" element={<AddSuperAdminReceptionist />} />
        <Route path="Superadmin/Receptionists/ViewSuperadminReceptionist/:id" element={<ViewSuperadminReceptionist />} />
        <Route path="Superadmin/Receptionists/EditSuperadminReceptionist/:id" element={<EditSuperadminReceptionist />} />

        {/* Center Admin Routes */}
        <Route path="CenterAdmin/Dashboard" element={<CenterAdminDashboard />} />
        <Route path="CenterAdmin/center-profile" element={<CenterProfile />} />
        <Route path='CenterAdmin/patients/addpatient' element={<AddPatient />} />
        <Route path='CenterAdmin/patients/PatientList' element={<PatientList />} />
        <Route path='CenterAdmin/patients/ManagePatients' element={<ManagePatients />} />
        <Route path='CenterAdmin/patients/EditPatient/:id' element={<EditPatient />} />
        <Route path="CenterAdmin/patients/ViewProfile/:id" element={<ViewProfile />} />
        <Route path="CenterAdmin/patients/AddTest/:id" element={<AddTest />} />
        <Route path="CenterAdmin/patients/show-tests/:id" element={<ShowTests />} />
        <Route path="CenterAdmin/patients/AddHistory/:id" element={<AddHistory />} />
        <Route path="CenterAdmin/patients/ViewHistory/:patientId" element={<ViewHistory />} />
        <Route path="CenterAdmin/patients/AddMedications/:id" element={<AddMedications />} />
        <Route path="CenterAdmin/Docters/AddDocter" element={<CenterAdminAddDoctor />} />
        <Route path="CenterAdmin/Docters/DocterList" element={<CenterAdminDoctorList />} />
        <Route path="CenterAdmin/Docters/ViewDoctor/:id" element={<CenterAdminViewDoctor />} />
        <Route path="CenterAdmin/Docters/EditDoctor/:id" element={<CenterAdminEditDoctor />} />
        <Route path="CenterAdmin/Receptionist/ManageReceptionists" element={<ManageReceptionists />} />
        <Route path="CenterAdmin/Receptionist/AddReceptionist" element={<CenterAdminAddReceptionist />} />
        <Route path="CenterAdmin/Receptionist/ViewReceptionist/:id" element={<CenterAdminViewReceptionist />} />
        <Route path="CenterAdmin/Receptionist/EditReceptionist/:id" element={<EditReceptionist />} />
        <Route path="CenterAdmin/patients/FollowUp/:id" element={<FollowUp />} />
        <Route path="CenterAdmin/patients/FollowUp/AddAllergicRhinitis/:patientId" element={<AddAllergicRhinitis />} />
        <Route path="CenterAdmin/patients/FollowUp/ViewAllergicRhinitis/:allergicRhinitisId" element={<CenterAdminViewAllergicRhinitis />} />
        <Route path="CenterAdmin/patients/FollowUp/AddAllergicConjunctivitis/:patientId" element={<AddAllergicConjunctivitis />} />
        <Route path="CenterAdmin/patients/FollowUp/ViewAllergicConjunctivitis/:id" element={<CenterAdminViewAllergicConjunctivitis />} />
        <Route path="CenterAdmin/patients/FollowUp/AtopicDermatitis/:patientId" element={<AtopicDermatitis />} />
        <Route path="CenterAdmin/patients/FollowUp/ViewAtopicDermatitis/:atopicDermatitisId" element={<CenterAdminViewAtopicDermatitis />} />
        <Route path="CenterAdmin/patients/FollowUp/AddAllergicBronchitis/:patientId" element={<AddAllergicBronchitis />} />
        <Route path="CenterAdmin/patients/FollowUp/ViewAllergicBronchitis/:id" element={<CenterAdminViewAllergicBronchitis />} />
        <Route path="CenterAdmin/patients/FollowUp/AddGPE/:patientId" element={<AddGPE />} />
        <Route path="CenterAdmin/patients/FollowUp/ViewGPE/:id" element={<CenterAdminViewGPE />} />
        <Route path="CenterAdmin/patients/FollowUp/PrescriptionList/:patientId" element={<PrescriptionList />} />
        <Route path="CenterAdmin/patients/FollowUp/AddPrescription/:patientId" element={<AddPrescription />} />
        <Route path="CenterAdmin/patients/FollowUp/ViewPrescription/:id" element={<ViewPrescription />} />

        {/* Receptionist Routes */}
        <Route path="receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="receptionist/add-patient" element={<AddReceptionistPatient />} />
        <Route path="receptionist/patients" element={<ReceptionistPatientList />} />
        <Route path="receptionist/manage-patients" element={<ReceptionistManagePatients />} />
        <Route path="receptionist/edit-patient/:id" element={<ReceptionistEditPatient />} />
        <Route path="receptionist/profile/:id" element={<ReceptionistViewProfile />} />
        <Route path="receptionist/add-test/:id" element={<ReceptionistAddTest />} />
        <Route path="receptionist/patients/show-tests/:id" element={<ReceptionistShowTests />} />
        <Route path="receptionist/add-history/:id" element={<ReceptionistAddHistory />} />
        <Route path="receptionist/add-medications/:id" element={<ReceptionistAddMedications />} />
        <Route path="receptionist/patient-history/:id" element={<ReceptionistPatientHistory />} />
        <Route path="receptionist/patient-followup/:id" element={<ReceptionistPatientFollowUp />} />
        {/* Allergic Rhinitis */}
        <Route path="receptionist/followup/allergic-rhinitis/add/:patientId" element={<ReceptionistAddAllergicRhinitis />} />
        <Route path="receptionist/followup/allergic-rhinitis/view/:allergicRhinitisId" element={<ReceptionistViewAllergicRhinitis />} />
        <Route path="receptionist/follow-up/allergic-rhinitis/add/:patientId" element={<ReceptionistAddAllergicRhinitis />} />
        <Route path="receptionist/follow-up/allergic-rhinitis/view/:allergicRhinitisId" element={<ReceptionistViewAllergicRhinitis />} />
        {/* Atopic Dermatitis */}
        <Route path="receptionist/followup/atopic-dermatitis/add/:patientId" element={<ReceptionistAddAtopicDermatitis />} />
        <Route path="receptionist/followup/atopic-dermatitis/view/:atopicDermatitisId" element={<ReceptionistViewAtopicDermatitis />} />
        <Route path="receptionist/follow-up/atopic-dermatitis/add/:patientId" element={<ReceptionistAddAtopicDermatitis />} />
        <Route path="receptionist/follow-up/atopic-dermatitis/view/:atopicDermatitisId" element={<ReceptionistViewAtopicDermatitis />} />
        {/* Allergic Conjunctivitis */}
        <Route path="receptionist/followup/allergic-conjunctivitis/add/:patientId" element={<ReceptionistAddAllergicConjunctivitis />} />
        <Route path="receptionist/followup/allergic-conjunctivitis/view/:id" element={<ReceptionistViewAllergicConjunctivitis />} />
        <Route path="receptionist/follow-up/allergic-conjunctivitis/add/:patientId" element={<ReceptionistAddAllergicConjunctivitis />} />
        <Route path="receptionist/follow-up/allergic-conjunctivitis/view/:id" element={<ReceptionistViewAllergicConjunctivitis />} />
        {/* Allergic Bronchitis */}
        <Route path="receptionist/followup/allergic-bronchitis/add/:patientId" element={<ReceptionistAddAllergicBronchitis />} />
        <Route path="receptionist/followup/allergic-bronchitis/view/:id" element={<ReceptionistViewAllergicBronchitis />} />
        <Route path="receptionist/follow-up/allergic-bronchitis/add/:patientId" element={<ReceptionistAddAllergicBronchitis />} />
        <Route path="receptionist/follow-up/allergic-bronchitis/view/:id" element={<ReceptionistViewAllergicBronchitis />} />
        {/* GPE */}
        <Route path="receptionist/followup/gpe/add/:patientId" element={<ReceptionistAddGPE />} />
        <Route path="receptionist/followup/gpe/view/:id" element={<ReceptionistViewGPE />} />
        <Route path="receptionist/follow-up/gpe/add/:patientId" element={<ReceptionistAddGPE />} />
        <Route path="receptionist/follow-up/gpe/view/:id" element={<ReceptionistViewGPE />} />
        {/* Prescriptions */}
        <Route path="receptionist/followup/prescription/list/:patientId" element={<ReceptionistPrescriptionList />} />
        <Route path="receptionist/followup/prescription/add/:patientId" element={<ReceptionistAddPrescription />} />
        <Route path="receptionist/followup/prescription/view/:id" element={<ReceptionistViewPrescription />} />
        <Route path="receptionist/follow-up/prescription/list/:patientId" element={<ReceptionistPrescriptionList />} />
        <Route path="receptionist/follow-up/prescription/add/:patientId" element={<ReceptionistAddPrescription />} />
        <Route path="receptionist/follow-up/prescription/view/:id" element={<ReceptionistViewPrescription />} />

        {/* Doctor Routes */}
        <Route path="doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="doctor/patient/:patientId" element={<DoctorPatientDetails />} />
        <Route path="doctor/patients" element={<MyPatients />} />
        <Route path="doctor/test-requests" element={<TestRequests />} />
        <Route path="doctor/new-test-request" element={<NewTestRequest />} />

        {/* Lab Routes */}
        <Route path="lab/dashboard" element={<LabRouteProtection><LabDashboard /></LabRouteProtection>} />
        <Route path="lab/test-requests" element={<LabRouteProtection><LabTestRequests /></LabRouteProtection>} />
        <Route path="lab/pending-requests" element={<LabRouteProtection><LabPendingRequests /></LabRouteProtection>} />
        <Route path="lab/completed-requests" element={<LabRouteProtection><LabCompletedRequests /></LabRouteProtection>} />
        <Route path="lab/test-request/:id" element={<LabRouteProtection><LabTestRequestDetails /></LabRouteProtection>} />
        <Route path="lab/update-status/:id" element={<LabRouteProtection><LabUpdateStatus /></LabRouteProtection>} />
        <Route path="lab/schedule-collection/:id" element={<LabRouteProtection><LabScheduleCollection /></LabRouteProtection>} />
        <Route path="lab/start-testing/:id" element={<LabRouteProtection><LabStartTesting /></LabRouteProtection>} />
        <Route path="lab/complete-testing/:id" element={<LabRouteProtection><LabCompleteTesting /></LabRouteProtection>} />
        <Route path="lab/generate-report/:id" element={<LabRouteProtection><LabGenerateReport /></LabRouteProtection>} />
        <Route path="lab/send-report/:id" element={<LabRouteProtection><LabSendReport /></LabRouteProtection>} />
      </Route>
    </Routes>
  );
}
