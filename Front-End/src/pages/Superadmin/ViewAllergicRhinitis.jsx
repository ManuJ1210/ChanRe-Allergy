import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllergicRhinitisList } from '../../features/superadmin/superadminThunks';
import { ArrowLeft, Activity, Calendar, User, Building2, Printer, Eye } from 'lucide-react';

const ViewAllergicRhinitis = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allergicRhinitisList, loading, error } = useSelector(state => state.superadmin);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchAllergicRhinitisList(patientId));
    }
  }, [dispatch, patientId]);

  // Get the most recent record or first record if array
  const currentRecord = Array.isArray(allergicRhinitisList) && allergicRhinitisList.length > 0 
    ? allergicRhinitisList[0] 
    : allergicRhinitisList;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading allergic rhinitis record...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <Activity className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentRecord) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8">
            <div className="text-center">
              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No Allergic Rhinitis Record Found</h3>
              <p className="text-slate-500 mb-6">
                No allergic rhinitis assessment record found for this patient.
              </p>
              <button
                onClick={() => navigate('/superadmin/view-followup-patients')}
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/superadmin/view-followup-patients')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Allergic Rhinitis Assessment
              </h1>
              <p className="text-slate-600">
                Detailed assessment record for patient
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              Patient Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <User className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Patient Name</p>
                    <p>{currentRecord.patientId?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Center</p>
                    <p>{currentRecord.patientId?.centerId?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Assessment Date</p>
                    <p>{new Date(currentRecord.createdAt || currentRecord.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <User className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Assessed By</p>
                    <p>{currentRecord.updatedBy?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Details */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Assessment Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Symptoms */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-700 mb-3">Symptoms</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Sneezing</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${currentRecord.sneezing ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {currentRecord.sneezing ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Runny Nose</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${currentRecord.runnyNose ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {currentRecord.runnyNose ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Nasal Congestion</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${currentRecord.nasalCongestion ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {currentRecord.nasalCongestion ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Itchy Nose</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${currentRecord.itchyNose ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {currentRecord.itchyNose ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Itchy Eyes</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${currentRecord.itchyEyes ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {currentRecord.itchyEyes ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Severity */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-700 mb-3">Severity Assessment</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-600">Overall Severity</span>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentRecord.severity === 'Mild' ? 'bg-green-100 text-green-700' :
                        currentRecord.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                        currentRecord.severity === 'Severe' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {currentRecord.severity || 'Not specified'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Duration</span>
                    <p className="mt-1 text-slate-700">{currentRecord.duration || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Frequency</span>
                    <p className="mt-1 text-slate-700">{currentRecord.frequency || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Triggers */}
            {currentRecord.triggers && currentRecord.triggers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-slate-700 mb-3">Identified Triggers</h3>
                <div className="flex flex-wrap gap-2">
                  {currentRecord.triggers.map((trigger, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {currentRecord.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-slate-700 mb-3">Additional Notes</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 whitespace-pre-wrap">{currentRecord.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Show total records if multiple exist */}
        {Array.isArray(allergicRhinitisList) && allergicRhinitisList.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="text-blue-700 font-medium">Multiple Records Available</p>
                <p className="text-blue-600 text-sm">
                  This patient has {allergicRhinitisList.length} allergic rhinitis assessment records. 
                  Currently showing the most recent one.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllergicRhinitis; 