import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaVial, FaRegSmile, FaPills, FaStethoscope } from "react-icons/fa";

const Section = ({ icon, title, children }) => (
  <div className="mb-8">
    <div className="flex items-center mb-2">
      {icon && <span className="text-blue-500 mr-2 text-xl">{icon}</span>}
      <h3 className="font-bold text-lg text-blue-700">{title}</h3>
    </div>
    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">{children}</div>
  </div>
);

const ViewAllergicRhinitis = () => {
  const { allergicRhinitisId } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDrawer, setShowDrawer] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/allergic-rhinitis/${allergicRhinitisId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDetails(res.data);
      } catch (err) {
        setError("Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [allergicRhinitisId]);

  if (!showDrawer) return null;
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Details not found. The record may have been deleted or never created.</div>;
  if (!details) return <div className="p-6">No details found.</div>;

  // Patient details block
  const patient = details.patientId;

  return (
    <div>
      {/* Overlay for small screens */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 block md:hidden"
        onClick={() => setShowDrawer(false)}
      />
      {/* Drawer on small screens, centered card on md+ */}
      <div
        className="fixed md:static top-0 right-0 h-full md:h-auto w-full md:w-auto z-50 transition-transform duration-300
          bg-white md:bg-transparent shadow-2xl md:shadow-none
          md:rounded-2xl md:max-w-2xl md:mx-auto md:my-8 border border-blue-100"
        style={{
          transform: showDrawer
            ? 'translateX(0)'
            : 'translateX(100%)',
        }}
      >
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-blue-500 text-2xl md:hidden"
          onClick={() => setShowDrawer(false)}
        >
          &times;
        </button>
        <div className="p-8 md:p-8">
          <h2 className="text-3xl font-extrabold mb-8 text-blue-500 text-center tracking-tight">Allergic Rhinitis Details</h2>
          {/* Patient details */}
          {patient && (
            <div className="mb-8 p-4 bg-blue-50 rounded-xl flex flex-wrap gap-6 justify-center border border-blue-100">
              <div><span className="font-semibold">Name:</span> {patient.name}</div>
              <div><span className="font-semibold">Age:</span> {patient.age}</div>
              <div><span className="font-semibold">Gender:</span> {patient.gender}</div>
              <div><span className="font-semibold">Center Code:</span> {patient.centerCode}</div>
              <div><span className="font-semibold">Phone:</span> {patient.phone}</div>
            </div>
          )}
          <Section icon={<FaVial />} title="Nasal Symptoms">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
              {Object.entries(details.nasalSymptoms || {}).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="font-medium">{k}</span>
                  <span className="text-blue-700 font-bold">{v}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section icon={<FaRegSmile />} title="Non-Nasal Symptoms">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
              {Object.entries(details.nonNasalSymptoms || {}).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="font-medium">{k}</span>
                  <span className="text-blue-700 font-bold">{v}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section icon={<FaStethoscope />} title="Quality of Life">
            <div className="text-xl text-blue-800 font-bold">{details.qualityOfLife}</div>
          </Section>
          <Section icon={<FaPills />} title="Medications">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
              {Object.entries(details.medications || {}).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="font-medium">{k}</span>
                  <span className="text-blue-700 font-bold">{v}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section icon={<FaStethoscope />} title="ENT Examination">
            <div className="text-blue-900 font-semibold">{details.entExamination}</div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ViewAllergicRhinitis; 