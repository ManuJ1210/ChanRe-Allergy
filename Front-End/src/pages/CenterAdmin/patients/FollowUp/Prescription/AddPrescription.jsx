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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Add Medication</h2>
      <div className="mb-4">
        <label className="font-semibold block mb-1">Visit</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={visit}
          onChange={e => setVisit(e.target.value)}
          placeholder="Select"
        />
      </div>
      <div className="mb-4 space-y-4">
        {medications.map((med, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 shadow-sm w-full">
            <input
              type="text"
              className="border rounded px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter drug name.."
              value={med.medicationName}
              onChange={e => handleMedicationChange(idx, "medicationName", e.target.value)}
            />
            <input
              type="text"
              className="border rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter dose.."
              value={med.dosage}
              onChange={e => handleMedicationChange(idx, "dosage", e.target.value)}
            />
            <input
              type="text"
              className="border rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter duration.."
              value={med.duration}
              onChange={e => handleMedicationChange(idx, "duration", e.target.value)}
            />
            <input
              type="text"
              className="border rounded px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter instruction.."
              value={med.instructions}
              onChange={e => handleMedicationChange(idx, "instructions", e.target.value)}
            />
            <div className="flex-1" />
            {idx === medications.length - 1 && (
              <button
                type="button"
                className="bg-teal-500 text-white rounded-full hover:bg-teal-600 text-2xl flex items-center justify-center ml-2"
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
        className="bg-blue-700 text-white px-8 py-2 rounded hover:bg-blue-800 disabled:opacity-60 mt-4"
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