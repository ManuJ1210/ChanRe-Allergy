import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Eye, 
  MessageSquare, 
  FileText, 
  User, 
  Calendar,
  Send,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { 
  fetchSuperAdminDoctorLabReports,
  sendFeedbackToCenterDoctor,
  clearError,
  clearSuccess 
} from '../../../features/superadmin/superAdminDoctorSlice';

const ReviewLabReports = () => {
  const dispatch = useDispatch();
  const { labReports, workingLoading, workingError, success, message } = useSelector(
    (state) => state.superAdminDoctors
  );

  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState({
    additionalTests: '',
    patientInstructions: '',
    notes: ''
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSuperAdminDoctorLabReports());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleReviewReport = (report) => {
    console.log('Setting selected report:', report);
    setSelectedReport(report);
    setShowFeedbackModal(true);
  };

  const handleSendFeedback = async () => {
    console.log('handleSendFeedback called, selectedReport:', selectedReport);
    
    if (!selectedReport || !selectedReport._id) {
      console.error('No selected report or missing report ID');
      return;
    }

    try {
      const feedbackData = {
        reportId: selectedReport._id,
        patientId: selectedReport.patientId?._id || selectedReport.patientId,
        centerDoctorId: selectedReport.doctorId?._id || selectedReport.doctorId,
        additionalTests: feedback.additionalTests,
        patientInstructions: feedback.patientInstructions,
        notes: feedback.notes
      };

      const result = await dispatch(sendFeedbackToCenterDoctor(feedbackData));
      
      if (sendFeedbackToCenterDoctor.fulfilled.match(result)) {
        setShowFeedbackModal(false);
        setSelectedReport(null);
        setFeedback({
          additionalTests: '',
          patientInstructions: '',
          notes: ''
        });
        // Refresh the lab reports to show updated status
        dispatch(fetchSuperAdminDoctorLabReports());
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'feedback_sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending_review':
        return <Clock className="w-4 h-4" />;
      case 'feedback_sent':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (workingLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (workingError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {workingError}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Review Lab Reports</h1>
        <p className="text-gray-600">
          Review completed lab reports and provide feedback to center admin doctors
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-green-700">{message}</span>
        </div>
      )}

      {workingError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <span className="text-red-700">{workingError}</span>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Lab Reports</h2>
        </div>
        <div className="p-6">
          {labReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No lab reports available for review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {labReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {report.patientId?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {report.patientId?.age || 'N/A'} years
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{report.testType || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{report.testDescription || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Dr. {report.doctorId?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.centerName || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {report.completedDate || report.reportGeneratedDate || report.updatedAt ? 
                              new Date(report.completedDate || report.reportGeneratedDate || report.updatedAt).toLocaleDateString() 
                              : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">
                            {report.status === 'completed' && 'Completed'}
                            {report.status === 'pending_review' && 'Pending Review'}
                            {report.status === 'feedback_sent' && 'Feedback Sent'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleReviewReport(report)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Review Lab Report - {selectedReport.patientId?.name || 'N/A'}
              </h3>
            </div>
            
            <div className="p-6">
              {/* Report Details */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Report Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-medium">{selectedReport.patientId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Test Type</p>
                    <p className="font-medium">{selectedReport.testType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requested By</p>
                    <p className="font-medium">Dr. {selectedReport.doctorId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Center</p>
                    <p className="font-medium">{selectedReport.centerName || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Report Results */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Test Results</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Results Summary:</p>
                      <p className="text-sm text-gray-800">{selectedReport.results || 'No results available'}</p>
                    </div>
                    {selectedReport.reportSummary && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Report Summary:</p>
                        <p className="text-sm text-gray-800">{selectedReport.reportSummary}</p>
                      </div>
                    )}
                    {selectedReport.clinicalInterpretation && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Clinical Interpretation:</p>
                        <p className="text-sm text-gray-800">{selectedReport.clinicalInterpretation}</p>
                      </div>
                    )}
                    {selectedReport.conclusion && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Conclusion:</p>
                        <p className="text-sm text-gray-800">{selectedReport.conclusion}</p>
                      </div>
                    )}
                    {selectedReport.recommendations && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">{selectedReport.recommendations}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback Form */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Provide Feedback</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Tests Recommended
                    </label>
                    <textarea
                      value={feedback.additionalTests}
                      onChange={(e) => setFeedback(prev => ({ ...prev, additionalTests: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Recommend any additional tests that should be performed..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Instructions
                    </label>
                    <textarea
                      value={feedback.patientInstructions}
                      onChange={(e) => setFeedback(prev => ({ ...prev, patientInstructions: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Provide specific instructions for the patient..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={feedback.notes}
                      onChange={(e) => setFeedback(prev => ({ ...prev, notes: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any additional notes or observations..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFeedback}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewLabReports;


