import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import { Activity, Eye, ArrowLeft, Calendar, User, AlertCircle } from "lucide-react";

const FOLLOWUP_ENDPOINTS = [
  { type: "Allergic Rhinitis", url: "/allergic-rhinitis" },
  { type: "Atopic Dermatitis", url: "/atopic-dermatitis" },
  { type: "Allergic Conjunctivitis", url: "/allergic-conjunctivitis" },
  { type: "Allergic Bronchitis", url: "/allergic-bronchitis" },
  { type: "GPE", url: "/gpe" },
];

const typeToRoute = {
  "Allergic Rhinitis": (id) => `/Superadmin/ViewAllergicRhinitis/${id}`,
  "Atopic Dermatitis": (id) => `/Superadmin/ViewAtopicDermatitis/${id}`,
  "Allergic Conjunctivitis": (id) => `/Superadmin/ViewAllergicConjunctivitis/${id}`,
  "Allergic Bronchitis": (id) => `/Superadmin/ViewAllergicBronchitis/${id}`,
  "GPE": (id) => `/Superadmin/ViewGPE/${id}`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Patient Follow-ups
          </h1>
          <p className="text-slate-600">
            View all follow-up assessments for this patient
          </p>
        </div>

        {/* Follow-ups Table */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Follow-up Records
            </h2>
            <p className="text-slate-600 mt-1">
              Total: {records.length} records
            </p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading follow-ups...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            ) : records.length === 0 ? (
              <div className="p-8">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-slate-600 mb-2">No Follow-ups Found</h3>
                  <p className="text-slate-500">No follow-up records available for this patient.</p>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Updated By
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {records.map((rec, idx) => (
                    <tr key={rec._id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-slate-800">{rec.type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          {new Date(rec.updatedAt || rec.createdAt || rec.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <User className="h-4 w-4 text-blue-500" />
                          {rec.updatedBy?.name || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                            onClick={() => navigate(typeToRoute[rec.type](rec._id))}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 