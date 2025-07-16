import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  FaHospitalAlt,
  FaChevronDown,
  FaUserShield,
  FaUsers,
  FaUserCheck,
} from 'react-icons/fa';

export default function Sidebar() {
  const location = useLocation();
  const [centerOpen, setCenterOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm text-gray-700">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold tracking-wide text-blue-800">
          Chanre<span className="text-blue-500">Allergy</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">Superadmin Panel</p>
      </div>

      <nav className="flex flex-col p-4 space-y-1 text-sm">
        <SidebarLink
          to="/superadmin/dashboard"
          label="Dashboard"
          icon={<FaHospitalAlt />}
          isActive={isActive("/superadmin/dashboard")}
        />

        <SidebarGroup
          label="Center Admin"
          icon={<FaUserShield />}
          open={centerOpen}
          toggle={() => setCenterOpen(!centerOpen)}
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
          open={followUpOpen}
          toggle={() => setFollowUpOpen(!followUpOpen)}
          links={[
            { to: "/superadmin/follow-up/view", label: "View FollowUp" },
            { to: "/superadmin/follow-up/manage", label: "Manage FollowUp" }
          ]}
          currentPath={location.pathname}
        />

        <SidebarLink
          to="/superadmin/patients"
          label="Patients"
          icon={<FaUsers />}
          isActive={isActive("/superadmin/patients")}
        />
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
