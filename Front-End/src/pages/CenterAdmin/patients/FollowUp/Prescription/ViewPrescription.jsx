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
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Prescription Details</h2>
      <div className="mb-4 p-4 bg-blue-50 rounded flex flex-wrap gap-6">
        <div><span className="font-semibold">Patient Name:</span> {patient.name || '-'}</div>
        <div><span className="font-semibold">Patient Id:</span> {patient._id || '-'}</div>
        <div><span className="font-semibold">Updated By:</span> {updatedBy.name || '-'}</div>
        <div><span className="font-semibold">Date:</span> {record.date ? new Date(record.date).toLocaleDateString() : '-'}</div>
        <div><span className="font-semibold">Visit:</span> {record.visit || '-'}</div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Medications</h3>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Drug Name</th>
              <th className="border px-2 py-1">Dose</th>
              <th className="border px-2 py-1">Duration</th>
              <th className="border px-2 py-1">Instructions</th>
            </tr>
          </thead>
          <tbody>
            {record.medications && record.medications.length > 0 ? (
              record.medications.map((med, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{med.medicationName || '-'}</td>
                  <td className="border px-2 py-1">{med.dosage || '-'}</td>
                  <td className="border px-2 py-1">{med.duration || '-'}</td>
                  <td className="border px-2 py-1">{med.instructions || '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center text-gray-400 py-2">No medications found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ViewPrescription; 