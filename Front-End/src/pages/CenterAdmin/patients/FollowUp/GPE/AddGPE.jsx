import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddGPE = ({ patientId: propPatientId, onSuccess, onCancel }) => {
  const params = useParams();
  const navigate = useNavigate();
  const patientId = propPatientId || params.patientId || params.id;
  const [form, setForm] = useState({
    weight: "",
    pulse: "",
    bp: "",
    rr: "",
    temp: "",
    spo2: "",
    entExamination: "",
    cns: "",
    cvs: "",
    rs: "",
    pa: "",
    drugAdverseNotion: "",
    drugCompliance: "",
    followUpAdvice: "",
    eyeMedication: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/gpe",
        { patientId, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => {
        navigate(`/CenterAdmin/patients/FollowUp/${patientId}`);
      }, 1000);
    } catch (err) {
      setError("Failed to add record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-700">GPE</h2>
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="font-semibold block mb-1">Weight</label>
          <input type="text" name="weight" className="border rounded px-3 py-2 w-full" value={form.weight} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-1">Pulse</label>
          <input type="text" name="pulse" className="border rounded px-3 py-2 w-full" value={form.pulse} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-1">Bp</label>
          <input type="text" name="bp" className="border rounded px-3 py-2 w-full" value={form.bp} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-1">RR</label>
          <input type="text" name="rr" className="border rounded px-3 py-2 w-full" value={form.rr} onChange={handleChange} />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="font-semibold block mb-1">Temp</label>
          <input type="text" name="temp" className="border rounded px-3 py-2 w-full" value={form.temp} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-1">SPO₂%</label>
          <input type="text" name="spo2" className="border rounded px-3 py-2 w-full" value={form.spo2} onChange={handleChange} />
        </div>
      </div>
      <div className="mb-4">
        <label className="font-semibold block mb-1">ENT Examination</label>
        <input type="text" name="entExamination" className="border rounded px-3 py-2 w-full" value={form.entExamination} onChange={handleChange} />
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Systematic Examination</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="font-semibold block mb-1">CNS</label>
            <input type="text" name="cns" className="border rounded px-3 py-2 w-full" value={form.cns} onChange={handleChange} />
          </div>
          <div>
            <label className="font-semibold block mb-1">CVS</label>
            <input type="text" name="cvs" className="border rounded px-3 py-2 w-full" value={form.cvs} onChange={handleChange} />
          </div>
          <div>
            <label className="font-semibold block mb-1">RS</label>
            <input type="text" name="rs" className="border rounded px-3 py-2 w-full" value={form.rs} onChange={handleChange} />
          </div>
          <div>
            <label className="font-semibold block mb-1">P/A</label>
            <input type="text" name="pa" className="border rounded px-3 py-2 w-full" value={form.pa} onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold block mb-1">Drug Adverse Notion</label>
          <input type="text" name="drugAdverseNotion" className="border rounded px-3 py-2 w-full" value={form.drugAdverseNotion} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-1">Drug Compliance</label>
          <input type="text" name="drugCompliance" className="border rounded px-3 py-2 w-full" value={form.drugCompliance} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-1">Advise to be followed up till next visit</label>
          <input type="text" name="followUpAdvice" className="border rounded px-3 py-2 w-full" value={form.followUpAdvice} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-1">Eye Medication</label>
          <input type="text" name="eyeMedication" className="border rounded px-3 py-2 w-full" value={form.eyeMedication} onChange={handleChange} />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-700 text-white px-8 py-2 rounded hover:bg-blue-800 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      {success && <div className="text-green-600 mt-2">Record added successfully!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default AddGPE; 