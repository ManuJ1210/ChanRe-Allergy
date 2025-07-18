import React from 'react';

const SectionSix = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionSix: {
        ...prev.sectionSix,
        [field]: value,
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

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Any New Drugs Recently Prescribed Before Onset</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["DrugAllergyKnown", "Probable", "Definite"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={formData.sectionSix?.[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-4">Occupation and Exposure Possibility</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {["Occupation", "ProbableChemicalExposure", "Location", "FamilyHistory"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={formData.sectionSix?.[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-4">Examination</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          "OralCavity", "Skin", "ENT", "Eye",
          "RespiratorySystem", "CVS", "CNS", "Abdomen",
          "AnyOtherFindings"
        ].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={formData.sectionSix?.[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        ))}
      </div>

      <div className="mt-4">
        <label className="block font-medium mb-2">Upload Report</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full sm:w-1/2 border rounded px-3 py-2"
        />
      </div>
    </div>
  );
};

export default SectionSix;
