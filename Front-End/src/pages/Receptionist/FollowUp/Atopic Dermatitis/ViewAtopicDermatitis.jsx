import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ViewAtopicDermatitis() {
  const { atopicDermatitisId } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/atopic-dermatitis/${atopicDermatitisId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDetails(res.data);
      } catch (err) {
        setError("Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [atopicDermatitisId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Details not found. The record may have been deleted or never created.</div>;
  if (!details) return <div className="p-6">No details found.</div>;

  // Patient details block
  const patient = details.patientId;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-blue-100">
      <h2 className="text-3xl font-bold mb-4 text-blue-700 text-center">Atopic Dermatitis Details</h2>
      {/* Patient details */}
      {patient && (
        <div className="mb-8 p-4 bg-blue-50 rounded flex flex-wrap gap-6 justify-center">
          <div><span className="font-semibold">Name:</span> {patient.name}</div>
          <div><span className="font-semibold">Age:</span> {patient.age}</div>
          <div><span className="font-semibold">Gender:</span> {patient.gender}</div>
          <div><span className="font-semibold">Center Code:</span> {patient.centerCode}</div>
          <div><span className="font-semibold">Phone:</span> {patient.phone}</div>
        </div>
      )}
      <div className="mb-4">
        <strong>Symptoms:</strong> <span className="text-gray-700">{details.symptoms || "-"}</span>
      </div>
      <div className="mb-4">
        <strong>Affected Areas/Surface of the body:</strong> <span className="text-gray-700">{details.affectedAreas || "-"}</span>
      </div>
      <div className="mb-4">
        <strong>Intensity:</strong>
        <ul className="ml-4 list-disc">
          {details.intensity && Object.entries(details.intensity).map(([k, v]) => (
            <li key={k}>{k}: <span className="text-blue-700 font-semibold">{v}</span></li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Dryness (on skin without eczema):</strong> <span className="text-gray-700">{details.drynessWithoutEczema || "-"}</span>
      </div>
      <div className="mb-4">
        <strong>Dryness (on skin with eczema):</strong> <span className="text-gray-700">{details.drynessWithEczema || "-"}</span>
      </div>
      <div className="mb-4">
        <strong>Severity of Itching:</strong> <span className="text-blue-700 font-semibold">{details.itching}</span>
      </div>
      <div className="mb-4">
        <strong>Severity of Sleep Disturbance:</strong> <span className="text-blue-700 font-semibold">{details.sleepDisturbance}</span>
      </div>
      <div className="mb-4">
        <strong>Present Medications - Local Applications:</strong> <span className="text-gray-700">{details.localApplications || "-"}</span>
      </div>
      <div className="mb-4">
        <strong>Present Medications - Other Medications:</strong> <span className="text-gray-700">{details.otherMedications || "-"}</span>
      </div>
      <div className="mb-4">
        <strong>Skin Examination:</strong> <span className="text-gray-700">{details.skinExamination || "-"}</span>
      </div>
      <div className="text-sm text-gray-400 mt-6 text-center">Created: {details.createdAt ? new Date(details.createdAt).toLocaleString() : "-"}</div>
    </div>
  );
} 