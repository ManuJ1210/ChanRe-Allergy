import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GINA_QUESTIONS = [
  "Day time symptoms",
  "Limitation of activities",
  "Nocturnal Symptoms / Awakening",
  "Need for relax/ rescue treatment",
  "Lung Function(PEF or FEV1)",
  "Exacerbations"
];
const GINA_OPTIONS = [
  { label: "Controlled", value: "Controlled" },
  { label: "Partially Controlled", value: "Partially Controlled" },
  { label: "Uncontrolled", value: "Uncontrolled" }
];
const PFT_GRADES = [
  { label: "Mild (Fev >= 80%)", value: "Mild" },
  { label: "Moderate (Fev >= 50-80%)", value: "Moderate" },
  { label: "Severe (Fev >= 30-50%)", value: "Severe" },
  { label: "Very Severe (Extremely difficult to breathe)", value: "Very Severe" }
];
const HABITS = ["Smoker", "Non Smoker"];

const AddAllergicBronchitis = ({ patientId: propPatientId, onSuccess, onCancel }) => {
  const params = useParams();
  const navigate = useNavigate();
  const patientId = propPatientId || params.patientId || params.id;
  const [symptoms, setSymptoms] = useState("");
  const [type, setType] = useState("");
  const [ginaGrading, setGinaGrading] = useState({});
  const [pftGrading, setPftGrading] = useState("");
  const [habits, setHabits] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleGinaChange = (question, value) => {
    setGinaGrading(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/allergic-bronchitis",
        { patientId, symptoms, type, ginaGrading, pftGrading, habits },
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
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto border border-blue-100 space-y-8">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-500 text-center tracking-tight">Allergic Bronchitis</h2>
      <div className="mb-6 flex flex-wrap gap-8 items-center">
        <div>
          <span className="font-semibold mr-2 text-slate-700">Symptoms</span>
          <input
            type="text"
            className="border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            placeholder="Enter symptoms"
          />
        </div>
        <div>
          <span className="font-semibold mr-2 text-slate-700">Type</span>
          <label className="mr-3">
            <input
              type="radio"
              name="type"
              value="Acute"
              checked={type === "Acute"}
              onChange={e => setType(e.target.value)}
              className="mr-1 accent-blue-500"
            />
            Acute
          </label>
          <label className="mr-3">
            <input
              type="radio"
              name="type"
              value="Chronic"
              checked={type === "Chronic"}
              onChange={e => setType(e.target.value)}
              className="mr-1 accent-blue-500"
            />
            Chronic
          </label>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">Gina Grading of Asthma</h3>
        <table className="min-w-full text-sm border border-blue-100 rounded-xl overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th className="border border-blue-100 px-3 py-2 text-left">Characteristics</th>
              {GINA_OPTIONS.map(opt => (
                <th key={opt.value} className="border border-blue-100 px-3 py-2 text-center">{opt.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GINA_QUESTIONS.map(q => (
              <tr key={q} className="even:bg-blue-50">
                <td className="border border-blue-100 px-3 py-2">{q}</td>
                {GINA_OPTIONS.map(opt => (
                  <td key={opt.value} className="border border-blue-100 px-3 py-2 text-center">
                    <input
                      type="radio"
                      name={q}
                      value={opt.value}
                      checked={ginaGrading[q] === opt.value}
                      onChange={() => handleGinaChange(q, opt.value)}
                      className="accent-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">Grading based on PFT</h3>
        <div className="flex flex-wrap gap-8">
          {PFT_GRADES.map(grade => (
            <label key={grade.value} className="mr-3">
              <input
                type="radio"
                name="pftGrading"
                value={grade.value}
                checked={pftGrading === grade.value}
                onChange={e => setPftGrading(e.target.value)}
                className="mr-1 accent-blue-500"
              />
              {grade.label}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">Habits</h3>
        <div className="flex flex-wrap gap-8">
          {HABITS.map(habit => (
            <label key={habit} className="mr-3">
              <input
                type="radio"
                name="habits"
                value={habit}
                checked={habits === habit}
                onChange={e => setHabits(e.target.value)}
                className="mr-1 accent-blue-500"
              />
              {habit}
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-3 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      {success && <div className="text-green-600 mt-2">Record added successfully!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default AddAllergicBronchitis; 