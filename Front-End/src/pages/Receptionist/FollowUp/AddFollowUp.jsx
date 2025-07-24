import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FOLLOWUP_TYPES = [
  "Allergic Rhinitis",
  "Atopic Dermatitis",
  "Allergic Conjunctivities",
  "Allergic Bronchitis",
  "GPE"
];

const AddFollowUp = ({ patientId: propPatientId, onSuccess, onCancel, defaultType }) => {
  const params = useParams();
  const patientId = propPatientId || params.patientId || params.id;
  const [type, setType] = useState(defaultType || FOLLOWUP_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/followups",
        { patientId, type, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setNotes("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to add follow up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Add Follow Up</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Type</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          {FOLLOWUP_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Notes</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300">Cancel</button>
        )}
      </div>
      {success && <div className="text-green-600 mt-2">Follow up added successfully!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default AddFollowUp; 