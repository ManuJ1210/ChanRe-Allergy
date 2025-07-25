import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AddMedications = () => {
  // Support both :id and :patientId route params for robustness
  const params = useParams();
  const patientId = params.patientId || params.id;
  const [form, setForm] = useState({
    drugName: "",
    dose: "",
    duration: "",
    adverseEvent: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    setShowAlert(false);
    try {
      const token = localStorage.getItem("token");
      const payload = { ...form, patientId };
      console.log("Submitting medication:", payload);
      await axios.post(
        "http://localhost:5000/api/medications",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setShowAlert(true);
      setForm({ drugName: "", dose: "", duration: "", adverseEvent: "" });
    } catch (err) {
      setError("Failed to add medication");
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl mt-12 border border-blue-100">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-500 flex items-center gap-2 tracking-tight">
        Add Medication
      </h2>
      {showAlert && success && (
        <div className="mb-6 bg-blue-50 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl flex items-center justify-between">
          <span>Medication added successfully!</span>
          <button onClick={() => setShowAlert(false)} className="ml-4 text-lg font-bold">×</button>
        </div>
      )}
      {showAlert && error && (
        <div className="mb-6 bg-red-50 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setShowAlert(false)} className="ml-4 text-lg font-bold">×</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2 text-slate-700">Drug Name</label>
          <input
            type="text"
            name="drugName"
            value={form.drugName}
            onChange={handleChange}
            placeholder="Enter drug name.."
            className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2 text-slate-700">Dose</label>
          <input
            type="text"
            name="dose"
            value={form.dose}
            onChange={handleChange}
            placeholder="Enter dose.."
            className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2 text-slate-700">Duration</label>
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Enter duration.."
            className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2 text-slate-700">Adverse event and any reason to stop</label>
          <textarea
            name="adverseEvent"
            value={form.adverseEvent}
            onChange={handleChange}
            placeholder="Enter details.."
            className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-3 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Add Medication"}
        </button>
      </form>
    </div>
  );
};

export default AddMedications; 