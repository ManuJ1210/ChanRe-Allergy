import { useEffect, useState } from 'react';
import API from '../../services/api';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ManageAdmins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await API.get('/center-admins');
      setAdmins(res.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleDelete = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await API.delete(`/center-admins/${adminId}`);
        fetchAdmins(); // refresh
      } catch (error) {
        console.error('Failed to delete admin:', error);
      }
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-6 text-blue-900">Manage Center Admins</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-blue-50 text-blue-800 font-semibold text-left">
            <tr>
              <th className="px-4 py-3">Admin Name</th>
              <th className="px-4 py-3">Center Name</th>
              <th className="px-4 py-3">Center Code</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.map((admin, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{admin.adminName}</td>
                <td className="px-4 py-2">{admin.centerName}</td>
                <td className="px-4 py-2">{admin.centerCode}</td>
                <td className="px-4 py-2">{admin.email}</td>
                <td className="px-4 py-2">{admin.phone}</td>
                <td className="px-4 py-2">{new Date(admin.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => navigate(`/superadmin/edit-admin/${admin._id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                      onClick={() => handleDelete(admin._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
