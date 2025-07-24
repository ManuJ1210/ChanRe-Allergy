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
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">GPE Details</h2>
      <div className="mb-4 p-4 bg-blue-50 rounded flex flex-wrap gap-6">
        <div><span className="font-semibold">Name:</span> {patient.name || '-'}</div>
        <div><span className="font-semibold">Age:</span> {patient.age || '-'}</div>
        <div><span className="font-semibold">Gender:</span> {patient.gender || '-'}</div>
        <div><span className="font-semibold">Center Code:</span> {patient.centerCode || '-'}</div>
        <div><span className="font-semibold">Phone:</span> {patient.phone || '-'}</div>
      </div>
      <div className="mb-4 flex flex-wrap gap-6 items-center">
        <div><span className="font-semibold">Weight:</span> {record.weight || '-'}</div>
        <div><span className="font-semibold">Pulse:</span> {record.pulse || '-'}</div>
        <div><span className="font-semibold">Bp:</span> {record.bp || '-'}</div>
        <div><span className="font-semibold">RR:</span> {record.rr || '-'}</div>
        <div><span className="font-semibold">Temp:</span> {record.temp || '-'}</div>
        <div><span className="font-semibold">SPO₂%:</span> {record.spo2 || '-'}</div>
      </div>
      <div className="mb-4"><span className="font-semibold">ENT Examination:</span> {record.entExamination || '-'}</div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Systematic Examination</h3>
        <div className="flex flex-wrap gap-6 items-center">
          <div><span className="font-semibold">CNS:</span> {record.cns || '-'}</div>
          <div><span className="font-semibold">CVS:</span> {record.cvs || '-'}</div>
          <div><span className="font-semibold">RS:</span> {record.rs || '-'}</div>
          <div><span className="font-semibold">P/A:</span> {record.pa || '-'}</div>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-6 items-center">
        <div><span className="font-semibold">Drug Adverse Notion:</span> {record.drugAdverseNotion || '-'}</div>
        <div><span className="font-semibold">Drug Compliance:</span> {record.drugCompliance || '-'}</div>
        <div><span className="font-semibold">Advise to be followed up till next visit:</span> {record.followUpAdvice || '-'}</div>
        <div><span className="font-semibold">Eye Medication:</span> {record.eyeMedication || '-'}</div>
      </div>
      <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ViewGPE; 