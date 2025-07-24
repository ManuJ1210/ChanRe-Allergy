import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const NASAL_SYMPTOMS = [
  "Sneezing",
  "Running Nose",
  "Congestion",
  "Itchy Nose",
  "Post Nasal Drop",
  "Total Nasal Symptoms"
];
const NON_NASAL_SYMPTOMS = [
  "Eye Symptoms",
  "Throat Symptoms",
  "Chronic Symptoms",
  "Ear Symptoms",
  "Headache",
  "Mental Function",
  "Total"
];

const AddAllergicRhinitis = ({ patientId: propPatientId, onSuccess, onCancel }) => {
  const params = useParams();
  const navigate = useNavigate();
  const patientId = propPatientId || params.patientId || params.id;
  const [nasalSymptoms, setNasalSymptoms] = useState({});
  const [nonNasalSymptoms, setNonNasalSymptoms] = useState({});
  const [qualityOfLife, setQualityOfLife] = useState(0);
  const [medications, setMedications] = useState({ nonNasal: "", nasal: "", antihistamine: "", other: "" });
  const [entExamination, setEntExamination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSlider = (symptom, value, isNasal) => {
    if (isNasal) {
      setNasalSymptoms(prev => ({ ...prev, [symptom]: value }));
    } else {
      setNonNasalSymptoms(prev => ({ ...prev, [symptom]: value }));
    }
  };

  const handleMedications = (field, value) => {
    setMedications(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/allergic-rhinitis",
        { patientId, nasalSymptoms, nonNasalSymptoms, qualityOfLife, medications, entExamination },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      alert("Submitted!");
      navigate(`/CenterAdmin/patients/FollowUp/${patientId}`);
      window.location.reload();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to add record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto border border-blue-100">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-500 tracking-tight">ALLERGIC RHINITIS</h2>
      <div className="mb-8">
        <h3 className="font-semibold mb-3 text-blue-700">Nasal Symptom Severity</h3>
        {NASAL_SYMPTOMS.map(symptom => (
          <div key={symptom} className="mb-4 flex items-center gap-4">
            <label className="w-56 text-slate-700 font-medium">{symptom}</label>
            <input
              type="range"
              min={0}
              max={7}
              value={nasalSymptoms[symptom] || 0}
              onChange={e => handleSlider(symptom, Number(e.target.value), true)}
              className="flex-1 accent-blue-500"
            />
            <span className="ml-2 text-blue-700 font-semibold">Value: {nasalSymptoms[symptom] || 0}</span>
          </div>
        ))}
      </div>
      <div className="mb-8">
        <h3 className="font-semibold mb-3 text-blue-700">Non Nasal Symptom Severity</h3>
        {NON_NASAL_SYMPTOMS.map(symptom => (
          <div key={symptom} className="mb-4 flex items-center gap-4">
            <label className="w-56 text-slate-700 font-medium">{symptom}</label>
            <input
              type="range"
              min={0}
              max={7}
              value={nonNasalSymptoms[symptom] || 0}
              onChange={e => handleSlider(symptom, Number(e.target.value), false)}
              className="flex-1 accent-blue-500"
            />
            <span className="ml-2 text-blue-700 font-semibold">Value: {nonNasalSymptoms[symptom] || 0}</span>
          </div>
        ))}
      </div>
      <div className="mb-8">
        <h3 className="font-semibold mb-3 text-blue-700">Quality of life assessment of rhinitis Severity</h3>
        <input
          type="range"
          min={0}
          max={7}
          value={qualityOfLife}
          onChange={e => setQualityOfLife(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <span className="ml-2 text-blue-700 font-semibold">Value: {qualityOfLife}</span>
      </div>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Medication for Non-Nasal Symptom"
          className="border border-blue-100 rounded-xl px-4 py-3 bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={medications.nonNasal}
          onChange={e => handleMedications('nonNasal', e.target.value)}
        />
        <input
          type="text"
          placeholder="Medication for Nasal Symptom"
          className="border border-blue-100 rounded-xl px-4 py-3 bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={medications.nasal}
          onChange={e => handleMedications('nasal', e.target.value)}
        />
        <input
          type="text"
          placeholder="No of Antihistamine consumed"
          className="border border-blue-100 rounded-xl px-4 py-3 bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={medications.antihistamine}
          onChange={e => handleMedications('antihistamine', e.target.value)}
        />
        <input
          type="text"
          placeholder="Other Medication, if any?"
          className="border border-blue-100 rounded-xl px-4 py-3 bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={medications.other}
          onChange={e => handleMedications('other', e.target.value)}
        />
      </div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="ENT Examination"
          className="border border-blue-100 rounded-xl px-4 py-3 w-full bg-blue-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={entExamination}
          onChange={e => setEntExamination(e.target.value)}
        />
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

export default AddAllergicRhinitis; 