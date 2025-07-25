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
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-100">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-500 text-center tracking-tight">Allergic Conjunctivitis Details</h2>
      <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100 flex flex-wrap gap-8">
        <div><span className="font-semibold text-slate-700">Name:</span> {patient.name || '-'}</div>
        <div><span className="font-semibold text-slate-700">Age:</span> {patient.age || '-'}</div>
        <div><span className="font-semibold text-slate-700">Gender:</span> {patient.gender || '-'}</div>
        <div><span className="font-semibold text-slate-700">Center Code:</span> {patient.centerCode || '-'}</div>
        <div><span className="font-semibold text-slate-700">Phone:</span> {patient.phone || '-'}</div>
      </div>
      <div className="mb-6">
        <span className="font-semibold text-slate-700">Symptoms:</span> <span className="text-slate-500">{Array.isArray(record.symptoms) ? record.symptoms.join(", ") : record.symptoms || '-'}</span>
      </div>
      <div className="mb-6">
        <span className="font-semibold text-slate-700">Type:</span> <span className="text-slate-500">{record.type || '-'}</span>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-blue-700">Grading</h3>
        <ul className="list-disc pl-6 text-slate-500">
          {grading && Object.keys(grading).length > 0 ? (
            Object.entries(grading).map(([q, v]) => (
              <li key={q}><span className="font-semibold text-slate-700">{q}:</span> {v}</li>
            ))
          ) : (
            <li>-</li>
          )}
        </ul>
      </div>
      <div className="flex justify-center">
        <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-2 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default ViewAllergicConjunctivitis; 