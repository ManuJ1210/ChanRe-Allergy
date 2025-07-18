import React from 'react';

const SectionTwo = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionTwo: {
        ...prev.sectionTwo,
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Details of Hay fever</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fever Grade */}
        <div>
          <label className="block font-medium mb-2">Fever grade</label>
          <div className="space-x-4">
            {["Mild", "Moderate", "Severe"].map((level) => (
              <label key={level} className="mr-4">
                <input
                  type="radio"
                  name="feverGrade"
                  value={level}
                  checked={formData.sectionTwo?.feverGrade === level}
                  onChange={() => handleChange('feverGrade', level)}
                  className="mr-1"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        {/* Itching sore throat */}
        <div>
          <label className="block font-medium mb-2">
            Itching sore throat and other symptoms if any
          </label>
          <div className="space-x-4">
            {["Yes", "No"].map((option) => (
              <label key={option} className="mr-4">
                <input
                  type="radio"
                  name="itchingThroat"
                  value={option}
                  checked={formData.sectionTwo?.itchingThroat === option}
                  onChange={() => handleChange('itchingThroat', option)}
                  className="mr-1"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Specific Day */}
        <div>
          <label className="block font-medium mb-2">
            Any specific day/ exposure/cycles of fever if noted
          </label>
          <input
            type="text"
            placeholder="Any specific day"
            value={formData.sectionTwo?.specificDay || ''}
            onChange={(e) => handleChange('specificDay', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <hr className="my-6" />

      {/* Asthma Section */}
      <div>
        <h3 className="text-md font-semibold mb-4">Asthma</h3>

        <div className="mb-4">
          <label className="block font-medium mb-2">Select</label>
          <select
            value={formData.sectionTwo?.asthmaType || ''}
            onChange={(e) => handleChange('asthmaType', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            How often have exacerbations occurred in the last year?
          </label>
          <input
            type="text"
            placeholder="Write here.."
            value={formData.sectionTwo?.asthmaFrequency || ''}
            onChange={(e) => handleChange('asthmaFrequency', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionTwo;
