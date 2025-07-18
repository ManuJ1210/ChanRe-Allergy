import React from 'react';

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
  "Are there any pets at home"
];

const triggers = ["URTIs", "Cold weather", "Pollen", "Smoke", "Exercise", "Pets"];

const SectionThree = ({ formData, setFormData }) => {
  const handleRadioChange = (question, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionThree: {
        ...prev.sectionThree,
        questions: {
          ...prev.sectionThree?.questions,
          [question]: value,
        },
      },
    }));
  };

  const handleTriggerChange = (trigger) => {
    const currentTriggers = formData.sectionThree?.triggers || [];
    const updatedTriggers = currentTriggers.includes(trigger)
      ? currentTriggers.filter((t) => t !== trigger)
      : [...currentTriggers, trigger];

    setFormData((prev) => ({
      ...prev,
      sectionThree: {
        ...prev.sectionThree,
        triggers: updatedTriggers,
      },
    }));
  };

  const handleOtherChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      sectionThree: {
        ...prev.sectionThree,
        otherTrigger: value,
      },
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Have these required any of the following and if so how frequently?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {questions.map((q, index) => (
          <div key={index}>
            <label className="block mb-1 font-medium">{q}</label>
            <div className="space-x-4">
              {["Yes", "No"].map((option) => (
                <label key={option} className="mr-4">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={formData.sectionThree?.questions?.[q] === option}
                    onChange={() => handleRadioChange(q, option)}
                    className="mr-1"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block font-medium mb-2">What triggers exacerbations?</label>
        <div className="flex flex-wrap gap-4">
          {triggers.map((trigger, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.sectionThree?.triggers?.includes(trigger)}
                onChange={() => handleTriggerChange(trigger)}
              />
              <span>{trigger}</span>
            </label>
          ))}
          <input
            type="text"
            placeholder="Others, please specify"
            value={formData.sectionThree?.otherTrigger || ''}
            onChange={(e) => handleOtherChange(e.target.value)}
            className="border rounded px-3 py-2 mt-2 w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionThree;
