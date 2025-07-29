import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../../services/api';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Phone, 
  MapPin,
  Calendar,
  FileText,
  Microscope,
  Download,
  Edit
} from 'lucide-react';

export default function TestRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [testRequest, setTestRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTestRequestDetails();
    }
  }, [id]);

  const fetchTestRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/test-requests/${id}`);
      setTestRequest(response.data);
    } catch (error) {
      console.error('Error fetching test request details:', error);
      setError('Failed to load test request details');
    } finally {
      setLoading(false);
    }
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
        return <FileText className="h-4 w-4" />;
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

  const handleUpdateStatus = () => {
    navigate(`/lab/update-status/${id}`);
  };

  const handleScheduleCollection = () => {
    navigate(`/lab/schedule-collection/${id}`);
  };

  const handleStartTesting = () => {
    navigate(`/lab/start-testing/${id}`);
  };

  const handleCompleteTesting = () => {
    navigate(`/lab/complete-testing/${id}`);
  };

  const handleGenerateReport = () => {
    navigate(`/lab/generate-report/${id}`);
  };

  const handleDownloadReport = async () => {
    try {
      const response = await API.get(`/test-requests/${id}/report`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `test-report-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading test request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !testRequest) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Test Request</h3>
            <p className="text-slate-600">{error || 'Test request not found'}</p>
            <button
              onClick={() => navigate('/lab/test-requests')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Test Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/lab/test-requests')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Test Requests
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Test Request Details
              </h1>
              <p className="text-slate-600">
                Request ID: {testRequest._id}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleUpdateStatus}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Status and Urgency */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(testRequest.status)}`}>
              {getStatusIcon(testRequest.status)}
              <span className="ml-1">{testRequest.status.replace(/_/g, ' ')}</span>
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(testRequest.urgency)}`}>
              {testRequest.urgency}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Test Information</h3>
              <p><strong>Test Type:</strong> {testRequest.testType}</p>
              <p><strong>Description:</strong> {testRequest.testDescription}</p>
              <p><strong>Created:</strong> {new Date(testRequest.createdAt).toLocaleString()}</p>
              {testRequest.updatedAt && (
                <p><strong>Last Updated:</strong> {new Date(testRequest.updatedAt).toLocaleString()}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
              <p className="text-slate-600">
                {testRequest.notes || 'No notes provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-500" />
            Patient Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {testRequest.patientName}</p>
              <p><strong>Phone:</strong> {testRequest.patientPhone}</p>
            </div>
            <div>
              <p><strong>Address:</strong> {testRequest.patientAddress}</p>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-green-500" />
            Doctor Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {testRequest.doctorName}</p>
              <p><strong>Center:</strong> {testRequest.centerName} ({testRequest.centerCode})</p>
            </div>
          </div>
        </div>

        {/* Lab Workflow Information */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <Microscope className="h-5 w-5 mr-2 text-purple-500" />
            Lab Workflow
          </h3>
          
          {/* Assigned Lab Staff */}
          {testRequest.assignedLabStaffName && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Assigned Lab Staff</h4>
              <p>{testRequest.assignedLabStaffName}</p>
            </div>
          )}

          {/* Sample Collection */}
          {testRequest.sampleCollectorName && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Sample Collection</h4>
              <p><strong>Collector:</strong> {testRequest.sampleCollectorName}</p>
              {testRequest.sampleCollectionScheduledDate && (
                <p><strong>Scheduled:</strong> {new Date(testRequest.sampleCollectionScheduledDate).toLocaleString()}</p>
              )}
              {testRequest.sampleCollectionActualDate && (
                <p><strong>Collected:</strong> {new Date(testRequest.sampleCollectionActualDate).toLocaleString()}</p>
              )}
              {testRequest.sampleCollectionNotes && (
                <p><strong>Notes:</strong> {testRequest.sampleCollectionNotes}</p>
              )}
            </div>
          )}

          {/* Lab Testing */}
          {testRequest.labTechnicianName && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Lab Testing</h4>
              <p><strong>Technician:</strong> {testRequest.labTechnicianName}</p>
              {testRequest.testingStartDate && (
                <p><strong>Started:</strong> {new Date(testRequest.testingStartDate).toLocaleString()}</p>
              )}
              {testRequest.testingEndDate && (
                <p><strong>Completed:</strong> {new Date(testRequest.testingEndDate).toLocaleString()}</p>
              )}
              {testRequest.testingNotes && (
                <p><strong>Notes:</strong> {testRequest.testingNotes}</p>
              )}
            </div>
          )}

          {/* Test Results */}
          {testRequest.testResults && testRequest.testResults !== 'Pending' && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Test Results</h4>
              <p><strong>Result:</strong> {testRequest.testResults}</p>
              {testRequest.resultDetails && (
                <p><strong>Details:</strong> {testRequest.resultDetails}</p>
              )}
            </div>
          )}

          {/* Report Information */}
          {testRequest.reportGeneratedByName && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Report</h4>
              <p><strong>Generated by:</strong> {testRequest.reportGeneratedByName}</p>
              {testRequest.reportGeneratedDate && (
                <p><strong>Generated:</strong> {new Date(testRequest.reportGeneratedDate).toLocaleString()}</p>
              )}
              {testRequest.reportNotes && (
                <p><strong>Notes:</strong> {testRequest.reportNotes}</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-3">
            {testRequest.status === 'Pending' && (
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign to Lab Staff
              </button>
            )}
            
            {testRequest.status === 'Assigned' && (
              <button
                onClick={handleScheduleCollection}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Schedule Sample Collection
              </button>
            )}
            
            {testRequest.status === 'Sample_Collected' && (
              <button
                onClick={handleStartTesting}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Start Lab Testing
              </button>
            )}
            
            {testRequest.status === 'In_Lab_Testing' && (
              <button
                onClick={handleCompleteTesting}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Complete Testing
              </button>
            )}
            
            {testRequest.status === 'Testing_Completed' && (
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Generate Report
              </button>
            )}
            
            {testRequest.reportFile && (
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 