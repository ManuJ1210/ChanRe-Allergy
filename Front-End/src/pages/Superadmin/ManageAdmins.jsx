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
    <div className="min-h-screen p-4 sm:p-8">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-500">Manage Center Admins</h2>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-100">
        <table className="min-w-full divide-y divide-blue-100 text-sm text-slate-600">
          <thead className="bg-blue-50 text-slate-700 font-semibold text-left">
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
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-slate-500">Loading...</td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-slate-500">No admins found.</td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-purple-50 transition">
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
                        className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-xl font-semibold shadow-sm transition"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-xl font-semibold shadow-sm transition"
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
