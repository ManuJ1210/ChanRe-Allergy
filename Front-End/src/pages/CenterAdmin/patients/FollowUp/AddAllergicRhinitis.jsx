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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-700">ALLERGIC RHINITIS</h2>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Nasal Symptom Severity</h3>
        {NASAL_SYMPTOMS.map(symptom => (
          <div key={symptom} className="mb-2 flex items-center gap-4">
            <label className="w-48">{symptom}</label>
            <input
              type="range"
              min={0}
              max={7}
              value={nasalSymptoms[symptom] || 0}
              onChange={e => handleSlider(symptom, Number(e.target.value), true)}
              className="flex-1"
            />
            <span className="ml-2 text-blue-700">Value: {nasalSymptoms[symptom] || 0}</span>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Non Nasal Symptom Severity</h3>
        {NON_NASAL_SYMPTOMS.map(symptom => (
          <div key={symptom} className="mb-2 flex items-center gap-4">
            <label className="w-48">{symptom}</label>
            <input
              type="range"
              min={0}
              max={7}
              value={nonNasalSymptoms[symptom] || 0}
              onChange={e => handleSlider(symptom, Number(e.target.value), false)}
              className="flex-1"
            />
            <span className="ml-2 text-blue-700">Value: {nonNasalSymptoms[symptom] || 0}</span>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Quality of life assessment of rhinitis Severity</h3>
        <input
          type="range"
          min={0}
          max={7}
          value={qualityOfLife}
          onChange={e => setQualityOfLife(Number(e.target.value))}
          className="w-full"
        />
        <span className="ml-2 text-blue-700">Value: {qualityOfLife}</span>
      </div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Medication for Non-Nasal Symptom"
          className="border rounded px-3 py-2"
          value={medications.nonNasal}
          onChange={e => handleMedications('nonNasal', e.target.value)}
        />
        <input
          type="text"
          placeholder="Medication for Nasal Symptom"
          className="border rounded px-3 py-2"
          value={medications.nasal}
          onChange={e => handleMedications('nasal', e.target.value)}
        />
        <input
          type="text"
          placeholder="No of Antihistamine consumed"
          className="border rounded px-3 py-2"
          value={medications.antihistamine}
          onChange={e => handleMedications('antihistamine', e.target.value)}
        />
        <input
          type="text"
          placeholder="Other Medication, if any?"
          className="border rounded px-3 py-2"
          value={medications.other}
          onChange={e => handleMedications('other', e.target.value)}
        />
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="ENT Examination"
          className="border rounded px-3 py-2 w-full"
          value={entExamination}
          onChange={e => setEntExamination(e.target.value)}
        />
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

export default AddAllergicRhinitis; 