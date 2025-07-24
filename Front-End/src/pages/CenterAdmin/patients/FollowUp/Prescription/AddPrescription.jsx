import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddPrescription = ({ patientId: propPatientId, onSuccess, onCancel }) => {
  const params = useParams();
  const navigate = useNavigate();
  const patientId = params.patientId || propPatientId || params.id;
  const [visit, setVisit] = useState("");
  const [medications, setMedications] = useState([
    { medicationName: "", dosage: "", duration: "", instructions: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleMedicationChange = (idx, field, value) => {
    setMedications(meds => meds.map((med, i) => i === idx ? { ...med, [field]: value } : med));
  };

  const addMedicationRow = () => {
    setMedications(meds => [...meds, { medicationName: "", dosage: "", duration: "", instructions: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || patientId === 'undefined') {
      alert('No valid patientId! Please check the URL and navigation.');
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/prescriptions",
        { patientId, visit, medications },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => {
        navigate(`/CenterAdmin/patients/FollowUp/PrescriptionList/${patientId}`);
      }, 1000);
    } catch (err) {
      setError("Failed to add prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto border border-blue-100">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-500 tracking-tight">Add Medication</h2>
      <div className="mb-6">
        <label className="font-semibold block mb-2 text-slate-700">Visit</label>
        <input
          type="text"
          className="border border-blue-100 rounded-xl px-4 py-3 w-48 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-slate-700"
          value={visit}
          onChange={e => setVisit(e.target.value)}
          placeholder="Select"
        />
      </div>
      <div className="mb-6 space-y-4">
        {medications.map((med, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-blue-50 rounded-xl p-4 shadow-sm w-full">
            <input
              type="text"
              className="border border-blue-100 rounded-xl px-4 py-3 w-56 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700"
              placeholder="Enter drug name.."
              value={med.medicationName}
              onChange={e => handleMedicationChange(idx, "medicationName", e.target.value)}
            />
            <input
              type="text"
              className="border border-blue-100 rounded-xl px-4 py-3 w-40 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700"
              placeholder="Enter dose.."
              value={med.dosage}
              onChange={e => handleMedicationChange(idx, "dosage", e.target.value)}
            />
            <input
              type="text"
              className="border border-blue-100 rounded-xl px-4 py-3 w-40 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700"
              placeholder="Enter duration.."
              value={med.duration}
              onChange={e => handleMedicationChange(idx, "duration", e.target.value)}
            />
            <input
              type="text"
              className="border border-blue-100 rounded-xl px-4 py-3 w-56 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700"
              placeholder="Enter instruction.."
              value={med.instructions}
              onChange={e => handleMedicationChange(idx, "instructions", e.target.value)}
            />
            <div className="flex-1" />
            {idx === medications.length - 1 && (
              <button
                type="button"
                className="bg-blue-500 text-white rounded-full hover:bg-blue-600 text-2xl flex items-center justify-center ml-2 shadow"
                onClick={addMedicationRow}
                title="Add another medication"
                style={{ minWidth: 44, minHeight: 44, height: 44, width: 44 }}
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-3 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all disabled:opacity-60 mt-6"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      {success && <div className="text-green-600 mt-2">Prescription added successfully!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default AddPrescription; 