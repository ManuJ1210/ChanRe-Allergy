import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  FaHospitalAlt,
  FaChevronDown,
  FaUserShield,
  FaUsers,
  FaUserCheck,
  FaUserMd,
  FaUserTie,
  FaVials,
  FaHome,
} from 'react-icons/fa';

export default function Sidebar() {
  const location = useLocation();
  const [centerOpen, setCenterOpen] = useState(null); // can be 'doctors', 'receptionists', or 'lab'

  const userInfo = useSelector((state) => state.user?.userInfo);
  const role = userInfo?.role || '';

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed top-0 left-0 h-screen w-[18.5rem] bg-white border-r border-gray-200 shadow-sm text-gray-700 z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold tracking-wide text-blue-800">
          Chanre<span className="text-blue-500">Allergy</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1 capitalize">
          {role ? `${role} Panel` : 'User Panel'}
        </p>
      </div>

      <nav className="flex flex-col p-4 space-y-1 text-sm">
        {role === 'superadmin' && (
          <>
            <SidebarLink
              to="/superadmin/dashboard"
              label="Dashboard"
              icon={<FaHospitalAlt />}
              isActive={isActive("/superadmin/dashboard")}
            />

            <SidebarGroup
              label="Center Admin"
              icon={<FaUserShield />}
              open={centerOpen === 'center'}
              toggle={() => setCenterOpen(centerOpen === 'center' ? null : 'center')}
              links={[
                { to: "/superadmin/centers", label: "Manage Center" },
                { to: "/superadmin/centers/add", label: "Add Center" },
                { to: "/superadmin/manage-admins", label: "Manage Admins" },
              ]}
              currentPath={location.pathname}
            />

            <SidebarGroup
              label="Follow Up"
              icon={<FaUserCheck />}
              open={centerOpen === 'followup'}
              toggle={() => setCenterOpen(centerOpen === 'followup' ? null : 'followup')}
              links={[
                { to: "/superadmin/follow-up/view", label: "View FollowUp" },
                { to: "/superadmin/follow-up/manage", label: "Manage FollowUp" },
              ]}
              currentPath={location.pathname}
            />

            <SidebarGroup
              label="Manage Lab Staff"
              icon={<FaVials />}
              open={centerOpen === 'lab'}
              toggle={() => setCenterOpen(centerOpen === 'lab' ? null : 'lab')}
              links={[
                { to: "/centeradmin/lab/add", label: "Add Lab Staff" },
                { to: "/centeradmin/lab", label: "Lab Staff List" },
              ]}
              currentPath={location.pathname}
            />
          </>
        )}

        {role === 'centeradmin' && (
          <>
            <SidebarLink
              to="/centeradmin/dashboard"
              label="Dashboard"
              icon={<FaHome />}
              isActive={isActive("/centeradmin/dashboard")}
            />

            <SidebarGroup
              label="Doctors"
              icon={<FaUserMd />}
              open={centerOpen === 'doctors'}
              toggle={() => setCenterOpen(centerOpen === 'doctors' ? null : 'doctors')}
              links={[
                { to: "/centeradmin/doctors/add", label: "Add Doctor" },
                { to: "/centeradmin/doctors", label: "Doctor List" },
              ]}
              currentPath={location.pathname}
            />

            <SidebarGroup
              label="Receptionists"
              icon={<FaUserTie />}
              open={centerOpen === 'receptionists'}
              toggle={() => setCenterOpen(centerOpen === 'receptionists' ? null : 'receptionists')}
              links={[
                { to: "/centeradmin/receptionists/add", label: "Add Receptionist" },
                { to: "/centeradmin/receptionists", label: "Receptionist List" },
              ]}
              currentPath={location.pathname}
            />

            <SidebarGroup
              label="Patients"
              icon={<FaVials />}
              open={centerOpen === 'patients'}
              toggle={() => setCenterOpen(centerOpen === 'patients' ? null : 'patients')}
              links={[
                { to: "/CenterAdmin/patients/addpatient", label: "Add patients" },
                { to: "/CenterAdmin/patients/PatientList", label: "Patients List" },
                { to: "/CenterAdmin/patients/ManagePatients", label: "Manage patients" },
              ]}
              currentPath={location.pathname}
            />

            <SidebarLink
              to="/CenterAdmin/center-profile"
              label="Center Profile"
              icon={<FaHospitalAlt />}
              isActive={isActive("/CenterAdmin/center-profile")}
            />
          </>
        )}
      </nav>
    </aside>
  );
}

function SidebarLink({ to, label, icon, isActive }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all border-l-4 ${
        isActive
          ? 'bg-blue-50 border-blue-600 text-blue-700 font-medium'
          : 'hover:bg-blue-50 border-transparent text-gray-600'
      }`}
    >
      <span className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

function SidebarGroup({ label, icon, open, toggle, links, currentPath }) {
  return (
    <div className="space-y-1">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50"
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-400">{icon}</span>
          {label}
        </div>
        <FaChevronDown
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pl-10">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block py-1 text-sm rounded ${
                currentPath === to
                  ? 'text-blue-700 font-medium'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
