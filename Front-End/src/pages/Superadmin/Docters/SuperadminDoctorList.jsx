import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { 
  fetchSuperAdminDoctors, 
  deleteSuperAdminDoctor, 
  toggleSuperAdminDoctorStatus,
  fetchSuperAdminDoctorStats,
  setFilters,
  clearError,
  clearSuccess 
} from '../../../features/superadmin/superAdminDoctorSlice';

const SuperAdminDoctorList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    doctors, 
    loading, 
    error, 
    success, 
    message, 
    pagination, 
    filters,
    stats 
  } = useSelector((state) => state.superAdminDoctors);



  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    dispatch(fetchSuperAdminDoctors({ 
      page: pagination?.currentPage || 1, 
      limit: pagination?.limit || 10, 
      search: filters?.search || '', 
      status: filters?.status || '' 
    }));
    dispatch(fetchSuperAdminDoctorStats());
  }, [dispatch, pagination?.currentPage, filters?.search, filters?.status]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    dispatch(setFilters({ status }));
  };

  const handlePageChange = (page) => {
    dispatch(fetchSuperAdminDoctors({ 
      page, 
      limit: pagination?.limit || 10, 
      search: filters?.search || '', 
      status: filters?.status || '' 
    }));
  };

  const handleDelete = async () => {
    if (selectedDoctor) {
      await dispatch(deleteSuperAdminDoctor(selectedDoctor._id));
      setShowDeleteModal(false);
      setSelectedDoctor(null);
    }
  };

  const handleToggleStatus = async (doctor) => {
    await dispatch(toggleSuperAdminDoctorStatus(doctor._id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dashboard/Superadmin')}
              className="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/dashboard/Superadmin/Docters/AddSuperadminDoctor')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Doctor
            </button>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Superadmin Doctors
          </h1>
          <p className="text-slate-600">
            Manage all superadmin doctors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Doctors</p>
                <p className="text-3xl font-bold text-slate-800">{stats?.total || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Doctors</p>
                <p className="text-3xl font-bold text-green-600">{stats?.active || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Inactive Doctors</p>
                <p className="text-3xl font-bold text-red-600">{stats?.inactive || 0}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <UserCheck className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-700">{message}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <UserCheck className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search doctors by name, email, or username..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusFilter('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === '' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'inactive' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Specializations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-slate-600">Loading doctors...</span>
                      </div>
                    </td>
                  </tr>
                ) : doctors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-slate-500">
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {doctor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{doctor.name}</div>
                            <div className="text-sm text-slate-500">@{doctor.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{doctor.email}</div>
                        <div className="text-sm text-slate-500">{doctor.mobile}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {(() => {
                            // Check if specializations exist and are valid
                            const specs = doctor.specializations;
                            
                            // Debug logging for first doctor only
                            if (doctors.indexOf(doctor) === 0) {
                              console.log('🔍 Debug - First doctor:', doctor);
                              console.log('🔍 Specializations:', specs);
                              console.log('🔍 Type:', typeof specs);
                              console.log('🔍 Is Array:', Array.isArray(specs));
                            }
                            
                            if (Array.isArray(specs) && specs.length > 0) {
                              return specs.join(', ');
                            } else if (typeof specs === 'string' && specs.trim()) {
                              return specs;
                            } else {
                              return (
                                <span className="text-slate-400 italic">
                                  No specializations
                                  <button
                                    onClick={() => navigate(`/dashboard/Superadmin/Docters/EditSuperadminDoctor/${doctor._id}`)}
                                    className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                                    title="Click to add specializations"
                                  >
                                    Add
                                  </button>
                                </span>
                              );
                            }
                          })()}
                        </div>
                        <div className="text-sm text-slate-500">{doctor.designation || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          doctor.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doctor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(doctor.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/Superadmin/Docters/ViewSuperadminDoctor/${doctor._id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/Superadmin/Docters/EditSuperadminDoctor/${doctor._id}`)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(doctor)}
                            className={`p-1 ${
                              doctor.status === 'active' 
                                ? 'text-orange-600 hover:text-orange-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={doctor.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {doctor.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
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

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-2 text-sm text-slate-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Confirm Delete</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <strong>{selectedDoctor?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDoctorList; 