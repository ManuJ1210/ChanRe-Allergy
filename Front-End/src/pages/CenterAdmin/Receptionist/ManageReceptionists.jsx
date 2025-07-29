import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchReceptionists, deleteReceptionistThunk } from '../../../features/centerAdmin/centerAdminThunks';
import { resetCenterAdminState } from '../../../features/centerAdmin/centerAdminSlice';
import { 
  Pencil, 
  Trash2, 
  UserCheck, 
  Search, 
  Plus,
  Mail,
  Phone,
  User
} from 'lucide-react';

const ManageReceptionists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receptionists, loading, error, deleteSuccess } = useSelector((state) => state.centerAdmin);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReceptionists, setFilteredReceptionists] = useState([]);

  useEffect(() => {
    dispatch(fetchReceptionists());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setTimeout(() => {
        dispatch(resetCenterAdminState());
      }, 2000);
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    const filtered = receptionists.filter(receptionist =>
      receptionist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receptionist.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receptionist.phone?.includes(searchTerm)
    );
    setFilteredReceptionists(filtered);
  }, [receptionists, searchTerm]);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this receptionist?')) return;
    dispatch(deleteReceptionistThunk(id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading receptionists...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Manage Receptionists
          </h1>
          <p className="text-slate-600">
            View and manage all receptionists in your center
          </p>
        </div>

        {/* Stats and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-8">
          <div className="p-6 border-b border-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-blue-500" />
                  Receptionists
                </h2>
                <p className="text-slate-600 mt-1">
                  Total: {receptionists.length} receptionists
                </p>
              </div>
              <button
                onClick={() => navigate('/CenterAdmin/Receptionist/AddReceptionist')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Receptionist
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {deleteSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <UserCheck className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-700">Receptionist deleted successfully!</span>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6">
          <div className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search receptionists by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Receptionists Table */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Receptionist
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredReceptionists.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <UserCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">No Receptionists Found</h3>
                      <p className="text-slate-500 mb-4">
                        {searchTerm ? 'No receptionists match your search.' : 'Get started by adding your first receptionist.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => navigate('/CenterAdmin/Receptionist/AddReceptionist')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Plus className="h-4 w-4" />
                          Add Receptionist
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredReceptionists.map((receptionist) => (
                    <tr key={receptionist._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {receptionist.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              ID: {receptionist._id?.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-slate-900">
                            <Mail className="h-3 w-3 mr-2 text-slate-400" />
                            {receptionist.email || 'No email'}
                          </div>
                          <div className="flex items-center text-sm text-slate-500">
                            <Phone className="h-3 w-3 mr-2 text-slate-400" />
                            {receptionist.phone || 'No phone'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {receptionist.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/CenterAdmin/Receptionist/EditReceptionist/${receptionist._id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="Edit receptionist"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(receptionist._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete receptionist"
                          >
                            <Trash2 className="h-4 w-4" />
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
};

export default ManageReceptionists; 