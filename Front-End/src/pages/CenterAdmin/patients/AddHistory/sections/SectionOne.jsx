import React from 'react';

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

const SectionOne = ({ formData, setFormData }) => {
  const handleChange = (condition, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionOne: {
        ...prev.sectionOne,
        conditions: {
          ...prev.sectionOne?.conditions,
          [condition]: value,
        },
      },
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Have you ever had the following conditions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">Condition</th>
              <th className="px-4 py-2 text-center text-blue-700">Yes</th>
              <th className="px-4 py-2 text-center text-blue-700">No</th>
            </tr>
          </thead>
          <tbody>
            {conditions.map((condition, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{condition}</td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="radio"
                    name={`condition-${index}`}
                    value="yes"
                    checked={formData.sectionOne?.conditions?.[condition] === 'yes'}
                    onChange={() => handleChange(condition, 'yes')}
                    className="form-radio"
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="radio"
                    name={`condition-${index}`}
                    value="no"
                    checked={formData.sectionOne?.conditions?.[condition] === 'no'}
                    onChange={() => handleChange(condition, 'no')}
                    className="form-radio"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionOne;
