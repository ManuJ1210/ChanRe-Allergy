import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitPatientTests } from "../../../features/patient/patientThunks";
import { resetPatientState } from "../../../features/patient/patientSlice";
import { FileText, ArrowLeft, Save, FlaskConical } from 'lucide-react';

const testFields = [
  "CBC", "Hb", "TC", "DC", "Neutrophils", "Eosinophil", "Lymphocytes",
  "Monocytes", "Platelets", "ESR", "Serum Creatinine", "Serum IgE Levels",
  "C3, C4 Levels", "ANA (IF)", "Urine Routine", "Allergy Panel"
];

const AddTest = () => {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [reports, setReports] = useState({});

  const {
    testSubmitting,
    testSubmitSuccess,
    testSubmitError,
  } = useSelector((state) => state.patient);

  const handleChange = (testName, value) => {
    setReports((prev) => ({ ...prev, [testName]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filledReports = Object.fromEntries(
      Object.entries(reports).filter(([_, val]) => val && val.trim() !== "")
    );

    if (Object.keys(filledReports).length === 0) {
      alert("Please fill in at least one test report.");
      return;
    }

    dispatch(submitPatientTests({ patientId, testData: filledReports }));
  };

  useEffect(() => {
    if (testSubmitSuccess) {
      alert("Test reports submitted successfully!");
      dispatch(resetPatientState());
      navigate("/CenterAdmin/patients/PatientList");
    }
  }, [testSubmitSuccess, dispatch, navigate]);

  useEffect(() => {
    if (testSubmitError) {
      alert(testSubmitError);
    }
  }, [testSubmitError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/CenterAdmin/patients/PatientList')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients List
          </button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Add Test Reports
          </h1>
          <p className="text-slate-600">
            Add laboratory test results for patient
          </p>
        </div>

        {/* Test Form */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-8">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Laboratory Test Reports
            </h2>
            <p className="text-slate-600 mt-1">
              Fill in the test results for the patient
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Screening Test
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Test Results
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {testFields.map((test, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">{test}</div>
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="text"
                          placeholder="Enter test result..."
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                          value={reports[test] || ""}
                          onChange={(e) => handleChange(test, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={testSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {testSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting Tests...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Submit Test Reports
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Investigation History */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center">
              <FlaskConical className="h-5 w-5 mr-2 text-blue-500" />
              Investigation History
            </h3>
            <p className="text-slate-600 mt-1">
              Previous test results and investigations
            </p>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    {testFields.slice(0, 5).map((test, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {test}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-4 text-sm text-slate-500" colSpan={7}>
                      <div className="text-center py-8">
                        <FlaskConical className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-500">No previous test history available</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTest;
