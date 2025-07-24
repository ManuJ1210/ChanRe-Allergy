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
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Test</h2>
        <div className="bg-white shadow rounded-lg p-6 overflow-auto">
          <form onSubmit={handleSubmit}>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <th className="py-2 px-4 w-1/2">Screening Test</th>
                  <th className="py-2 px-4 w-1/2">Reports</th>
                </tr>
              </thead>
              <tbody>
                {testFields.map((test, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-4">{test}</td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        placeholder="Write here..."
                        className="w-full border rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                        value={reports[test] || ""}
                        onChange={(e) => handleChange(test, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">Test reports submitted successfully!</div>}
            <div className="mt-6 text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
        {/* Future: Investigation Table */}
        <div className="mt-10 bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Investigation</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="px-2 py-1">Date</th>
                {testFields.map((t, i) => (
                  <th key={i} className="px-2 py-1">{t}</th>
                ))}
                <th className="px-2 py-1">Action</th>
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
