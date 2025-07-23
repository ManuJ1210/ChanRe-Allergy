import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const conditions = [
  "Hay fever (itching of nose, sneezing, stuffy nose, running nose)",
  "Asthma (wheezing)",
  "Other Breathing Problems - Shortness of Breath",
  "Hives or Swelling (urticarial-angioedema)",
  "Sinus Trouble - Frequent Colds",
  "Eczema or other rashes",
  "Food Allergies",
  "Arthritic Diseases",
  "Immune Defect (frequent or recurrent infections)",
  "Drug Allergy (Penicillin, Sulpha Aspirin, others)",
  "Bee Sting or Insect Hypersensitivity (large swelling, hives, shock)",
];

const questions = [
  "Admission to hospital",
  "GP attendances",
  "A&E attendances",
  "Any ICU admissions in the past?",
  "How many times are cough/wheeze present in a week",
  "Are interval symptoms present?",
  "Coughing at night how often does this wake the child",
  "Early morning cough",
  "Exercise induced symptoms ?",
  "Does anyone in the family smoke?",
  "Are there any pets at home",
];

const triggers = ["URTIs", "Cold weather", "Pollen", "Smoke", "Exercise", "Pets"];
const symptoms = [
  "Sneezing",
  "Nasal Congestion",
  "Running Nose",
  "Itching Nose",
  "Itching Eyes",
  "Coughing",
  "Wheezing",
  "Coughing or Wheezing",
  "With Exercise",
  "Headaches",
  "Post Nasal Drip",
];
const severityOptions = ["Not So Much", "Mild", "Mod", "Severe"];
const skinConditions = ["Hives", "Eczema", "Ulcer", "Papualo-squamous rashes", "Itching with no rashes"];
const historyConditions = ["Hypertension", "Diabetes", "Epilepsy", "IHD"];

const AddHistory = () => {
  const { id: patientId } = useParams(); // get patientId from URL
  const [formData, setFormData] = useState({
    sectionOne: { conditions: {} },
    sectionTwo: {},
    sectionThree: { questions: {}, triggers: [] },
    sectionFour: { symptoms: {} },
    sectionFive: { skinAllergy: {}, history: {} },
    sectionSix: {},
  });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (section, nestedKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedKey]: {
          ...(prev[section]?.[nestedKey] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleConditionChange = (condition, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionOne: {
        ...prev.sectionOne,
        conditions: {
          ...prev.sectionOne.conditions,
          [condition]: value,
        },
      },
    }));
  };

  const handleQuestionChange = (question, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionThree: {
        ...prev.sectionThree,
        questions: {
          ...prev.sectionThree.questions,
          [question]: value,
        },
      },
    }));
  };

  const handleTriggerChange = (trigger) => {
    const current = formData.sectionThree.triggers || [];
    const updated = current.includes(trigger)
      ? current.filter((t) => t !== trigger)
      : [...current, trigger];

    setFormData((prev) => ({
      ...prev,
      sectionThree: {
        ...prev.sectionThree,
        triggers: updated,
      },
    }));
  };

  const handleSymptomChange = (symptom, level) => {
    setFormData((prev) => ({
      ...prev,
      sectionFour: {
        ...prev.sectionFour,
        symptoms: {
          ...prev.sectionFour.symptoms,
          [symptom]: level,
        },
      },
    }));
  };

  const handleSkinChange = (condition, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionFive: {
        ...prev.sectionFive,
        skinAllergy: {
          ...(prev.sectionFive?.skinAllergy || {}),
          [condition]: {
            ...(prev.sectionFive?.skinAllergy?.[condition] || {}),
            [field]: value,
          },
        },
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      sectionSix: {
        ...prev.sectionSix,
        reportFile: file,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      const formCopy = { ...formData, patientId }; // add patientId to form data
      const file = formCopy.sectionSix.reportFile;
      delete formCopy.sectionSix.reportFile;

      data.append("formData", JSON.stringify(formCopy));
      if (file) data.append("reportFile", file);

      const response = await axios.post(
        "http://localhost:5000/api/history/add", 
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("History submitted successfully");
      console.log("Backend response:", response.data);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit history");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Add History</h1>

      {/* Section 1 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Have you ever had the following conditions</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Condition</th>
              <th className="px-4 py-2 text-center">Yes</th>
              <th className="px-4 py-2 text-center">No</th>
            </tr>
          </thead>
          <tbody>
            {conditions.map((cond, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{cond}</td>
                {["yes", "no"].map((val) => (
                  <td key={val} className="px-4 py-2 text-center">
                    <input
                      type="radio"
                      name={`cond-${i}`}
                      value={val}
                      checked={formData.sectionOne.conditions[cond] === val}
                      onChange={() => handleConditionChange(cond, val)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 2 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Details of Hay fever & Asthma</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="font-medium block mb-2">Fever grade</label>
            {["Mild", "Moderate", "Severe"].map((opt) => (
              <label key={opt} className="mr-4">
                <input
                  type="radio"
                  name="feverGrade"
                  checked={formData.sectionTwo.feverGrade === opt}
                  onChange={() => handleChange("sectionTwo", "feverGrade", opt)}
                  className="mr-1"
                />
                {opt}
              </label>
            ))}
          </div>

          <div>
            <label className="font-medium block mb-2">Itching sore throat?</label>
            {["Yes", "No"].map((opt) => (
              <label key={opt} className="mr-4">
                <input
                  type="radio"
                  name="itchingThroat"
                  checked={formData.sectionTwo.itchingThroat === opt}
                  onChange={() => handleChange("sectionTwo", "itchingThroat", opt)}
                  className="mr-1"
                />
                {opt}
              </label>
            ))}
          </div>

          <div>
            <label className="font-medium block mb-2">Specific days/exposure?</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="E.g., rainy days"
              value={formData.sectionTwo.specificDay || ""}
              onChange={(e) => handleChange("sectionTwo", "specificDay", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="font-medium block mb-2">Asthma Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={formData.sectionTwo.asthmaType || ""}
            onChange={(e) => handleChange("sectionTwo", "asthmaType", e.target.value)}
          >
            <option value="">Select</option>
            <option>Mild</option>
            <option>Moderate</option>
            <option>Severe</option>
          </select>

          <label className="font-medium block mt-4 mb-2">Exacerbation frequency (last year)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={formData.sectionTwo.asthmaFrequency || ""}
            onChange={(e) => handleChange("sectionTwo", "asthmaFrequency", e.target.value)}
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Frequency and Triggers</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {questions.map((q, idx) => (
            <div key={idx}>
              <label className="block font-medium mb-1">{q}</label>
              {["Yes", "No"].map((val) => (
                <label key={val} className="mr-4">
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    value={val}
                    checked={formData.sectionThree.questions[q] === val}
                    onChange={() => handleQuestionChange(q, val)}
                    className="mr-1"
                  />
                  {val}
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="font-medium block mb-2">What triggers exacerbations?</label>
          <div className="flex flex-wrap gap-4">
            {triggers.map((t, i) => (
              <label key={i} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.sectionThree.triggers.includes(t)}
                  onChange={() => handleTriggerChange(t)}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            className="mt-2 w-full border rounded px-3 py-2"
            placeholder="Others, please specify"
            value={formData.sectionThree.otherTrigger || ""}
            onChange={(e) => handleChange("sectionThree", "otherTrigger", e.target.value)}
          />
        </div>
      </div>

      {/* Section 4 */}
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Allergic Rhinitis</h2>
        <select
          className="border rounded px-3 py-2 mb-4"
          value={formData.sectionFour.rhinitisType || ""}
          onChange={(e) => handleChange("sectionFour", "rhinitisType", e.target.value)}
        >
          <option value="">Select Rhinitis Type</option>
          <option>Seasonal</option>
          <option>Perennial</option>
          <option>Both</option>
        </select>

        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Symptom</th>
              {severityOptions.map((opt, idx) => (
                <th key={idx} className="border px-4 py-2 text-center">{opt}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {symptoms.map((sym, i) => (
              <tr key={i}>
                <td className="border px-4 py-2">{sym}</td>
                {severityOptions.map((level) => (
                  <td key={level} className="border px-4 py-2 text-center">
                    <input
                      type="radio"
                      name={`sym-${i}`}
                      value={level}
                      checked={formData.sectionFour.symptoms[sym] === level}
                      onChange={() => handleSymptomChange(sym, level)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 5 & 6 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Skin Allergy</h2>
        <select
          value={formData.sectionFive.allergyType || ""}
          onChange={(e) => handleChange("sectionFive", "allergyType", e.target.value)}
          className="border rounded px-3 py-2 mb-4"
        >
          <option value="">Select Allergy Type</option>
          <option>Contact</option>
          <option>Atopic</option>
          <option>Others</option>
        </select>

        <div className="grid sm:grid-cols-2 gap-6">
          {skinConditions.map((cond, idx) => (
            <div key={idx}>
              <label className="block font-medium mb-2">{cond}</label>
              <div className="flex gap-4 mb-2">
                {["Yes", "No"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={`skin-${idx}`}
                      checked={formData.sectionFive.skinAllergy?.[cond]?.answer === opt}
                      onChange={() => handleSkinChange(cond, "answer", opt)}
                      className="mr-1"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              <input
                type="text"
                placeholder={`${cond} Distribution`}
                value={formData.sectionFive.skinAllergy?.[cond]?.distribution || ""}
                onChange={(e) => handleSkinChange(cond, "distribution", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-4">History</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {historyConditions.map((cond, idx) => (
            <div key={idx}>
              <label className="block font-medium mb-2">{cond}</label>
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="mr-4">
                  <input
                    type="radio"
                    name={`hist-${cond}`}
                    checked={formData.sectionFive.history?.[cond] === opt}
                    onChange={() => handleNestedChange("sectionFive", "history", cond, opt)}
                    className="mr-1"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-4">Drugs and Exposure</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {["DrugAllergyKnown", "Probable", "Definite"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={formData.sectionSix?.[field] || ""}
              onChange={(e) => handleChange("sectionSix", field, e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Occupation & Exposure</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {["Occupation", "ProbableChemicalExposure", "Location", "FamilyHistory"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={formData.sectionSix?.[field] || ""}
              onChange={(e) => handleChange("sectionSix", field, e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Examination</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["OralCavity", "Skin", "ENT", "Eye", "RespiratorySystem", "CVS", "CNS", "Abdomen", "AnyOtherFindings"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={formData.sectionSix?.[field] || ""}
              onChange={(e) => handleChange("sectionSix", field, e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          ))}
        </div>

        <div className="mt-6">
          <label className="block font-medium mb-2">Upload Report</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full sm:w-1/2 border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddHistory
