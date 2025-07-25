import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitPatientTests } from "../../../features/patient/patientThunks"; // ✅ Correct import
import { resetPatientState } from "../../../features/patient/patientSlice";

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

    dispatch(submitPatientTests({ patientId, testData: filledReports })); // ✅ Correct usage
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
    <div className="p-8 bg-blue-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-blue-500 mb-8 text-center tracking-tight">Add Test</h2>
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-100">
        <form onSubmit={handleSubmit}>
          <table className="w-full text-left rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-blue-700 uppercase text-sm">
                <th className="py-3 px-4 w-1/2">Screening Test</th>
                <th className="py-3 px-4 w-1/2">Reports</th>
              </tr>
            </thead>
            <tbody>
              {testFields.map((test, index) => (
                <tr key={index} className="border-b border-blue-100 even:bg-blue-50">
                  <td className="py-3 px-4 text-slate-700 font-medium">{test}</td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      placeholder="Write here..."
                      className="w-full border border-blue-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
                      value={reports[test] || ""}
                      onChange={(e) => handleChange(test, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8 text-right">
            <button
              type="submit"
              disabled={testSubmitting}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-3 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all disabled:opacity-60"
            >
              {testSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      {/* Future: Investigation Table */}
      <div className="mt-12 bg-white shadow-xl p-6 rounded-2xl border border-blue-100">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Investigation</h3>
        <table className="w-full text-sm rounded-xl overflow-hidden">
          <thead className="bg-blue-50 text-blue-700 uppercase">
            <tr>
              <th className="px-3 py-2">Date</th>
              {testFields.map((t, i) => (
                <th key={i} className="px-3 py-2">{t}</th>
              ))}
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Test history display can go here in the future */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddTest;
