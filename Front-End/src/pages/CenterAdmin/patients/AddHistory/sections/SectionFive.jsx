import React from 'react';

const skinConditions = [
  "Hives",
  "Eczema",
  "Ulcer",
  "Papualo-squamous rashes",
  "Itching with no rashes"
];

const historyConditions = [
  "Hypertension",
  "Diabetes",
  "Epilepsy",
  "IHD"
];

const SectionFive = ({ formData, setFormData }) => {
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

  const handleAllergyTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      sectionFive: {
        ...prev.sectionFive,
        allergyType: value,
      },
    }));
  };

  const handleHistoryChange = (condition, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionFive: {
        ...prev.sectionFive,
        history: {
          ...(prev.sectionFive?.history || {}),
          [condition]: value,
        },
      },
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Skin Allergy</h2>

      <div className="mb-4">
        <label className="block font-medium mb-2">Skin Allergy Type</label>
        <select
          value={formData.sectionFive?.allergyType || ""}
          onChange={(e) => handleAllergyTypeChange(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/2"
        >
          <option value="">Select</option>
          <option value="Contact">Contact</option>
          <option value="Atopic">Atopic</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {skinConditions.map((cond, idx) => (
          <div key={idx}>
            <label className="block font-medium mb-2">{cond}</label>
            <div className="flex space-x-4 mb-2">
              {["Yes", "No"].map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name={`skin-${idx}`}
                    value={opt}
                    checked={
                      formData.sectionFive?.skinAllergy?.[cond]?.answer === opt
                    }
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
              value={
                formData.sectionFive?.skinAllergy?.[cond]?.distribution || ""
              }
              onChange={(e) =>
                handleSkinChange(cond, "distribution", e.target.value)
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}
      </div>

      <hr className="my-6" />

      <h2 className="text-lg font-semibold mb-4">History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {historyConditions.map((cond, idx) => (
          <div key={idx}>
            <label className="block font-medium mb-1">{cond}</label>
            <div className="space-x-4">
              {["Yes", "No"].map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name={`history-${cond}`}
                    value={opt}
                    checked={
                      formData.sectionFive?.history?.[cond] === opt
                    }
                    onChange={() => handleHistoryChange(cond, opt)}
                    className="mr-1"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionFive;
