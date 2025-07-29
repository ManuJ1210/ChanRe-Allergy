import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllergicConjunctivitisList } from '../../features/superadmin/superadminThunks';
import { ArrowLeft, Activity, Calendar, User, Building2, Printer, Eye } from 'lucide-react';

const ViewAllergicConjunctivitis = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allergicConjunctivitisList, loading, error } = useSelector(state => state.superadmin);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchAllergicConjunctivitisList(patientId));
    }
  }, [dispatch, patientId]);

  // Get the most recent record or first record if array
  const currentRecord = Array.isArray(allergicConjunctivitisList) && allergicConjunctivitisList.length > 0 
    ? allergicConjunctivitisList[0] 
    : allergicConjunctivitisList;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading allergic conjunctivitis record...</p>
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
              <h3 className="text-lg font-medium text-slate-600 mb-2">No Allergic Conjunctivitis Record Found</h3>
              <p className="text-slate-500 mb-6">
                No allergic conjunctivitis assessment record found for this patient.
              </p>
              <button
                onClick={() => navigate('/superadmin/follow-up/view')}
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
            onClick={() => navigate('/superadmin/follow-up/view')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Follow-up Patients
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Allergic Conjunctivitis Assessment
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
              Print Record
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
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Patient Name</h3>
                <p className="text-slate-900">{currentRecord.patientId?.name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Center Code</h3>
                <p className="text-slate-900">{currentRecord.patientId?.centerCode || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Assessment Date</h3>
                <p className="text-slate-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  {currentRecord.createdAt ? new Date(currentRecord.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Updated By</h3>
                <p className="text-slate-900">{currentRecord.updatedBy?.name || 'N/A'}</p>
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
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Symptoms</h3>
                <p className="text-slate-900">{currentRecord.symptoms || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Eye Examination</h3>
                <p className="text-slate-900">{currentRecord.eyeExamination || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Itching Score</h3>
                <p className="text-slate-900">{currentRecord.itching || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Redness Score</h3>
                <p className="text-slate-900">{currentRecord.redness || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Swelling Score</h3>
                <p className="text-slate-900">{currentRecord.swelling || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Discharge Score</h3>
                <p className="text-slate-900">{currentRecord.discharge || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Eye Medications</h3>
                <p className="text-slate-900">{currentRecord.eyeMedication || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Other Medications</h3>
                <p className="text-slate-900">{currentRecord.otherMedications || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Follow-up Advice</h3>
                <p className="text-slate-900">{currentRecord.followUpAdvice || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllergicConjunctivitis; 