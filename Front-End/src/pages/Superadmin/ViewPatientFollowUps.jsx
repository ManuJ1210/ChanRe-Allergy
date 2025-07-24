import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

const FOLLOWUP_ENDPOINTS = [
  { type: "Allergic Rhinitis", url: "/allergic-rhinitis" },
  { type: "Atopic Dermatitis", url: "/atopic-dermatitis" },
  { type: "Allergic Conjunctivitis", url: "/allergic-conjunctivitis" },
  { type: "Allergic Bronchitis", url: "/allergic-bronchitis" },
  { type: "GPE", url: "/gpe" },
];

const typeToRoute = {
  "Allergic Rhinitis": (id) => `/CenterAdmin/patients/FollowUp/ViewAllergicRhinitis/${id}`,
  "Atopic Dermatitis": (id) => `/CenterAdmin/patients/FollowUp/ViewAtopicDermatitis/${id}`,
  "Allergic Conjunctivitis": (id) => `/CenterAdmin/patients/FollowUp/ViewAllergicConjunctivitis/${id}`,
  "Allergic Bronchitis": (id) => `/CenterAdmin/patients/FollowUp/ViewAllergicBronchitis/${id}`,
  "GPE": (id) => `/CenterAdmin/patients/FollowUp/ViewGPE/${id}`,
};

export default function ViewPatientFollowUps() {
  const { id: patientId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const all = await Promise.all(
          FOLLOWUP_ENDPOINTS.map(async ({ type, url }) => {
            const res = await API.get(`${url}?patientId=${patientId}`, { headers });
            return res.data.map((r) => ({ ...r, type }));
          })
        );
        // Flatten and sort by date
        const merged = all.flat().sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        setRecords(merged);
      } catch (err) {
        setError("Failed to fetch follow-ups");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [patientId]);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">All Follow-ups for Patient</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Updated By</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr key={rec._id || idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{rec.type}</td>
                  <td className="px-4 py-2">{new Date(rec.updatedAt || rec.createdAt || rec.date).toLocaleString()}</td>
                  <td className="px-4 py-2">{rec.updatedBy?.name || "-"}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                      onClick={() => navigate(typeToRoute[rec.type](rec._id))}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-400">
                    No follow-ups found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 