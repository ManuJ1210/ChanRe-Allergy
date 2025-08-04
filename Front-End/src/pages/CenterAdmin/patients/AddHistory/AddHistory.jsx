import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPatientHistory } from '../../../../features/centerAdmin/centerAdminThunks';
import { resetCenterAdminState } from '../../../../features/centerAdmin/centerAdminSlice';
import { FileText, ArrowLeft, Save, History, CheckCircle } from 'lucide-react';

const AddHistory = () => {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, addHistorySuccess } = useSelector((state) => state.centerAdmin);

  const [formData, setFormData] = useState({
    chiefComplaint: "",
    presentIllness: "",
    pastMedicalHistory: "",
    familyHistory: "",
    socialHistory: "",
    allergies: "",
    currentMedications: "",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: ""
    },
    physicalExamination: "",
    diagnosis: "",
    treatmentPlan: "",
    patientId: patientId,
  });

  useEffect(() => {
    if (addHistorySuccess) {
      setTimeout(() => {
        dispatch(resetCenterAdminState());
        navigate('/dashboard/CenterAdmin/patients/PatientList');
      }, 1500);
    }
  }, [addHistorySuccess, dispatch, navigate]);

  // Simple fallback to test if component is rendering
  if (!patientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-800 mb-2">Error: No Patient ID</h1>
          <p className="text-red-600">Patient ID is missing from URL parameters.</p>
          <button
                         onClick={() => navigate('/dashboard/CenterAdmin/patients/PatientList')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Back to Patients List
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVitalSignChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(addPatientHistory(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/CenterAdmin/patients/PatientList')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients List
          </button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Add Patient History
          </h1>
          <p className="text-slate-600">
            Enter medical history for patient ID: {patientId}
          </p>
        </div>

        {/* Alert Messages */}
        {addHistorySuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-700">Patient history added successfully!</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <History className="h-5 w-5 mr-2 text-blue-500" />
              Medical History Information
            </h2>
            <p className="text-slate-600 mt-1">
              Fill in the patient's medical history details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Chief Complaint */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Chief Complaint *
              </label>
              <textarea
                name="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter the main reason for the visit"
              />
            </div>

            {/* Present Illness */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Present Illness *
              </label>
              <textarea
                name="presentIllness"
                value={formData.presentIllness}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Describe the current illness or symptoms"
              />
            </div>

            {/* Past Medical History */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Past Medical History
              </label>
              <textarea
                name="pastMedicalHistory"
                value={formData.pastMedicalHistory}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Previous medical conditions, surgeries, etc."
              />
            </div>

            {/* Family History */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Family History
              </label>
              <textarea
                name="familyHistory"
                value={formData.familyHistory}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Family medical history"
              />
            </div>

            {/* Social History */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Social History
              </label>
              <textarea
                name="socialHistory"
                value={formData.socialHistory}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Lifestyle, occupation, habits, etc."
              />
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Allergies
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Known allergies (drugs, food, environmental)"
              />
            </div>

            {/* Current Medications */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Medications
              </label>
              <textarea
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="List current medications and dosages"
              />
            </div>

            {/* Vital Signs */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Vital Signs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    value={formData.vitalSigns.bloodPressure}
                    onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., 120/80 mmHg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Heart Rate
                  </label>
                  <input
                    type="text"
                    value={formData.vitalSigns.heartRate}
                    onChange={(e) => handleVitalSignChange('heartRate', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., 72 bpm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Temperature
                  </label>
                  <input
                    type="text"
                    value={formData.vitalSigns.temperature}
                    onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., 98.6°F"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Respiratory Rate
                  </label>
                  <input
                    type="text"
                    value={formData.vitalSigns.respiratoryRate}
                    onChange={(e) => handleVitalSignChange('respiratoryRate', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., 16/min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Oxygen Saturation
                  </label>
                  <input
                    type="text"
                    value={formData.vitalSigns.oxygenSaturation}
                    onChange={(e) => handleVitalSignChange('oxygenSaturation', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., 98%"
                  />
                </div>
              </div>
            </div>

            {/* Physical Examination */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Physical Examination
              </label>
              <textarea
                name="physicalExamination"
                value={formData.physicalExamination}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Physical examination findings"
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Diagnosis
              </label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Clinical diagnosis"
              />
            </div>

            {/* Treatment Plan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Treatment Plan
              </label>
              <textarea
                name="treatmentPlan"
                value={formData.treatmentPlan}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Recommended treatment plan"
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard/CenterAdmin/patients/PatientList')}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding History...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Patient History
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHistory; 