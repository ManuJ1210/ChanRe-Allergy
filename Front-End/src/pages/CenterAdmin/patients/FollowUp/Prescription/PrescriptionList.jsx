import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PrescriptionList = ({ patientId: propPatientId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const patientId = propPatientId || params.patientId || params.id;
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/prescriptions?patientId=${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPrescriptions(res.data);
      } catch (err) {
        setError("Failed to fetch prescriptions");
      } finally {
        setLoading(false);
      }
    };
    if (patientId && patientId !== 'undefined') fetchPrescriptions();
  }, [patientId]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-blue-500 tracking-tight">Prescription</h2>
        <button
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-5 py-2 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all"
          onClick={() => navigate(`/CenterAdmin/patients/FollowUp/AddPrescription/${patientId}`)}
        >
          Add Prescription
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <table className="min-w-full text-sm border rounded-xl overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th className="border px-3 py-2 text-slate-700 font-semibold">Date</th>
              <th className="border px-3 py-2 text-slate-700 font-semibold">Visit</th>
              <th className="border px-3 py-2 text-slate-700 font-semibold">Patient Name</th>
              <th className="border px-3 py-2 text-slate-700 font-semibold">Updated By</th>
              <th className="border px-3 py-2 text-slate-700 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="text-center text-red-600 py-4">{error}</td></tr>
            ) : prescriptions.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-slate-400 py-4">No prescriptions found.</td></tr>
            ) : (
              prescriptions.map(p => (
                <tr key={p._id}>
                  <td className="border px-3 py-2">{p.date ? new Date(p.date).toLocaleDateString() : '-'}</td>
                  <td className="border px-3 py-2">{p.visit || '-'}</td>
                  <td className="border px-3 py-2">{p.patientId?.name || '-'}</td>
                  <td className="border px-3 py-2">{p.updatedBy?.name || '-'}</td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold"
                      onClick={() => navigate(`/CenterAdmin/patients/FollowUp/ViewPrescription/${p._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionList; 