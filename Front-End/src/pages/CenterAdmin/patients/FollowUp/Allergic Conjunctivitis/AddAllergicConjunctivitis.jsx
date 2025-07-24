import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SYMPTOMS = ["Itching", "Tearing", "Redness", "Discomfort", "Discharge", "Photophobia"];
const TYPES = [
  { label: "Seasonal", value: "Seasonal" },
  { label: "Perinneal", value: "Perinneal" },
  { label: "Intermittent (< 4 days per week or < 4 consecutive week)", value: "Intermittent" },
  { label: "Persistent (< 4 days per week or < 4 consecutive week)", value: "Persistent" }
];
const GRADING_QUESTIONS = [
  "Signs & Symptoms being bothersome",
  "Effects on vision",
  "Interference in School/Work",
  "Able to perform daily activities"
];
const GRADING_LEVELS = [
  { label: "Mild (0)", value: 0 },
  { label: "Moderate (1-3)", value: 2 },
  { label: "Severe (4)", value: 4 }
];

const AddAllergicConjunctivitis = ({ patientId: propPatientId, onSuccess, onCancel }) => {
  const params = useParams();
  const navigate = useNavigate();
  const patientId = propPatientId || params.patientId || params.id;
  const [symptoms, setSymptoms] = useState([]);
  const [type, setType] = useState("");
  const [grading, setGrading] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSymptomChange = (symptom) => {
    setSymptoms(prev => prev.includes(symptom)
      ? prev.filter(s => s !== symptom)
      : [...prev, symptom]);
  };

  const handleGradingChange = (question, value) => {
    setGrading(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/allergic-conjunctivitis",
        { patientId, symptoms, type, grading },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setSymptoms([]);
      setType("");
      setGrading({});
      if (onSuccess) onSuccess();
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
      <h2 className="text-xl font-bold mb-4 text-blue-700">Allergic Conjunctivitis</h2>
      <div className="mb-4 flex flex-wrap gap-6 items-center">
        <div>
          <span className="font-semibold mr-2">Symptoms</span>
          {SYMPTOMS.map(symptom => (
            <label key={symptom} className="mr-3">
              <input
                type="checkbox"
                checked={symptoms.includes(symptom)}
                onChange={() => handleSymptomChange(symptom)}
                className="mr-1"
              />
              {symptom}
            </label>
          ))}
        </div>
        <div>
          <span className="font-semibold mr-2">Type</span>
          {TYPES.map(t => (
            <label key={t.value} className="mr-3">
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={type === t.value}
                onChange={e => setType(e.target.value)}
                className="mr-1"
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Grading</h3>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Grading</th>
              {GRADING_LEVELS.map(level => (
                <th key={level.value} className="border px-2 py-1 text-center">{level.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GRADING_QUESTIONS.map(q => (
              <tr key={q}>
                <td className="border px-2 py-1">{q}</td>
                {GRADING_LEVELS.map(level => (
                  <td key={level.value} className="border px-2 py-1 text-center">
                    <input
                      type="radio"
                      name={q}
                      value={level.value}
                      checked={grading[q] === level.value}
                      onChange={() => handleGradingChange(q, level.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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

export default AddAllergicConjunctivitis; 