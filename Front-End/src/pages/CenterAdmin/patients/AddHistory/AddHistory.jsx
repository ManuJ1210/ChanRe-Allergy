import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPatientHistory } from '../../../../features/centerAdmin/centerAdminThunks';
import { resetCenterAdminState } from '../../../../features/centerAdmin/centerAdminSlice';
import { FileText, ArrowLeft, Save, ClipboardList, Activity, Heart, Eye, Upload, CheckCircle } from 'lucide-react';

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
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, addHistorySuccess } = useSelector((state) => state.centerAdmin);
  
  const [formData, setFormData] = useState({
    sectionOne: { conditions: {} },
    sectionTwo: {},
    sectionThree: { questions: {}, triggers: [] },
    sectionFour: { symptoms: {} },
    sectionFive: { skinAllergy: {}, history: {} },
    sectionSix: {},
  });

  React.useEffect(() => {
    if (addHistorySuccess) {
      setTimeout(() => {
        dispatch(resetCenterAdminState());
        navigate('/dashboard/centeradmin/patients/patientlist');
      }, 1500);
    }
  }, [addHistorySuccess, dispatch, navigate]);

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

    const formCopy = { ...formData, patientId };
    const file = formCopy.sectionSix.reportFile;
    delete formCopy.sectionSix.reportFile;

    // Add the file back to the data object for the thunk to handle
    if (file) {
      formCopy.reportFile = file;
    }

    dispatch(addPatientHistory(formCopy));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
                            onClick={() => navigate('/dashboard/centeradmin/patients/patientlist')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients List
          </button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Add Patient History
          </h1>
          <p className="text-slate-600">
            Complete comprehensive patient history and examination
          </p>
        </div>

        {/* Alert Messages */}
        {addHistorySuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-700 font-medium">History submitted successfully!</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Medical Conditions */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-blue-500" />
                Medical Conditions History
              </h2>
              <p className="text-slate-600 mt-1">
                Have you ever had the following conditions?
              </p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Yes
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                        No
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {conditions.map((cond, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-700 font-medium">{cond}</td>
                        {["yes", "no"].map((val) => (
                          <td key={val} className="px-4 py-3 text-center">
                            <input
                              type="radio"
                              name={`cond-${i}`}
                              value={val}
                              checked={formData.sectionOne.conditions[cond] === val}
                              onChange={() => handleConditionChange(cond, val)}
                              className="text-blue-500 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 2: Hay Fever & Asthma Details */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Hay Fever & Asthma Details
              </h2>
              <p className="text-slate-600 mt-1">
                Detailed information about hay fever and asthma conditions
              </p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Fever Grade</label>
                  <div className="space-y-2">
                    {["Mild", "Moderate", "Severe"].map((opt) => (
                      <label key={opt} className="flex items-center">
                        <input
                          type="radio"
                          name="feverGrade"
                          checked={formData.sectionTwo.feverGrade === opt}
                          onChange={() => handleChange("sectionTwo", "feverGrade", opt)}
                          className="text-blue-500 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Itching Sore Throat?</label>
                  <div className="space-y-2">
                    {["Yes", "No"].map((opt) => (
                      <label key={opt} className="flex items-center">
                        <input
                          type="radio"
                          name="itchingThroat"
                          checked={formData.sectionTwo.itchingThroat === opt}
                          onChange={() => handleChange("sectionTwo", "itchingThroat", opt)}
                          className="text-blue-500 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Specific Days/Exposure</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="E.g., rainy days"
                    value={formData.sectionTwo.specificDay || ""}
                    onChange={(e) => handleChange("sectionTwo", "specificDay", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Asthma Type</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.sectionTwo.asthmaType || ""}
                    onChange={(e) => handleChange("sectionTwo", "asthmaType", e.target.value)}
                  >
                    <option value="">Select Asthma Type</option>
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Exacerbation Frequency (Last Year)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter frequency"
                    value={formData.sectionTwo.asthmaFrequency || ""}
                    onChange={(e) => handleChange("sectionTwo", "asthmaFrequency", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Frequency and Triggers */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Frequency and Triggers
              </h2>
              <p className="text-slate-600 mt-1">
                Frequency of symptoms and triggering factors
              </p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {questions.map((q, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{q}</label>
                    <div className="space-y-2">
                      {["Yes", "No"].map((val) => (
                        <label key={val} className="flex items-center">
                          <input
                            type="radio"
                            name={`q-${idx}`}
                            value={val}
                            checked={formData.sectionThree.questions[q] === val}
                            onChange={() => handleQuestionChange(q, val)}
                            className="text-blue-500 focus:ring-blue-500 mr-2"
                          />
                          <span className="text-slate-700">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">What triggers exacerbations?</label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {triggers.map((t, i) => (
                    <label key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.sectionThree.triggers.includes(t)}
                        onChange={() => handleTriggerChange(t)}
                        className="text-blue-500 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-slate-700">{t}</span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Others, please specify"
                  value={formData.sectionThree.otherTrigger || ""}
                  onChange={(e) => handleChange("sectionThree", "otherTrigger", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Allergic Rhinitis */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-500" />
                Allergic Rhinitis
              </h2>
              <p className="text-slate-600 mt-1">
                Symptoms and severity assessment
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Rhinitis Type</label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={formData.sectionFour.rhinitisType || ""}
                  onChange={(e) => handleChange("sectionFour", "rhinitisType", e.target.value)}
                >
                  <option value="">Select Rhinitis Type</option>
                  <option>Seasonal</option>
                  <option>Perennial</option>
                  <option>Both</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Symptom
                      </th>
                      {severityOptions.map((opt, idx) => (
                        <th key={idx} className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                          {opt}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {symptoms.map((sym, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-700 font-medium">{sym}</td>
                        {severityOptions.map((level) => (
                          <td key={level} className="px-4 py-3 text-center">
                            <input
                              type="radio"
                              name={`sym-${i}`}
                              value={level}
                              checked={formData.sectionFour.symptoms[sym] === level}
                              onChange={() => handleSymptomChange(sym, level)}
                              className="text-blue-500 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 5: Skin Allergy & History */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-blue-500" />
                Skin Allergy & Medical History
              </h2>
              <p className="text-slate-600 mt-1">
                Skin conditions and medical history assessment
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Allergy Type</label>
                <select
                  value={formData.sectionFive.allergyType || ""}
                  onChange={(e) => handleChange("sectionFive", "allergyType", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select Allergy Type</option>
                  <option>Contact</option>
                  <option>Atopic</option>
                  <option>Others</option>
                </select>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {skinConditions.map((cond, idx) => (
                  <div key={idx} className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">{cond}</label>
                    <div className="flex gap-4">
                      {["Yes", "No"].map((opt) => (
                        <label key={opt} className="flex items-center">
                          <input
                            type="radio"
                            name={`skin-${idx}`}
                            checked={formData.sectionFive.skinAllergy?.[cond]?.answer === opt}
                            onChange={() => handleSkinChange(cond, "answer", opt)}
                            className="text-blue-500 focus:ring-blue-500 mr-2"
                          />
                          <span className="text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder={`${cond} Distribution`}
                      value={formData.sectionFive.skinAllergy?.[cond]?.distribution || ""}
                      onChange={(e) => handleSkinChange(cond, "distribution", e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                ))}
              </div>

              <hr className="my-8 border-slate-200" />
              
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Medical History</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {historyConditions.map((cond, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{cond}</label>
                    <div className="space-y-2">
                      {["Yes", "No"].map((opt) => (
                        <label key={opt} className="flex items-center">
                          <input
                            type="radio"
                            name={`hist-${cond}`}
                            checked={formData.sectionFive.history?.[cond] === opt}
                            onChange={() => handleNestedChange("sectionFive", "history", cond, opt)}
                            className="text-blue-500 focus:ring-blue-500 mr-2"
                          />
                          <span className="text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Drugs, Exposure & Examination */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Drugs, Exposure & Examination
              </h2>
              <p className="text-slate-600 mt-1">
                Drug allergies, occupational exposure, and examination findings
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Drugs and Exposure</h3>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                {["DrugAllergyKnown", "Probable", "Definite"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    value={formData.sectionSix?.[field] || ""}
                    onChange={(e) => handleChange("sectionSix", field, e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                ))}
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-4">Occupation & Exposure</h3>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                {["Occupation", "ProbableChemicalExposure", "Location", "FamilyHistory"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    value={formData.sectionSix?.[field] || ""}
                    onChange={(e) => handleChange("sectionSix", field, e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                ))}
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-4">Examination</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {["OralCavity", "Skin", "ENT", "Eye", "RespiratorySystem", "CVS", "CNS", "Abdomen", "AnyOtherFindings"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    value={formData.sectionSix?.[field] || ""}
                    onChange={(e) => handleChange("sectionSix", field, e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Report</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full sm:w-1/2 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting History...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Submit Patient History
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHistory;
