import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, User, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../../../services/api";

const ViewHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/history/${patientId}`);
        setHistory(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load history details');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchHistory();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading history details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!history) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">History not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patient Profile
          </button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Medical History Details
          </h1>
          <p className="text-slate-600">
            Complete medical history and examination records
          </p>
        </div>

        {/* History Details */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              History Information
            </h2>
            <div className="flex items-center gap-2 text-sm text-blue-500 mt-2">
              <Calendar className="h-4 w-4" />
              {history.createdAt ? new Date(history.createdAt).toLocaleDateString() : "N/A"}
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Medical Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                Medical Conditions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.hayFever && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Hay Fever:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.hayFever}</span>
                  </div>
                )}
                {history.asthma && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Asthma:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.asthma}</span>
                  </div>
                )}
                {history.breathingProblems && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Breathing Problems:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.breathingProblems}</span>
                  </div>
                )}
                {history.hivesSwelling && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Hives/Swelling:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.hivesSwelling}</span>
                  </div>
                )}
                {history.sinusTrouble && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Sinus Trouble:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.sinusTrouble}</span>
                  </div>
                )}
                {history.eczemaRashes && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Eczema/Rashes:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.eczemaRashes}</span>
                  </div>
                )}
                {history.foodAllergies && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Food Allergies:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.foodAllergies}</span>
                  </div>
                )}
                {history.drugAllergy && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Drug Allergy:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.drugAllergy}</span>
                  </div>
                )}
                {history.arthriticDiseases && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Arthritic Diseases:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.arthriticDiseases}</span>
                  </div>
                )}
                {history.immuneDefect && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Immune Defect:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.immuneDefect}</span>
                  </div>
                )}
                {history.beeStingHypersensitivity && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Bee Sting Hypersensitivity:</span>
                    <span className="text-sm text-slate-800 font-medium">{history.beeStingHypersensitivity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hay Fever Details */}
            {(history.feverGrade || history.itchingSoreThroat || history.specificDayExposure) && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                  Hay Fever Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {history.feverGrade && (
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Fever Grade:</span>
                      <span className="text-sm text-slate-800 font-medium">{history.feverGrade}</span>
                    </div>
                  )}
                  {history.itchingSoreThroat && (
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Itching/Sore Throat:</span>
                      <span className="text-sm text-slate-800 font-medium">{history.itchingSoreThroat}</span>
                    </div>
                  )}
                  {history.specificDayExposure && (
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Specific Day Exposure:</span>
                      <span className="text-sm text-slate-800 font-medium">{history.specificDayExposure}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Asthma Details */}
            {(history.asthmaType || history.exacerbationsFrequency) && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                  Asthma Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {history.asthmaType && (
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Asthma Type:</span>
                      <span className="text-sm text-slate-800 font-medium">{history.asthmaType}</span>
                    </div>
                  )}
                  {history.exacerbationsFrequency && (
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Exacerbations Frequency:</span>
                      <span className="text-sm text-slate-800 font-medium">{history.exacerbationsFrequency}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {history.additionalNotes && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                  Additional Notes
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-slate-700">{history.additionalNotes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHistory; 