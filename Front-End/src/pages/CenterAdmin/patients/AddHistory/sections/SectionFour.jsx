import React from 'react';

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

const SectionFour = ({ formData, setFormData }) => {
  const handleSelectChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      sectionFour: {
        ...prev.sectionFour,
        rhinitisType: e.target.value,
      },
    }));
  };

  const handleSymptomChange = (symptom, severity) => {
    setFormData((prev) => ({
      ...prev,
      sectionFour: {
        ...prev.sectionFour,
        symptoms: {
          ...prev.sectionFour?.symptoms,
          [symptom]: severity,
        },
      },
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Allergic Rhinitis</h2>

      <div className="mb-4">
        <label className="block font-medium mb-2">Allergic Rhinitis:</label>
        <select
          value={formData.sectionFour?.rhinitisType || ""}
          onChange={handleSelectChange}
          className="border rounded px-3 py-2"
        >
          <option value="">Select</option>
          <option value="Seasonal">Seasonal</option>
          <option value="Perennial">Perennial</option>
          <option value="Both">Both</option>
        </select>
      </div>

      <table className="min-w-full border mt-4 text-sm">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Symptom</th>
            {severityOptions.map((opt, idx) => (
              <th key={idx} className="border px-4 py-2 text-center">
                {opt}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {symptoms.map((symptom, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border px-4 py-2">{symptom}</td>
              {severityOptions.map((level, colIndex) => (
                <td key={colIndex} className="border px-4 py-2 text-center">
                  <input
                    type="radio"
                    name={`symptom-${rowIndex}`}
                    value={level}
                    checked={formData.sectionFour?.symptoms?.[symptom] === level}
                    onChange={() => handleSymptomChange(symptom, level)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SectionFour;
