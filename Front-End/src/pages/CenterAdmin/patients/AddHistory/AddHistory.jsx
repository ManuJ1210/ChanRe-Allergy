import React, { useState } from "react";
import SectionOne from '../AddHistory/sections/SectionOne';
import SectionTwo from '../AddHistory/sections/SectionTwo';
import SectionThree from '../AddHistory/sections/SectionThree';
import SectionFour from '../AddHistory/sections/SectionFour';
import SectionFive from '../AddHistory/sections/SectionFive';
import SectionSix from '../AddHistory/sections/SectionSix';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AddHistory = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { patientId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("reportFile", formData?.sectionSix?.reportFile || null);
      data.append("patientId", patientId);
      data.append("formData", JSON.stringify(formData));

      const res = await axios.post("/api/history/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("History saved successfully!");
      navigate(`/centeradmin/patients/${patientId}/view-history`);
    } catch (err) {
      console.error("Error saving history:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Add Patient History</h1>
      <form onSubmit={handleSubmit}>
        <SectionOne formData={formData} setFormData={setFormData} />
        <SectionTwo formData={formData} setFormData={setFormData} />
        <SectionThree formData={formData} setFormData={setFormData} />
        <SectionFour formData={formData} setFormData={setFormData} />
        <SectionFive formData={formData} setFormData={setFormData} />
        <SectionSix formData={formData} setFormData={setFormData} />

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            {loading ? "Saving..." : "Save History"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHistory;
