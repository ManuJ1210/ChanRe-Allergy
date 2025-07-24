import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function SuperadminAllergicConjunctivitisList() {
  const { patientId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/allergic-conjunctivitis?patientId=${patientId}`, { headers: { Authorization: `Bearer ${token}` } });
        setRecords(res.data);
      } catch (err) {
        setError("Failed to fetch records");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [patientId]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Allergic Conjunctivitis Records</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : records.length === 0 ? (
        <div>No records found.</div>
      ) : (
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Updated By</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id} className="border-b hover:bg-blue-50">
                <td className="px-4 py-2">{new Date(rec.updatedAt || rec.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{rec.updatedBy?.name || '-'}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                    onClick={() => navigate(`/CenterAdmin/patients/FollowUp/ViewAllergicConjunctivitis/${rec._id}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 