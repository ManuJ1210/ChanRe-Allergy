import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import ReceptionistLayout from './ReceptionistLayout';

export default function PatientHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [id]);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/history/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setHistory(res.data);
    } catch (err) {
      setError("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReceptionistLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Patient History</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : history.length === 0 ? (
          <div>No history records found.</div>
        ) : (
          <div className="space-y-6">
            {history.map((h, idx) => (
              <div key={h._id || idx} className="bg-white rounded-xl shadow p-6">
                <div className="mb-2 text-gray-500 text-xs">{h.createdAt ? new Date(h.createdAt).toLocaleString() : ""}</div>
                <div className="mb-2 font-semibold text-blue-700">Section One (Conditions):</div>
                <pre className="bg-blue-50 rounded p-2 text-xs">{JSON.stringify(h.sectionOne, null, 2)}</pre>
                <div className="mb-2 font-semibold text-blue-700">Section Two:</div>
                <pre className="bg-blue-50 rounded p-2 text-xs">{JSON.stringify(h.sectionTwo, null, 2)}</pre>
                <div className="mb-2 font-semibold text-blue-700">Section Three:</div>
                <pre className="bg-blue-50 rounded p-2 text-xs">{JSON.stringify(h.sectionThree, null, 2)}</pre>
                <div className="mb-2 font-semibold text-blue-700">Section Four:</div>
                <pre className="bg-blue-50 rounded p-2 text-xs">{JSON.stringify(h.sectionFour, null, 2)}</pre>
                <div className="mb-2 font-semibold text-blue-700">Section Five:</div>
                <pre className="bg-blue-50 rounded p-2 text-xs">{JSON.stringify(h.sectionFive, null, 2)}</pre>
                <div className="mb-2 font-semibold text-blue-700">Section Six:</div>
                <pre className="bg-blue-50 rounded p-2 text-xs">{JSON.stringify(h.sectionSix, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </ReceptionistLayout>
  );
} 