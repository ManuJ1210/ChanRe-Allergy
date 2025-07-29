import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API from '../../services/api';
import { FaCheckCircle, FaFileAlt, FaDownload, FaEye, FaCalendarAlt } from 'react-icons/fa';

export default function CompletedRequests() {
  const { user } = useSelector((state) => state.auth);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const userId = user._id || user.id;
      
      // Fetch all test requests for lab staff
      const response = await API.get(`/test-requests/lab-staff`);
      const data = response.data;
      
      setCompletedRequests(data);
      console.log('Completed Requests fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching completed requests:', error);
      setCompletedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleDownloadReport = async (requestId) => {
    try {
      const response = await API.get(`/test-requests/${requestId}/report`, {
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
      
      console.log('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
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

  const filteredRequests = completedRequests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.testResults.toLowerCase().includes(searchTerm.toLowerCase());
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
                    return new Date(req.completedDate) >= weekAgo;
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
                <option value="completed">Completed</option>
                <option value="normal">Normal Results</option>
                <option value="abnormal">Abnormal Results</option>
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
                      Completed Info
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
                          <div className="text-sm font-medium text-slate-900">{request.patientName}</div>
                          <div className="text-sm text-slate-500">{request.patientPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{request.testType}</div>
                          <div className="text-sm text-slate-500">{request.doctorName}</div>
                          <div className="text-xs text-slate-400">{request.centerName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getResultColor(request.testResults)}`}>
                            {request.testResults}
                          </span>
                          <div className="text-xs text-slate-500 mt-1">
                            By: {request.assignedLabStaffName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-slate-900">
                            {new Date(request.completedDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(request.completedDate).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                          >
                            <FaEye className="inline mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadReport(request._id)}
                            className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                          >
                            <FaDownload className="inline mr-1" />
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for viewing details */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-800">Test Request Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-3">Patient Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedRequest.patientName}</div>
                      <div><span className="font-medium">Phone:</span> {selectedRequest.patientPhone}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-3">Test Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Test Type:</span> {selectedRequest.testType}</div>
                      <div><span className="font-medium">Doctor:</span> {selectedRequest.doctorName}</div>
                      <div><span className="font-medium">Center:</span> {selectedRequest.centerName}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-slate-800 mb-3">Test Results</h4>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="mb-3">
                      <span className="font-medium">Result:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full border ${getResultColor(selectedRequest.testResults)}`}>
                        {selectedRequest.testResults}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Report:</span>
                      <p className="mt-1 text-sm text-slate-600">{selectedRequest.testReport}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-3">Completion Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Completed By:</span> {selectedRequest.assignedLabStaffName}</div>
                      <div><span className="font-medium">Date:</span> {new Date(selectedRequest.completedDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">Time:</span> {new Date(selectedRequest.completedDate).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  onClick={() => handleDownloadReport(selectedRequest._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  <FaDownload className="inline mr-2" />
                  Download Report
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 