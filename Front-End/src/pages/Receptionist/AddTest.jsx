import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import ReceptionistLayout from './ReceptionistLayout';

const testFields = [
  "CBC", "Hb", "TC", "DC", "Neutrophils", "Eosinophil", "Lymphocytes",
  "Monocytes", "Platelets", "ESR", "Serum Creatinine", "Serum IgE Levels",
  "C3, C4 Levels", "ANA (IF)", "Urine Routine", "Allergy Panel"
];

const AddTest = () => {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (testName, value) => {
    setReports((prev) => ({ ...prev, [testName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    const filledReports = Object.fromEntries(
      Object.entries(reports).filter(([_, val]) => val && val.trim() !== "")
    );
    if (Object.keys(filledReports).length === 0) {
      setError("Please fill in at least one test report.");
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await API.post(`/patients/${patientId}/tests`, filledReports, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setReports({});
      setTimeout(() => navigate("/receptionist/patients"), 1000);
    } catch (err) {
      setError("Failed to submit test reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReceptionistLayout>
      <div className="p-4 sm:p-8 md:p-10 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <h2 className="text-3xl font-extrabold text-blue-500 mb-10 text-center tracking-tight">Add Test</h2>
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 md:p-10 border border-blue-100 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="overflow-x-auto">
              <table className="w-full text-left rounded-xl overflow-hidden align-middle min-w-[500px]">
                <thead>
                  <tr className="bg-blue-50 text-blue-700 uppercase text-base">
                    <th className="py-3 px-4 w-1/2">Screening Test</th>
                    <th className="py-3 px-4 w-1/2">Reports</th>
                  </tr>
                </thead>
                <tbody>
                  {testFields.map((test, index) => (
                    <tr key={index} className="border-b border-blue-100 even:bg-blue-50 align-middle">
                      <td className="py-3 px-4 text-slate-700 font-medium align-middle">{test}</td>
                      <td className="py-3 px-4 align-middle">
                        <input
                          type="text"
                          placeholder="Write here..."
                          className="w-full border border-blue-100 rounded-xl px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-slate-700 align-middle"
                          value={reports[test] || ""}
                          onChange={(e) => handleChange(test, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {error && <div className="mb-4 bg-red-50 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl">{error}</div>}
            {success && <div className="mb-4 bg-blue-50 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl">Test reports submitted successfully!</div>}
            <div className="mt-8 text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-3 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
        {/* Future: Investigation Table */}
        <div className="mt-12 bg-white shadow-xl p-6 rounded-2xl border border-blue-100 max-w-4xl mx-auto overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Investigation</h3>
          <table className="w-full text-base rounded-xl overflow-hidden min-w-[500px]">
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
    </ReceptionistLayout>
  );
};

export default AddTest;
