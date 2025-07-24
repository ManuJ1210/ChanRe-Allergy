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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
        Add Medication
      </h2>
      {showAlert && success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded relative flex items-center justify-between">
          <span>Medication added successfully!</span>
          <button onClick={() => setShowAlert(false)} className="ml-4 text-lg font-bold">×</button>
        </div>
      )}
      {showAlert && error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded relative flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setShowAlert(false)} className="ml-4 text-lg font-bold">×</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Drug Name</label>
          <input
            type="text"
            name="drugName"
            value={form.drugName}
            onChange={handleChange}
            placeholder="Enter drug name.."
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Dose</label>
          <input
            type="text"
            name="dose"
            value={form.dose}
            onChange={handleChange}
            placeholder="Enter dose.."
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Duration</label>
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Enter duration.."
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Adverse event and any reason to stop</label>
          <textarea
            name="adverseEvent"
            value={form.adverseEvent}
            onChange={handleChange}
            placeholder="Enter details.."
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Add Medication"}
        </button>
      </form>
    </div>
  );
};

export default AddMedications; 