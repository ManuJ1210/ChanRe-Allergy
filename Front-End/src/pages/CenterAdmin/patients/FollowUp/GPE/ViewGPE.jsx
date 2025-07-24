import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewGPE = () => {
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
          `http://localhost:5000/api/gpe/${id}`,
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

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-100">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-500 tracking-tight">GPE Details</h2>
      <div className="mb-8 p-4 bg-blue-50 rounded-xl flex flex-wrap gap-6 border border-blue-100">
        <div><span className="font-semibold">Name:</span> {patient.name || '-'}</div>
        <div><span className="font-semibold">Age:</span> {patient.age || '-'}</div>
        <div><span className="font-semibold">Gender:</span> {patient.gender || '-'}</div>
        <div><span className="font-semibold">Center Code:</span> {patient.centerCode || '-'}</div>
        <div><span className="font-semibold">Phone:</span> {patient.phone || '-'}</div>
      </div>
      <div className="mb-6 flex flex-wrap gap-6 items-center">
        <div><span className="font-semibold text-blue-700">Weight:</span> {record.weight || '-'}</div>
        <div><span className="font-semibold text-blue-700">Pulse:</span> {record.pulse || '-'}</div>
        <div><span className="font-semibold text-blue-700">Bp:</span> {record.bp || '-'}</div>
        <div><span className="font-semibold text-blue-700">RR:</span> {record.rr || '-'}</div>
        <div><span className="font-semibold text-blue-700">Temp:</span> {record.temp || '-'}</div>
        <div><span className="font-semibold text-blue-700">SPO 2%:</span> {record.spo2 || '-'}</div>
      </div>
      <div className="mb-6"><span className="font-semibold text-blue-700">ENT Examination:</span> {record.entExamination || '-'}</div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-blue-700">Systematic Examination</h3>
        <div className="flex flex-wrap gap-6 items-center">
          <div><span className="font-semibold">CNS:</span> {record.cns || '-'}</div>
          <div><span className="font-semibold">CVS:</span> {record.cvs || '-'}</div>
          <div><span className="font-semibold">RS:</span> {record.rs || '-'}</div>
          <div><span className="font-semibold">P/A:</span> {record.pa || '-'}</div>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-6 items-center">
        <div><span className="font-semibold text-blue-700">Drug Adverse Notion:</span> {record.drugAdverseNotion || '-'}</div>
        <div><span className="font-semibold text-blue-700">Drug Compliance:</span> {record.drugCompliance || '-'}</div>
        <div><span className="font-semibold text-blue-700">Advise to be followed up till next visit:</span> {record.followUpAdvice || '-'}</div>
        <div><span className="font-semibold text-blue-700">Eye Medication:</span> {record.eyeMedication || '-'}</div>
      </div>
      <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-2 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ViewGPE; 