import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API from '../../services/api';
import { FaClock, FaExclamationTriangle, FaEye, FaCheckCircle } from 'react-icons/fa';

export default function PendingRequests() {
  const { user } = useSelector((state) => state.auth);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user && (user._id || user.id)) {
      fetchPendingRequests();
    } else if (user && !user._id && !user.id) {
      setLoading(false);
    }
  }, [user]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const userId = user._id || user.id;
      
      // Fetch all test requests for lab staff
      const response = await API.get(`/test-requests/lab-staff`);
      const data = response.data;
      
      setPendingRequests(data);
      console.log('Pending Requests fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async (requestId) => {
    try {
      const userId = user._id || user.id;
      const response = await API.put(`/test-requests/${requestId}/assign`, {
        assignedLabStaffId: userId,
        assignedLabStaffName: user.staffName
      });
      
      // Refresh the pending requests list
      fetchPendingRequests();
      console.log('Request assigned successfully:', response.data);
    } catch (error) {
      console.error('Error assigning request:', error);
    }
  };

  const handleStartCollection = async (requestId) => {
    try {
      const response = await API.put(`/test-requests/${requestId}/status`, {
        status: 'collection_in_progress'
      });
      
      // Refresh the pending requests list
      fetchPendingRequests();
      console.log('Sample collection started:', response.data);
    } catch (error) {
      console.error('Error starting collection:', error);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200';
      case 'urgent': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'emergency': return <FaExclamationTriangle className="text-red-500" />;
      case 'urgent': return <FaClock className="text-orange-500" />;
      case 'normal': return <FaCheckCircle className="text-green-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const filteredRequests = pendingRequests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Pending Test Requests</h1>
          <p className="text-slate-600">Manage and process pending test requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Pending</p>
                <p className="text-2xl font-bold text-slate-800">{pendingRequests.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaClock className="text-blue-500 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {pendingRequests.filter(req => req.urgency === 'Emergency' || req.urgency === 'Urgent').length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <FaExclamationTriangle className="text-red-500 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Assigned to Me</p>
                <p className="text-2xl font-bold text-blue-600">
                  {pendingRequests.filter(req => req.assignedLabStaffId === (user._id || user.id)).length}
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
                <p className="text-sm font-medium text-slate-600">Today's Requests</p>
                <p className="text-2xl font-bold text-slate-800">
                  {pendingRequests.filter(req => {
                    const today = new Date().toDateString();
                    const requestDate = new Date(req.requestedDate).toDateString();
                    return today === requestDate;
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FaClock className="text-purple-500 text-xl" />
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
                placeholder="Search by patient name, test type, or doctor..."
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
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="collection_in_progress">Collection in Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading pending requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FaClock className="text-slate-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Pending Requests</h3>
            <p className="text-slate-500">All test requests have been processed or there are no new requests.</p>
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
                      Request Info
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
                          <div className="text-sm font-medium text-slate-900">{request.patientName}</div>
                          <div className="text-sm text-slate-500">{request.patientPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{request.testType}</div>
                          <div className="flex items-center mt-1">
                            {getUrgencyIcon(request.urgency)}
                                            <span className={`ml-2 text-xs px-2 py-1 rounded-full border ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency}
                </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-slate-900">{request.doctorName}</div>
                          <div className="text-sm text-slate-500">{request.centerName}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(request.requestedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : request.status === 'assigned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAssignToMe(request._id)}
                            disabled={request.assignedLabStaffId === (user._id || user.id)}
                            className={`px-3 py-1 text-xs font-medium rounded-md ${
                              request.assignedLabStaffId === (user._id || user.id)
                                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                          >
                            {request.assignedLabStaffId === (user._id || user.id) ? 'Assigned' : 'Assign to Me'}
                          </button>
                          {request.assignedLabStaffId === (user._id || user.id) && (
                            <button
                              onClick={() => handleStartCollection(request._id)}
                              className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                            >
                              Start Collection
                            </button>
                          )}
                          <button className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200">
                            <FaEye className="inline mr-1" />
                            View
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
      </div>
    </div>
  );
} 