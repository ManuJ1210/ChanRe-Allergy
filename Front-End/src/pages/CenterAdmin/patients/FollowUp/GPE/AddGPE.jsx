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
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto border border-blue-100">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-500 tracking-tight">GPE</h2>
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="font-semibold block mb-2 text-slate-700">Weight</label>
          <input type="text" name="weight" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.weight} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-slate-700">Pulse</label>
          <input type="text" name="pulse" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.pulse} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-slate-700">Bp</label>
          <input type="text" name="bp" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.bp} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-slate-700">RR</label>
          <input type="text" name="rr" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.rr} onChange={handleChange} />
        </div>
      </div>
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="font-semibold block mb-2 text-slate-700">Temp</label>
          <input type="text" name="temp" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.temp} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-slate-700">SPO 082%</label>
          <input type="text" name="spo2" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.spo2} onChange={handleChange} />
        </div>
      </div>
      <div className="mb-8">
        <label className="font-semibold block mb-2 text-slate-700">ENT Examination</label>
        <input type="text" name="entExamination" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.entExamination} onChange={handleChange} />
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-blue-700">Systematic Examination</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="font-semibold block mb-2 text-slate-700">CNS</label>
            <input type="text" name="cns" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.cns} onChange={handleChange} />
          </div>
          <div>
            <label className="font-semibold block mb-2 text-slate-700">CVS</label>
            <input type="text" name="cvs" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.cvs} onChange={handleChange} />
          </div>
          <div>
            <label className="font-semibold block mb-2 text-slate-700">RS</label>
            <input type="text" name="rs" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.rs} onChange={handleChange} />
          </div>
          <div>
            <label className="font-semibold block mb-2 text-slate-700">P/A</label>
            <input type="text" name="pa" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.pa} onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold block mb-2 text-slate-700">Drug Adverse Notion</label>
          <input type="text" name="drugAdverseNotion" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.drugAdverseNotion} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-slate-700">Drug Compliance</label>
          <input type="text" name="drugCompliance" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.drugCompliance} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-slate-700">Advise to be followed up till next visit</label>
          <input type="text" name="followUpAdvice" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.followUpAdvice} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold block mb-2 text-slate-700">Eye Medication</label>
          <input type="text" name="eyeMedication" className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300" value={form.eyeMedication} onChange={handleChange} />
        </div>
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-3 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all disabled:opacity-60"
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