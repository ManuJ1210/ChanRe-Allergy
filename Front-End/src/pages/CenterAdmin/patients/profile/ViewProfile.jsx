import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUserCircle, FaEdit, FaHistory, FaAllergies, FaNotesMedical, FaVial, FaUserMd, FaSyringe
} from "react-icons/fa";
import axios from "axios";
import FollowUp from "../FollowUp/FollowUp";
import PrescriptionList from '../FollowUp/Prescription/PrescriptionList';

const TABS = ["Overview", "Follow Up", "Prescription"];

const ViewProfile = () => {
  const params = useParams();
  const patientId = params.patientId || params.id;
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [medLoading, setMedLoading] = useState(true);
  const [medError, setMedError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) {
      setError("No patient ID provided in the URL.");
      setLoading(false);
      return;
    }
    const fetchPatient = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/patients/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatient(res.data);
      } catch (err) {
        setError("Failed to fetch patient");
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  useEffect(() => {
    if (!patientId) return;
    const fetchMedications = async () => {
      setMedLoading(true);
      setMedError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/medications?patientId=${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMedications(res.data);
      } catch (err) {
        setMedError("Failed to fetch medications");
      } finally {
        setMedLoading(false);
      }
    };
    fetchMedications();
  }, [patientId]);

  useEffect(() => {
    if (!patientId) return;
    const fetchHistory = async () => {
      setHistoryLoading(true);
      setHistoryError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/history/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistory(res.data);
      } catch (err) {
        setHistoryError("Failed to fetch history");
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [patientId]);

  if (!patientId) return <div className="p-8 text-center text-red-600">No patient ID provided in the URL.</div>;
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!patient) return <div className="p-8 text-center text-red-600">Patient not found.</div>;

  return (
    <div className="p-4 sm:p-8 mt-6">
      {/* Header */}
      <div className="relative rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-end justify-between mb-10 shadow-xl bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-100">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-blue-300 overflow-hidden">
            <FaUserCircle className="text-blue-500 text-7xl" />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-blue-500 mb-1">{patient.name}</h2>
            <div className="flex flex-wrap gap-4 text-slate-700 text-base">
              <span className="font-medium capitalize">{patient.gender}</span>
              {patient.address && <span>{patient.address}</span>}
              {patient.email && <span>{patient.email}</span>}
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <button
            onClick={() => navigate(`/CenterAdmin/patients/EditPatient/${patient._id}`)}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <FaEdit /> Edit Profile
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-4 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-8 py-3 rounded-full font-semibold shadow transition-all duration-150 text-lg ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-100"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {activeTab === "Overview" && (
        <>
          {/* Patient Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-100">
            <h3 className="text-2xl font-bold mb-8 text-blue-700">Patient Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-3"><span className="font-semibold text-slate-700">Full Name :</span> {patient.name}</div>
                <div className="mb-3"><span className="font-semibold text-slate-700">Mobile :</span> {patient.phone || patient.contact || 'N/A'}</div>
                <div className="mb-3"><span className="font-semibold text-slate-700">E-mail :</span> {patient.email || 'N/A'}</div>
                <div className="mb-3"><span className="font-semibold text-slate-700">Location :</span> {patient.address || 'N/A'}</div>
                <div className="mb-3"><span className="font-semibold text-slate-700">Center Code :</span> {patient.centerCode || 'N/A'}</div>
              </div>
              <div>
                <div className="mb-3"><span className="font-semibold text-slate-700">Assigned Doctor :</span> {patient.assignedDoctor?.name || patient.assignedDoctor || 'N/A'}</div>
                <div className="mb-3"><span className="font-semibold text-slate-700">Gender :</span> {patient.gender}</div>
                <div className="mb-3"><span className="font-semibold text-slate-700">Age :</span> {patient.age}</div>
              </div>
            </div>
          </div>
          {/* Investigations */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-100">
            <h3 className="text-2xl font-bold mb-8 text-blue-700">Investigations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-base border rounded-xl overflow-x-auto">
                <thead className="bg-blue-50 text-blue-700">
                  <tr>
                    <th className="border px-3 py-2">Date</th>
                    <th className="border px-3 py-2">CBC</th>
                    <th className="border px-3 py-2">hb</th>
                    <th className="border px-3 py-2">tc</th>
                    <th className="border px-3 py-2">dc</th>
                    <th className="border px-3 py-2">N</th>
                    <th className="border px-3 py-2">E</th>
                    <th className="border px-3 py-2">L</th>
                    <th className="border px-3 py-2">M</th>
                    <th className="border px-3 py-2">Platelets</th>
                    <th className="border px-3 py-2">ESR</th>
                    <th className="border px-3 py-2">Serum Creatinine</th>
                    <th className="border px-3 py-2">Serum IgE Levels</th>
                    <th className="border px-3 py-2">C3, C4 Levels</th>
                    <th className="border px-3 py-2">ANA</th>
                    <th className="border px-3 py-2">Urine Routine</th>
                    <th className="border px-3 py-2">Allergy Panel</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.tests && patient.tests.length > 0 ? (
                    patient.tests.map((test, idx) => (
                      <tr key={idx} className="hover:bg-blue-50">
                        <td className="border px-3 py-2">{test.date ? new Date(test.date).toLocaleDateString() : ''}</td>
                        <td className="border px-3 py-2">{test.CBC || ''}</td>
                        <td className="border px-3 py-2">{test.Hb || ''}</td>
                        <td className="border px-3 py-2">{test.TC || ''}</td>
                        <td className="border px-3 py-2">{test.DC || ''}</td>
                        <td className="border px-3 py-2">{test.Neutrophils || ''}</td>
                        <td className="border px-3 py-2">{test.Eosinophil || ''}</td>
                        <td className="border px-3 py-2">{test.Lymphocytes || ''}</td>
                        <td className="border px-3 py-2">{test.Monocytes || ''}</td>
                        <td className="border px-3 py-2">{test.Platelets || ''}</td>
                        <td className="border px-3 py-2">{test.ESR || ''}</td>
                        <td className="border px-3 py-2">{test.SerumCreatinine || ''}</td>
                        <td className="border px-3 py-2">{test.SerumIgELevels || ''}</td>
                        <td className="border px-3 py-2">{test.C3C4Levels || ''}</td>
                        <td className="border px-3 py-2">{test.ANA_IF || ''}</td>
                        <td className="border px-3 py-2">{test.UrineRoutine || ''}</td>
                        <td className="border px-3 py-2">{test.AllergyPanel || ''}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={17} className="text-center text-slate-400 py-2">No investigations found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Medications */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-100">
            <h3 className="text-2xl font-bold mb-8 text-blue-700">Medications</h3>
            {medLoading ? (
              <div className="text-blue-600">Loading medications...</div>
            ) : medError ? (
              <div className="text-red-600">{medError}</div>
            ) : medications.length === 0 ? (
              <div className="text-slate-400">No medications found.</div>
            ) : (
              <table className="min-w-full text-base border rounded-xl overflow-hidden">
                <thead className="bg-blue-50 text-blue-700">
                  <tr>
                    <th className="border px-3 py-2">Drug Name</th>
                    <th className="border px-3 py-2">Dose</th>
                    <th className="border px-3 py-2">Duration</th>
                    <th className="border px-3 py-2">Adverse Effect</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med, idx) => (
                    <tr key={idx} className="hover:bg-blue-50">
                      <td className="border px-3 py-2">{med.drugName}</td>
                      <td className="border px-3 py-2">{med.dose}</td>
                      <td className="border px-3 py-2">{med.duration}</td>
                      <td className="border px-3 py-2">{med.adverseEvent || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* History */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-blue-100">
            <h3 className="text-2xl font-bold mb-8 text-blue-700 flex items-center gap-2">
              <FaHistory className="text-blue-500" /> History
            </h3>
            {historyLoading ? (
              <div className="text-blue-600">Loading history...</div>
            ) : historyError ? (
              <div className="text-red-600">{historyError}</div>
            ) : history.length === 0 ? (
              <div className="text-slate-400">No history found.</div>
            ) : (
              <div className="space-y-10">
                {history.map((h, idx) => (
                  <div
                    key={h._id || idx}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm text-blue-500 mb-4">
                      <FaNotesMedical className="text-blue-400" />
                      {h.createdAt ? new Date(h.createdAt).toLocaleDateString() : ""}
                    </div>
                    {/* Section 1: Conditions */}
                    {h.sectionOne?.conditions && (
                      <div className="mb-4">
                        <div className="font-semibold text-blue-700 mb-2">Section 1: Conditions</div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                          {Object.entries(h.sectionOne.conditions).map(([key, value]) => (
                            <div key={key} className="flex">
                              <dt className="w-44 font-medium text-gray-700">{key}:</dt>
                              <dd className="text-gray-800">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                    {/* Section 2: Hay Fever & Asthma */}
                    {h.sectionTwo && Object.keys(h.sectionTwo).length > 0 && (
                      <div className="mb-4">
                        <div className="font-semibold text-blue-700 mb-2">Section 2: Hay Fever & Asthma</div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                          {Object.entries(h.sectionTwo).map(([key, value]) => (
                            <div key={key} className="flex">
                              <dt className="w-44 font-medium text-gray-700">{key}:</dt>
                              <dd className="text-gray-800">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                    {/* Section 3: Frequency and Triggers */}
                    {h.sectionThree && Object.keys(h.sectionThree).length > 0 && (
                      <div className="mb-4">
                        <div className="font-semibold text-blue-700 mb-2">Section 3: Frequency and Triggers</div>
                        {h.sectionThree.questions && (
                          <div className="mb-2">
                            <span className="font-medium">Questions:</span>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                              {Object.entries(h.sectionThree.questions).map(([key, value]) => (
                                <div key={key} className="flex">
                                  <dt className="w-44 font-medium text-gray-700">{key}:</dt>
                                  <dd className="text-gray-800">{value}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        )}
                        {h.sectionThree.triggers && h.sectionThree.triggers.length > 0 && (
                          <div className="mb-2">
                            <span className="font-medium">Triggers:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {h.sectionThree.triggers.map((trigger, i) => (
                                <span key={i} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">{trigger}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {h.sectionThree.otherTrigger && (
                          <div><span className="font-medium">Other Trigger:</span> {h.sectionThree.otherTrigger}</div>
                        )}
                      </div>
                    )}
                    {/* Section 4: Allergic Rhinitis */}
                    {h.sectionFour && Object.keys(h.sectionFour).length > 0 && (
                      <div className="mb-4">
                        <div className="font-semibold text-blue-700 mb-2">Section 4: Allergic Rhinitis</div>
                        {h.sectionFour.rhinitisType && (
                          <div className="mb-1">
                            <span className="font-medium">Rhinitis Type:</span> {h.sectionFour.rhinitisType}
                          </div>
                        )}
                        {h.sectionFour.symptoms && Object.keys(h.sectionFour.symptoms).length > 0 && (
                          <div>
                            <span className="font-medium">Symptoms:</span>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                              {Object.entries(h.sectionFour.symptoms).map(([symptom, severity]) => (
                                <div key={symptom} className="flex">
                                  <dt className="w-44 font-medium text-gray-700">{symptom}:</dt>
                                  <dd className="text-gray-800">{severity}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Section 5: Skin Allergy & History */}
                    {h.sectionFive && Object.keys(h.sectionFive).length > 0 && (
                      <div className="mb-4">
                        <div className="font-semibold text-blue-700 mb-2">Section 5: Skin Allergy & History</div>
                        {h.sectionFive.allergyType && (
                          <div className="mb-1">
                            <span className="font-medium">Allergy Type:</span> {h.sectionFive.allergyType}
                          </div>
                        )}
                        {h.sectionFive.skinAllergy && Object.keys(h.sectionFive.skinAllergy).length > 0 && (
                          <div>
                            <span className="font-medium">Skin Allergy:</span>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                              {Object.entries(h.sectionFive.skinAllergy).map(([cond, details]) => (
                                <div key={cond} className="flex">
                                  <dt className="w-44 font-medium text-gray-700">{cond}:</dt>
                                  <dd className="text-gray-800">
                                    {details.answer && <span>Answer: {details.answer}; </span>}
                                    {details.distribution && <span>Distribution: {details.distribution}</span>}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        )}
                        {h.sectionFive.history && Object.keys(h.sectionFive.history).length > 0 && (
                          <div>
                            <span className="font-medium">History:</span>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                              {Object.entries(h.sectionFive.history).map(([cond, value]) => (
                                <div key={cond} className="flex">
                                  <dt className="w-44 font-medium text-gray-700">{cond}:</dt>
                                  <dd className="text-gray-800">{value}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Section 6: Drugs, Exposure & Examination */}
                    {h.sectionSix && Object.keys(h.sectionSix).length > 0 && (
                      <div>
                        <div className="font-semibold text-blue-700 mb-2">Section 6: Drugs, Exposure & Examination</div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                          {Object.entries(h.sectionSix).map(([key, value]) => (
                            <div key={key} className="flex">
                              <dt className="w-44 font-medium text-gray-700">{key}:</dt>
                              <dd className="text-gray-800">{typeof value === 'object' ? JSON.stringify(value) : value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      {activeTab === "Follow Up" && <FollowUp />}
      {activeTab === "Prescription" && <PrescriptionList patientId={patient?._id || params.patientId || params.id} />}
    </div>
  );
};

export default ViewProfile; 