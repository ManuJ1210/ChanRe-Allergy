import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const INTENSITY_OPTIONS = ["None", "Mild", "Moderate", "Severe"];
const DRYNESS_OPTIONS = ["No", "Slight", "Moderate", "Very Dry"];
const DRYNESS_ECZEMA_OPTIONS = ["No", "Slight", "Moderate", "Severe"];

export default function AtopicDermatitisFollowUp() {
  const [form, setForm] = useState({
    symptoms: "",
    affectedAreas: "",
    intensity: {
      Erythema: "",
      Oedema: "",
      Swelling: "",
      Oozing: "",
      Crusting: "",
      Excoriation: "",
      Lichenification: "",
    },
    drynessWithoutEczema: "",
    drynessWithEczema: "",
    redness: "",
    swelling: "",
    oozing: "",
    scratching: "",
    thickenedSkin: "",
    itching: 0,
    sleepDisturbance: 0,
    localApplications: "",
    otherMedications: "",
    skinExamination: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleIntensityChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      intensity: { ...prev.intensity, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/atopic-dermatitis",
        {
          patientId: params.patientId,
          ...form
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Submitted successfully!");
      navigate(`/CenterAdmin/patients/FollowUp/${params.patientId}`);
    } catch (err) {
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-10 border border-blue-100">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">Atopic Dermatitis Follow Up</h2>
      {/* Symptoms Section */}
      <div className="bg-blue-50 rounded-lg p-4 space-y-4">
        <div>
          <label className="font-semibold block mb-1">Symptoms</label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
            value={form.symptoms}
            onChange={e => handleChange("symptoms", e.target.value)}
            placeholder="Enter Symptoms.."
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Affected Areas/Surface of the body</label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
            value={form.affectedAreas}
            onChange={e => handleChange("affectedAreas", e.target.value)}
            placeholder="Enter Affected Areas/Surface of the body"
          />
        </div>
      </div>
      {/* Intensity Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <label className="font-semibold text-blue-700 block mb-2">Intensity</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(form.intensity).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm mb-1">{key}</label>
              <select
                className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-200"
                value={form.intensity[key]}
                onChange={e => handleIntensityChange(key, e.target.value)}
              >
                <option value="">Select</option>
                {INTENSITY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      {/* Dryness Section */}
      <div className="bg-blue-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold block mb-1">Dryness (on skin without eczema)</label>
          <select
            className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-200"
            value={form.drynessWithoutEczema}
            onChange={e => handleChange("drynessWithoutEczema", e.target.value)}
          >
            <option value="">Select</option>
            {DRYNESS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-1">Dryness (on skin with eczema)</label>
          <select
            className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-200"
            value={form.drynessWithEczema}
            onChange={e => handleChange("drynessWithEczema", e.target.value)}
          >
            <option value="">Select</option>
            {DRYNESS_ECZEMA_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Sliders Section */}
      <div className="bg-blue-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold block mb-1">Severity of Itching</label>
          <input
            type="range"
            min={0}
            max={10}
            value={form.itching}
            onChange={e => handleChange("itching", Number(e.target.value))}
            className="w-full accent-blue-700"
          />
          <span className="ml-2 text-blue-700">Value: {form.itching}</span>
        </div>
        <div>
          <label className="font-semibold block mb-1">Severity of Sleep Disturbance</label>
          <input
            type="range"
            min={0}
            max={10}
            value={form.sleepDisturbance}
            onChange={e => handleChange("sleepDisturbance", Number(e.target.value))}
            className="w-full accent-blue-700"
          />
          <span className="ml-2 text-blue-700">Value: {form.sleepDisturbance}</span>
        </div>
      </div>
      {/* Medications Section */}
      <div className="bg-blue-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold block mb-1">Present Medications - Local Applications</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
            value={form.localApplications}
            onChange={e => handleChange("localApplications", e.target.value)}
            placeholder="Local Applications"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Present Medications - Other Medications</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
            value={form.otherMedications}
            onChange={e => handleChange("otherMedications", e.target.value)}
            placeholder="Other Medications"
          />
        </div>
      </div>
      {/* Skin Examination Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <label className="font-semibold block mb-1">Skin Examination</label>
        <textarea
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
          value={form.skinExamination}
          onChange={e => handleChange("skinExamination", e.target.value)}
          placeholder="Skin Examination"
        />
      </div>
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          className="bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
} 