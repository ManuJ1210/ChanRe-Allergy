import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewPrescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/prescriptions/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecord(res.data);
      } catch (err) {
        setError("Failed to fetch prescription");
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!record) return <div>No record found.</div>;

  const patient = record.patientId || {};
  const updatedBy = record.updatedBy || {};

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-100">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-500 tracking-tight">Prescription Details</h2>
      <div className="mb-6 p-4 bg-blue-50 rounded-xl flex flex-wrap gap-6">
        <div><span className="font-semibold">Patient Name:</span> {patient.name || '-'}</div>
        <div><span className="font-semibold">Patient Id:</span> {patient._id || '-'}</div>
        <div><span className="font-semibold">Updated By:</span> {updatedBy.name || '-'}</div>
        <div><span className="font-semibold">Date:</span> {record.date ? new Date(record.date).toLocaleDateString() : '-'}</div>
        <div><span className="font-semibold">Visit:</span> {record.visit || '-'}</div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-blue-700">Medications</h3>
        <table className="min-w-full text-sm border rounded-xl overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th className="border px-3 py-2 text-slate-700 font-semibold">Drug Name</th>
              <th className="border px-3 py-2 text-slate-700 font-semibold">Dose</th>
              <th className="border px-3 py-2 text-slate-700 font-semibold">Duration</th>
              <th className="border px-3 py-2 text-slate-700 font-semibold">Instructions</th>
            </tr>
          </thead>
          <tbody>
            {record.medications && record.medications.length > 0 ? (
              record.medications.map((med, idx) => (
                <tr key={idx}>
                  <td className="border px-3 py-2">{med.medicationName || '-'}</td>
                  <td className="border px-3 py-2">{med.dosage || '-'}</td>
                  <td className="border px-3 py-2">{med.duration || '-'}</td>
                  <td className="border px-3 py-2">{med.instructions || '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center text-slate-400 py-3">No medications found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ViewPrescription; 