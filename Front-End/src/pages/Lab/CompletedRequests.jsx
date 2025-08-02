import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { FaCheckCircle, FaFileAlt, FaDownload, FaEye, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function CompletedRequests() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && (user._id || user.id)) {
      fetchCompletedRequests();
    } else if (user && !user._id && !user.id) {
      setLoading(false);
    }
  }, [user]);

  const fetchCompletedRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all test requests for lab staff
      const response = await API.get(`/test-requests/lab-staff`);
      const data = response.data;
      
      // Filter for completed requests only
      const completedData = data.filter(request => 
        ['Testing_Completed', 'Report_Generated', 'Report_Sent', 'Completed'].includes(request.status)
      );
      
      setCompletedRequests(completedData);
    } catch (error) {
      console.error('Error fetching completed requests:', error);
      setError('Failed to load completed requests');
      setCompletedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (requestId) => {
    navigate(`/dashboard/lab/test-request/${requestId}`);
  };

  const handleDownloadReport = async (requestId) => {
    try {
      const response = await API.get(`/test-requests/${requestId}/download-report`, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `test-report-${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report');
    }
  };

  const getResultColor = (result) => {
    if (!result) return 'text-gray-600 bg-gray-50 border-gray-200';
    
    if (result.toLowerCase().includes('normal') || result.toLowerCase().includes('negative')) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else if (result.toLowerCase().includes('positive')) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Testing_Completed': return 'bg-teal-100 text-teal-800';
      case 'Report_Generated': return 'bg-cyan-100 text-cyan-800';
      case 'Report_Sent': return 'bg-emerald-100 text-emerald-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = completedRequests.filter(request => {
    const matchesSearch = 
      (request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (request.testType?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (request.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (request.testResults?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Completed Test Requests</h1>
          <p className="text-slate-600">View and manage completed test results</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Completed</p>
                <p className="text-2xl font-bold text-slate-800">{completedRequests.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">This Week</p>
                <p className="text-2xl font-bold text-blue-600">
                  {completedRequests.filter(req => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(req.completedDate || req.updatedAt) >= weekAgo;
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaCalendarAlt className="text-blue-500 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Normal Results</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedRequests.filter(req => 
                    req.testResults && (
                      req.testResults.toLowerCase().includes('normal') || 
                      req.testResults.toLowerCase().includes('negative')
                    )
                  ).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Abnormal Results</p>
                <p className="text-2xl font-bold text-red-600">
                  {completedRequests.filter(req => 
                    req.testResults && (
                      req.testResults.toLowerCase().includes('positive') || 
                      req.testResults.toLowerCase().includes('abnormal')
                    )
                  ).length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <FaFileAlt className="text-red-500 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by patient name, test type, doctor, or results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Results</option>
                <option value="Testing_Completed">Testing Completed</option>
                <option value="Report_Generated">Report Generated</option>
                <option value="Report_Sent">Report Sent</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading completed requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FaCheckCircle className="text-slate-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Completed Requests</h3>
            <p className="text-slate-500">No test requests have been completed yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Patient Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Test Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Results
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{request.patientName || 'N/A'}</div>
                          <div className="text-sm text-slate-500">{request.patientPhone || 'N/A'}</div>
                          <div className="text-xs text-slate-400">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{request.testType || 'N/A'}</div>
                          <div className="text-sm text-slate-500">{request.doctorName || 'N/A'}</div>
                          <div className="text-xs text-slate-400">{request.centerName || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getResultColor(request.testResults)}`}>
                            {request.testResults || 'Pending'}
                          </span>
                          {request.completedDate && (
                            <div className="text-xs text-slate-400 mt-1">
                              {new Date(request.completedDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status?.replace(/_/g, ' ') || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(request._id)}
                            className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                          >
                            <FaEye className="inline mr-1" />
                            View
                          </button>
                          {request.status === 'Report_Generated' || request.status === 'Report_Sent' || request.status === 'Completed' ? (
                            <button
                              onClick={() => handleDownloadReport(request._id)}
                              className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                            >
                              <FaDownload className="inline mr-1" />
                              Download
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 