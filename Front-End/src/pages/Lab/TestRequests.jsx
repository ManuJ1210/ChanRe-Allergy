import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { 
  Microscope, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Edit,
  Filter,
  Search,
  Calendar,
  User,
  Phone,
  MapPin,
  RefreshCw,
  Trash2,
  Download
} from 'lucide-react';

export default function TestRequests() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [testRequests, setTestRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  useEffect(() => {
    if (user && (user._id || user.id)) {
      fetchTestRequests();
    } else if (user && !user._id && !user.id) {
      setLoading(false);
    }
  }, [user]);

  // Auto-refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user && (user._id || user.id)) {
        fetchTestRequests();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    if (!user || (!user._id && !user.id)) return;

    const interval = setInterval(() => {
      fetchTestRequests();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    filterRequests();
  }, [testRequests, searchTerm, statusFilter, urgencyFilter]);

  const fetchTestRequests = async () => {
    try {
      setLoading(true);
      const response = await API.get('/test-requests/lab-staff');
      const data = response.data;
      setTestRequests(data);
      setLastRefreshTime(new Date());
    } catch (error) {
      setTestRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchTestRequests();
  };

  const filterRequests = () => {
    let filtered = testRequests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.testType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.centerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Urgency filter
    if (urgencyFilter !== 'All') {
      filtered = filtered.filter(request => request.urgency === urgencyFilter);
    }

    setFilteredRequests(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Assigned':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Sample_Collection_Scheduled':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Sample_Collected':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'In_Lab_Testing':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Testing_Completed':
        return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'Report_Generated':
        return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      case 'Report_Sent':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Emergency':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Urgent':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Normal':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Assigned':
        return <Microscope className="h-4 w-4" />;
      case 'Sample_Collection_Scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'Sample_Collected':
        return <User className="h-4 w-4" />;
      case 'In_Lab_Testing':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Testing_Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Report_Generated':
        return <Eye className="h-4 w-4" />;
      case 'Report_Sent':
        return <CheckCircle className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'Emergency':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Urgent':
        return <Clock className="h-4 w-4" />;
      case 'Normal':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (requestId) => {
            navigate(`/dashboard/lab/test-request/${requestId}`);
  };

  const handleUpdateStatus = (requestId) => {
            navigate(`/dashboard/lab/update-status/${requestId}`);
  };

  const handleViewReport = (requestId) => {
    // Open PDF in new tab
    const token = localStorage.getItem('token');
    const viewUrl = `http://localhost:5000/api/test-requests/${requestId}/download-report`;
    
    // Add token to URL as query parameter for the new tab
    const urlWithToken = `${viewUrl}?token=${encodeURIComponent(token)}`;
    window.open(urlWithToken, '_blank');
  };

  const handleDownloadReport = (requestId) => {
    // Download the report file using the new API endpoint
    const token = localStorage.getItem('token');
    const downloadUrl = `http://localhost:5000/api/test-requests/${requestId}/download-report`;
    
    fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lab-report-${requestId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch(error => {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    });
  };

  const handleDeleteRequest = async (requestId, patientName) => {
    if (window.confirm(`Are you sure you want to delete the test request for ${patientName}? This action cannot be undone.`)) {
      try {
        const response = await API.delete(`/test-requests/${requestId}`);
        if (response.status === 200) {
          // Remove the deleted request from the state
          setTestRequests(prevRequests => 
            prevRequests.filter(request => request._id !== requestId)
          );
          alert('Test request deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting test request:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete test request';
        alert(errorMessage);
      }
    }
  };

  if (!user || (!user._id && !user.id)) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading test requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Test Requests
              </h1>
              <p className="text-slate-600">
                Manage and track all test requests from doctors
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {lastRefreshTime && (
            <p className="text-sm text-slate-500">
              Last updated: {lastRefreshTime.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="Sample_Collection_Scheduled">Sample Collection Scheduled</option>
              <option value="Sample_Collected">Sample Collected</option>
              <option value="In_Lab_Testing">In Lab Testing</option>
              <option value="Testing_Completed">Testing Completed</option>
              <option value="Report_Generated">Report Generated</option>
              <option value="Report_Sent">Report Sent</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Urgency</option>
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Normal">Normal</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setUrgencyFilter('All');
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-slate-600">
            Showing {filteredRequests.length} of {testRequests.length} test requests
          </p>
        </div>

        {/* Test Requests List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <Microscope className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No test requests found</h3>
              <p className="text-slate-600">
                {testRequests.length === 0 
                  ? "No test requests have been created yet." 
                  : "No test requests match your current filters."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredRequests.map((request) => (
                <div key={request._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status.replace(/_/g, ' ')}</span>
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                          {getUrgencyIcon(request.urgency)}
                          <span className="ml-1">{request.urgency}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">Patient</h3>
                          <p className="text-slate-600">{request.patientName}</p>
                          <p className="text-sm text-slate-500">{request.patientPhone}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">Doctor</h3>
                          <p className="text-slate-600">{request.doctorName}</p>
                          <p className="text-sm text-slate-500">{request.centerName}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">Test Type</h3>
                          <p className="text-slate-600">{request.testType}</p>
                          <p className="text-sm text-slate-500">{request.testDescription}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">Created</h3>
                          <p className="text-slate-600">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(request.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="mb-4">
                          <h3 className="font-semibold text-slate-900 mb-1">Notes</h3>
                          <p className="text-slate-600 text-sm">{request.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleViewDetails(request._id)}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request._id)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Update Status
                      </button>
                      {(request.status === 'Report_Generated' || request.status === 'Report_Sent' || request.status === 'Completed') && (
                        <>
                          <button
                            onClick={() => handleViewReport(request._id)}
                            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Report
                          </button>
                          <button
                            onClick={() => handleDownloadReport(request._id)}
                            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download Report
                          </button>
                        </>
                      )}
                      {(request.status === 'Pending' || request.status === 'Cancelled') && (
                        <button
                          onClick={() => handleDeleteRequest(request._id, request.patientName)}
                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 