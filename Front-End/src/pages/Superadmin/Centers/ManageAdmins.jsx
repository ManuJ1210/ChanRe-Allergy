import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCenterAdmins, deleteCenterAdmin } from '../../../features/superadmin/superadminThunks';
import { Trash2, Edit, UserCheck, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ManageAdmins() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { centerAdmins = [], loading, deleteSuccess } = useSelector((state) => state.superadmin);

  useEffect(() => {
    dispatch(fetchCenterAdmins());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      // Refresh the list after successful deletion
      dispatch(fetchCenterAdmins());
    }
  }, [deleteSuccess, dispatch]);

  const handleDelete = (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      dispatch(deleteCenterAdmin(adminId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Center Admins Management
          </h1>
          <p className="text-slate-600">
            Manage and monitor all center administrators
          </p>
        </div>

        {/* Success Message */}
        {deleteSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <UserCheck className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-700">Admin deleted successfully</span>
          </div>
        )}

        {/* Stats and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-8">
          <div className="p-6 border-b border-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-blue-500" />
                  Center Administrators
                </h2>
                <p className="text-slate-600 mt-1">
                  Total: {centerAdmins.length} admins
                </p>
              </div>
              <button
                onClick={() => {
                  // TODO: AddAdmin route doesn't exist yet
                  alert('Add Admin functionality not implemented yet');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Admin
              </button>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Admin Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Center Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Center Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading admins...</p>
                      </div>
                    </td>
                  </tr>
                ) : centerAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8">
                      <div className="text-center">
                        <UserCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-sm font-medium text-slate-600 mb-2">No Admins Found</h3>
                        <p className="text-slate-500 mb-4">Get started by adding your first center administrator.</p>
                        <button
                          onClick={() => {
                            // TODO: AddAdmin route doesn't exist yet
                            alert('Add Admin functionality not implemented yet');
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Plus className="h-4 w-4" />
                          Add Admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  centerAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-slate-800">{admin.adminName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600">{admin.centerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600">{admin.centerCode}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600">{admin.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/Superadmin/Centers/EditCenterAdmin/${admin._id}`)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            {loading ? 'Deleting...' : 'Delete'}
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
      </div>
    </div>
  );
}
