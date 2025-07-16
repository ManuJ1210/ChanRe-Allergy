import { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Header({ onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: '', role: '' });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser({ name: userData.name, role: userData.role });
    }
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 border-b border-gray-200 shadow-sm sticky top-0 z-50">
      
      {/* Search bar */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Profile section */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FaUserCircle className="text-blue-600 text-xl" />
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{user.name || "Admin"}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role || "superadmin"}</p>
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
            <button
              className="flex items-center gap-2 px-4 py-2 w-full text-sm hover:bg-gray-100"
              onClick={() => alert('View Profile clicked')}
            >
              <FaUser /> View Profile
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:bg-gray-100"
              onClick={onLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
