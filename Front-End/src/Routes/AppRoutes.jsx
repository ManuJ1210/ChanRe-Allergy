import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SuperadminDashboard from '../pages/Superadmin/Dashboard';
import CentersList from '../pages/Superadmin/CentersList';
import AddCenter from '../pages/Superadmin/AddCenter';
import DashboardLayout from '../layouts/DashboardLayout';
import ManageAdmins from '../pages/Superadmin/ManageAdmins';
import ViewFollowUpPatients from '../pages/Superadmin/ViewFollowUpPatients';
import ManageFollowUp from '../pages/Superadmin/ManageFollowUp';
import EditCenter from '../pages/Superadmin/EditCenter';
import ViewCenterInfo from '../pages/Superadmin/ViewCenterInfo';
import EditCenterAdmin from '../pages/Superadmin/EditCenterAdmin';




export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/superadmin/dashboard" element={<SuperadminDashboard />} />
        <Route path="/superadmin/centers" element={<CentersList />} />
        <Route path="/superadmin/centers/add" element={<AddCenter />} />
        <Route path="/superadmin/manage-admins" element={<ManageAdmins />} />
        <Route path="/superadmin/follow-up/view" element={<ViewFollowUpPatients />} />
        <Route path="/superadmin/follow-up/manage" element={<ManageFollowUp />} />
        <Route path="/superadmin/edit-center/:id" element={<EditCenter />} />
        <Route path="/superadmin/view-center/:id" element={<ViewCenterInfo />} />
       <Route path="/superadmin/edit-admin/:id" element={<EditCenterAdmin />} />

      </Route>
    </Routes>
  );
}
