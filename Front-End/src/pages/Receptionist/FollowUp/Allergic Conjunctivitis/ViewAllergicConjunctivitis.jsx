import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAllergicConjunctivitis = () => {
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
          `http://localhost:5000/api/allergic-conjunctivitis/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecord(res.data);
      } catch (err) {
        setError("Failed to fetch record");
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
  const grading = record.grading || {};

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Allergic Conjunctivitis Details</h2>
      <div className="mb-4 p-4 bg-blue-50 rounded flex flex-wrap gap-6">
        <div><span className="font-semibold">Name:</span> {patient.name || '-'}</div>
        <div><span className="font-semibold">Age:</span> {patient.age || '-'}</div>
        <div><span className="font-semibold">Gender:</span> {patient.gender || '-'}</div>
        <div><span className="font-semibold">Center Code:</span> {patient.centerCode || '-'}</div>
        <div><span className="font-semibold">Phone:</span> {patient.phone || '-'}</div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Symptoms:</span> {Array.isArray(record.symptoms) ? record.symptoms.join(", ") : record.symptoms || '-'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Type:</span> {record.type || '-'}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Grading</h3>
        <ul className="list-disc pl-6">
          {grading && Object.keys(grading).length > 0 ? (
            Object.entries(grading).map(([q, v]) => (
              <li key={q}><span className="font-semibold">{q}:</span> {v}</li>
            ))
          ) : (
            <li>-</li>
          )}
        </ul>
      </div>
      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ViewAllergicConjunctivitis; 