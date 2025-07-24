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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Prescription</h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => navigate(`/CenterAdmin/patients/FollowUp/AddPrescription/${patientId}`)}
        >
          Add Prescription
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Visit</th>
              <th className="border px-2 py-1">Patient Name</th>
              <th className="border px-2 py-1">Updated By</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="text-center text-red-600 py-4">{error}</td></tr>
            ) : prescriptions.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-gray-400 py-4">No prescriptions found.</td></tr>
            ) : (
              prescriptions.map(p => (
                <tr key={p._id}>
                  <td className="border px-2 py-1">{p.date ? new Date(p.date).toLocaleDateString() : '-'}</td>
                  <td className="border px-2 py-1">{p.visit || '-'}</td>
                  <td className="border px-2 py-1">{p.patientId?.name || '-'}</td>
                  <td className="border px-2 py-1">{p.updatedBy?.name || '-'}</td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
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