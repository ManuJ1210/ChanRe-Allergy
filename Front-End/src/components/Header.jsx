import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSignOutAlt, FaUser, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [centerName, setCenterName] = useState(() => {
    return localStorage.getItem('centerName') || '';
  });

  useEffect(() => {
    const handleStorage = () => {
      setCenterName(localStorage.getItem('centerName') || '');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isSuperadmin = user?.role?.toLowerCase() === 'superadmin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('centerName');
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white h-22 border-b border-gray-200 shadow-sm flex flex-wrap items-center px-2 md:px-6 transition-all duration-300 md:ml-[18.5rem] gap-2 md:gap-0">
        {/* Left: Center name */}
        <div className="flex items-center min-w-[100px] max-w-[160px] truncate flex-shrink-0 text-sm md:min-w-[180px] md:max-w-[220px] md:text-lg">
          {!isSuperadmin && (
            <span className="font-bold text-blue-700 whitespace-nowrap truncate">
              {centerName || 'Center'}
            </span>
          )}
        </div>
        {/* Center: Search bar (responsive) */}
        <div className="flex items-center gap-2 flex-1 min-w-0 max-w-full order-3 md:order-none md:justify-center">
          <FaSearch
            className="text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-w-0"
          />
        </div>
        {/* Right: Profile section */}
        <div className="relative flex-shrink-0 ml-auto order-2 md:order-none">
          <button
            className="flex items-center gap-2 px-2 md:px-3 py-1 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle className="text-blue-600 text-xl" />
            <div className="text-left hidden sm:block max-w-[100px] md:max-w-none truncate">
              <p className="text-xs md:text-sm font-medium text-gray-800 truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] md:text-xs text-gray-500 capitalize truncate">{user?.role || "superadmin"}</p>
            </div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                className="flex items-center gap-2 px-4 py-2 w-full text-sm hover:bg-gray-100"
                onClick={() => {
                  setShowProfile(true);
                  setDropdownOpen(false);
                }}
              >
                <FaUser /> View Profile
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:bg-gray-100"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </header>
      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 bg-black">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-lg relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center text-blue-600">User Profile</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {user?.name || '-'}</p>
              <p><strong>Email:</strong> {user?.email || '-'}</p>
              <p><strong>Role:</strong> {user?.role || '-'}</p>
              <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
              <p><strong>Center ID:</strong> {user?.centerId || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
