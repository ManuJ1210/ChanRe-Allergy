import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmins, deleteAdmin } from '../../features/admin/adminThunks';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ManageAdmins() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admins = [], loading, deletingId } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleDelete = (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      dispatch(deleteAdmin(adminId));
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
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">Loading...</td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">No admins found.</td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50 transition">
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
                        onClick={() => handleDelete(admin._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                        disabled={deletingId === admin._id}
                      >
                        <FaTrash />
                        {deletingId === admin._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
