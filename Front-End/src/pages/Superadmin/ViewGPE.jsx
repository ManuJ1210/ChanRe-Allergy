import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGPEList } from '../../features/superadmin/superadminThunks';
import { ArrowLeft, Activity, Calendar, User, Building2, Printer, Eye } from 'lucide-react';

const ViewGPE = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { gpeList, loading, error } = useSelector(state => state.superadmin);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchGPEList(patientId));
    }
  }, [dispatch, patientId]);

  // Get the most recent record or first record if array
  const currentRecord = Array.isArray(gpeList) && gpeList.length > 0 
    ? gpeList[0] 
    : gpeList;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading GPE record...</p>
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
              <h3 className="text-lg font-medium text-slate-600 mb-2">No GPE Record Found</h3>
              <p className="text-slate-500 mb-6">
                No GPE (General Physical Examination) record found for this patient.
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
                GPE (General Physical Examination)
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

        {/* Vital Signs */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Vital Signs
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Weight</h3>
                <p className="text-slate-900">{currentRecord.weight || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Pulse</h3>
                <p className="text-slate-900">{currentRecord.pulse || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Blood Pressure</h3>
                <p className="text-slate-900">{currentRecord.bp || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Respiratory Rate</h3>
                <p className="text-slate-900">{currentRecord.rr || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Temperature</h3>
                <p className="text-slate-900">{currentRecord.temp || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">SpO2</h3>
                <p className="text-slate-900">{currentRecord.spo2 || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Examination */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Physical Examination
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">ENT Examination</h3>
                <p className="text-slate-900">{currentRecord.entExamination || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">CNS</h3>
                <p className="text-slate-900">{currentRecord.cns || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">CVS</h3>
                <p className="text-slate-900">{currentRecord.cvs || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Respiratory System</h3>
                <p className="text-slate-900">{currentRecord.rs || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Per Abdomen</h3>
                <p className="text-slate-900">{currentRecord.pa || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medications & Advice */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Medications & Advice
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Drug Adverse Notion</h3>
                <p className="text-slate-900">{currentRecord.drugAdverseNotion || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Drug Compliance</h3>
                <p className="text-slate-900">{currentRecord.drugCompliance || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Follow-up Advice</h3>
                <p className="text-slate-900">{currentRecord.followUpAdvice || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Eye Medication</h3>
                <p className="text-slate-900">{currentRecord.eyeMedication || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGPE; 