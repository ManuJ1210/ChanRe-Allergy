import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { useReactToPrint } from "react-to-print";
import { FaDownload, FaListAlt, FaAllergies, FaNotesMedical, FaVial, FaUserMd, FaSyringe } from "react-icons/fa";

const SectionHeader = ({ icon, children }) => (
  <div className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-2 mt-4">
    {icon}
    <span>{children}</span>
  </div>
);

const renderKeyValueTable = (obj) =>
  obj && Object.keys(obj).length > 0 ? (
    <table className="min-w-[200px] mb-2">
      <tbody>
        {Object.entries(obj).map(([key, value]) => (
          <tr key={key}>
            <td className="pr-2 py-1 text-gray-600 font-medium">{key}</td>
            <td className="py-1">{typeof value === "object" ? JSON.stringify(value) : value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <span className="text-gray-400">No data</span>
  );

const renderSkinAllergy = (skinAllergy) =>
  skinAllergy && Object.keys(skinAllergy).length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {Object.entries(skinAllergy).map(([cond, details]) => (
        <div key={cond} className="bg-blue-50 border border-blue-200 rounded px-3 py-1 text-sm">
          <span className="font-semibold">{cond}:</span>{" "}
          {details.answer && <span className="mr-2">Answer: <span className="font-bold">{details.answer}</span></span>}
          {details.distribution && <span>Distribution: <span className="font-bold">{details.distribution}</span></span>}
        </div>
      ))}
    </div>
  ) : (
    <span className="text-gray-400">No data</span>
  );

const renderTriggers = (triggers) =>
  triggers && triggers.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {triggers.map((t, i) => (
        <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">{t}</span>
      ))}
    </div>
  ) : (
    <span className="text-gray-400">No triggers</span>
  );

const ViewHistory = () => {
  const { patientId } = useParams();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/history/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistories(res.data);
      } catch (err) {
        setError("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [patientId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Patient-${patientId}-History`,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Patient History</h2>
        {histories.length > 0 && (
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <FaDownload /> Download PDF
          </button>
        )}
      </div>
      <div ref={printRef}>
        {histories.length === 0 ? (
          <p>No history records found.</p>
        ) : (
          histories.map((history, idx) => (
            <div
              key={history._id}
              className="mb-8 p-6 rounded-xl shadow-lg bg-white border border-blue-100"
            >
              <div className="mb-4 flex items-center gap-2">
                <FaListAlt className="text-blue-400" />
                <span className="font-bold text-gray-700">
                  Date: {new Date(history.createdAt).toLocaleString()}
                </span>
              </div>
              <SectionHeader icon={<FaAllergies />}>Section 1: Conditions</SectionHeader>
              {renderKeyValueTable(history.sectionOne?.conditions)}

              <SectionHeader icon={<FaNotesMedical />}>Section 2: Hay Fever & Asthma</SectionHeader>
              {renderKeyValueTable(history.sectionTwo)}

              <SectionHeader icon={<FaVial />}>Section 3: Frequency and Triggers</SectionHeader>
              <div className="mb-2">
                <div>
                  <span className="font-semibold">Questions:</span> {renderKeyValueTable(history.sectionThree?.questions)}
                </div>
                <div>
                  <span className="font-semibold">Triggers:</span> {renderTriggers(history.sectionThree?.triggers)}
                </div>
                <div>
                  <span className="font-semibold">Other Trigger:</span>{" "}
                  {history.sectionThree?.otherTrigger || <span className="text-gray-400">None</span>}
                </div>
              </div>

              <SectionHeader icon={<FaUserMd />}>Section 4: Allergic Rhinitis</SectionHeader>
              <div>
                <span className="font-semibold">Rhinitis Type:</span>{" "}
                {history.sectionFour?.rhinitisType || <span className="text-gray-400">None</span>}
              </div>
              <div>
                <span className="font-semibold">Symptoms:</span> {renderKeyValueTable(history.sectionFour?.symptoms)}
              </div>

              <SectionHeader icon={<FaSyringe />}>Section 5: Skin Allergy & History</SectionHeader>
              <div>
                <span className="font-semibold">Allergy Type:</span>{" "}
                {history.sectionFive?.allergyType || <span className="text-gray-400">None</span>}
              </div>
              <div>
                <span className="font-semibold">Skin Allergy:</span> {renderSkinAllergy(history.sectionFive?.skinAllergy)}
              </div>
              <div>
                <span className="font-semibold">History:</span> {renderKeyValueTable(history.sectionFive?.history)}
              </div>

              <SectionHeader icon={<FaNotesMedical />}>Section 6: Drugs, Exposure & Examination</SectionHeader>
              {renderKeyValueTable(history.sectionSix)}
              {history.sectionSix?.reportFile && (
                <div>
                  <span className="font-semibold">Report File:</span> {history.sectionSix.reportFile}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewHistory; 