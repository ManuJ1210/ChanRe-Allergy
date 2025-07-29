import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createReceptionistPatientHistory } from "../../../features/receptionist/receptionistThunks";
import { resetReceptionistState } from "../../../features/receptionist/receptionistSlice";
import ReceptionistLayout from '../ReceptionistLayout';
import { FileText, Save, ArrowLeft, CheckCircle } from "lucide-react";

export default function AddHistory() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, addHistorySuccess } = useSelector((state) => state.receptionist);
  
  const [formData, setFormData] = useState({
    medicalHistory: "",
    familyHistory: "",
    socialHistory: "",
    allergies: "",
    currentMedications: "",
    patient: patientId,
  });

  React.useEffect(() => {
    if (addHistorySuccess) {
      setTimeout(() => {
        dispatch(resetReceptionistState());
        navigate(`/receptionist/profile/${patientId}`);
      }, 1500);
    }
  }, [addHistorySuccess, dispatch, navigate, patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createReceptionistPatientHistory(formData));
  };

  return (
    <ReceptionistLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/receptionist/profile/${patientId}`)}
              className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patient
            </button>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Add Medical History
            </h1>
            <p className="text-slate-600">
              Record medical history for the patient
            </p>
          </div>

          {/* Alert Messages */}
          {addHistorySuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-green-700">Medical history added successfully!</span>
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
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Medical History Information
              </h2>
              <p className="text-slate-600 mt-1">
                Fill in the medical history details below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Medical History
                </label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter medical history"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Family History
                </label>
                <textarea
                  name="familyHistory"
                  value={formData.familyHistory}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter family history"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Social History
                </label>
                <textarea
                  name="socialHistory"
                  value={formData.socialHistory}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter social history"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter allergies"
                />
              </div>

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
                  placeholder="Enter current medications"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(`/receptionist/profile/${patientId}`)}
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
                      Add History
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
}
