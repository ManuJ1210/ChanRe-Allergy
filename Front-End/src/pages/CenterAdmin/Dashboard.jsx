import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CenterAdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
    } else {
      const parsedUser = JSON.parse(userData);
      console.log('Logged in role:', parsedUser.role); // Optional debug
      if (parsedUser.role !== 'centeradmin') {
        alert('Access denied');
        navigate('/');
      } else {
        setUser(parsedUser);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">Center Admin Dashboard</h1>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Center ID:</strong> {user.centerId || 'Not assigned'}</p>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
