import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddFollowUp from "./AddFollowUp";
// import AddAllergicRhinitis from "./AddAllergicRhinitis"; // Not needed as a modal now
import AtopicDermatitisDetails from './Atopic Dermatitis/ViewAtopicDermatitis'; // (to be created)

const FOLLOWUP_TYPES = [
  "Allergic Rhinitis",
  "Atopic Dermatitis",
  "Allergic Conjunctivitis",
  "Allergic Bronchitis",
  "GPE"
];

const FollowUp = ({ patientId: propPatientId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const patientId = propPatientId || params.patientId || params.id;
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [allergicRhinitisDetails, setAllergicRhinitisDetails] = useState(null);
  const [atopicDermatitisRecords, setAtopicDermatitisRecords] = useState([]);
  const [allergicConjunctivitisRecords, setAllergicConjunctivitisRecords] = useState([]);
  const [allergicBronchitisRecords, setAllergicBronchitisRecords] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);
  const [gpeRecords, setGpeRecords] = useState([]);
  // Removed: const [patientDetailsMap, setPatientDetailsMap] = useState({});

  const fetchFollowUps = async () => {
    if (!patientId) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/followups?patientId=${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowUps(res.data);
    } catch (err) {
      setError("Failed to fetch follow ups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!patientId) return;

    const fetchAllFollowUps = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all types in parallel
        const [
          followUpRes,
          atopicRes,
          conjunctivitisRes,
          bronchitisRes,
          gpeRes
        ] = await Promise.all([
          axios.get(`http://localhost:5000/api/followups?patientId=${patientId}`, { headers }),
          axios.get(`http://localhost:5000/api/atopic-dermatitis?patientId=${patientId}`, { headers }),
          axios.get(`http://localhost:5000/api/allergic-conjunctivitis?patientId=${patientId}`, { headers }),
          axios.get(`http://localhost:5000/api/allergic-bronchitis?patientId=${patientId}`, { headers }),
          axios.get(`http://localhost:5000/api/gpe?patientId=${patientId}`, { headers })
        ]);

        // Merge all results into one array
        const merged = [
          ...followUpRes.data,
          ...atopicRes.data.map(r => ({ ...r, type: "Atopic Dermatitis", date: r.createdAt, updatedBy: r.updatedBy, symptoms: r.symptoms })),
          ...conjunctivitisRes.data.map(r => ({ ...r, type: "Allergic Conjunctivitis", date: r.createdAt, updatedBy: r.updatedBy, symptoms: r.symptoms })),
          ...bronchitisRes.data.map(r => ({ ...r, type: "Allergic Bronchitis", date: r.createdAt, updatedBy: r.updatedBy, symptoms: r.symptoms })),
          ...gpeRes.data.map(r => ({ ...r, type: "GPE", date: r.createdAt, updatedBy: r.updatedBy }))
        ];

        setFollowUps(merged);
        setAtopicDermatitisRecords(atopicRes.data);
        setAllergicConjunctivitisRecords(conjunctivitisRes.data);
        setAllergicBronchitisRecords(bronchitisRes.data);
        setGpeRecords(gpeRes.data);
      } catch (err) {
        setError("Failed to fetch follow ups");
      } finally {
        setLoading(false);
      }
    };

    fetchAllFollowUps();
    // Fetch patient details
    const fetchPatientDetails = async () => {
      if (!patientId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/patients/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatientDetails(res.data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchPatientDetails();
    // eslint-disable-next-line
  }, [patientId]);

  // Removed the useEffect for fetching patient details per Atopic Dermatitis record

  // Group follow-ups by type
  const grouped = FOLLOWUP_TYPES.reduce((acc, type) => {
    acc[type] = followUps.filter(fu => fu.type === type);
    return acc;
  }, {});

  // Table headers for each type
  const getHeaders = (type) => {
    // All types use the same columns now
    return ["Patient Name", "Age", "Center Code", "Contact", "Updated date", "Action"];
  };

  // Table row rendering for each type
  const renderRow = (type, fu) => {
    const patient = fu.patientId || {};
    return (
      <tr key={fu._id}>
        <td className="border px-2 py-1">{patient.name || "-"}</td>
        <td className="border px-2 py-1">{patient.age || "-"}</td>
        <td className="border px-2 py-1">{patient.centerCode || patient.center?.code || "-"}</td>
        <td className="border px-2 py-1">{patient.phone || patient.contact || "-"}</td>
        <td className="border px-2 py-1">{
  fu.updatedAt
    ? new Date(fu.updatedAt).toLocaleDateString()
    : (fu.createdAt ? new Date(fu.createdAt).toLocaleDateString() : "-")
}</td>
        <td className="border px-2 py-1 text-center">
          <button
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
            onClick={() => {
              if (type === "Allergic Rhinitis") {
                navigate(`/CenterAdmin/patients/FollowUp/ViewAllergicRhinitis/${fu.allergicRhinitisId}`);
              } else if (type === "Allergic Conjunctivitis") {
                console.log('Navigating to Allergic Conjunctivitis details:', fu._id, fu);
                navigate(`/CenterAdmin/patients/FollowUp/ViewAllergicConjunctivitis/${fu._id}`);
              } else if (type === "Atopic Dermatitis") {
                navigate(`/CenterAdmin/patients/FollowUp/ViewAtopicDermatitis/${fu._id}`);
              } else if (type === "Allergic Bronchitis") {
                navigate(`/CenterAdmin/patients/FollowUp/ViewAllergicBronchitis/${fu._id}`);
              } else if (type === "GPE") {
                navigate(`/CenterAdmin/patients/FollowUp/ViewGPE/${fu._id}`);
              }
            }}
            disabled={
              (type === "Allergic Rhinitis" && !fu.allergicRhinitisId) ||
              (type === "Atopic Dermatitis" && !fu._id) ||
              (type === "Allergic Conjunctivitis" && !fu._id) ||
              (type === "Allergic Bronchitis" && !fu._id) ||
              (type === "GPE" && !fu._id)
            }
            title={
              type === "Allergic Rhinitis"
                ? 'View Allergic Rhinitis Details'
                : type === "Allergic Conjunctivitis"
                  ? 'View Allergic Conjunctivitis Details'
                  : type === "Atopic Dermatitis"
                    ? 'View Atopic Dermatitis Details'
                    : type === "Allergic Bronchitis"
                      ? 'View Allergic Bronchitis Details'
                      : type === "GPE"
                        ? 'View GPE Details'
                        : 'No details available'
            }
          >
            View Details
          </button>
        </td>
      </tr>
    );
  };

  const handleView = async (fu) => {
    setViewModal(true);
    setSelectedFollowUp(fu);
    setViewLoading(true);
    setViewError("");
    setAllergicRhinitisDetails(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/patients/${fu.patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPatient(res.data);
      if (fu.type === "Allergic Rhinitis" && fu.allergicRhinitisId) {
        try {
          const resRhinitis = await axios.get(
            `http://localhost:5000/api/allergic-rhinitis/${fu.allergicRhinitisId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAllergicRhinitisDetails(resRhinitis.data);
        } catch (err) {
          setAllergicRhinitisDetails(null);
        }
      }
    } catch (err) {
      setViewError("Failed to fetch patient details");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-10 text-blue-500 text-center tracking-tight">Follow Up</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        FOLLOWUP_TYPES.map(type => (
          <div key={type} className="mb-10 bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-700">{type}</h3>
              <button
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all"
                onClick={() => {
                  if (type === "Allergic Rhinitis") {
                    navigate(`/CenterAdmin/patients/FollowUp/AddAllergicRhinitis/${patientId}`);
                  } else if (type === "Atopic Dermatitis") {
                    navigate(`/CenterAdmin/patients/FollowUp/AtopicDermatitis/${patientId}`);
                  } else if (type === "Allergic Conjunctivitis") {
                    navigate(`/CenterAdmin/patients/FollowUp/AddAllergicConjunctivitis/${patientId}`);
                  } else if (type === "Allergic Bronchitis") {
                    navigate(`/CenterAdmin/patients/FollowUp/AddAllergicBronchitis/${patientId}`);
                  } else if (type === "GPE") {
                    navigate(`/CenterAdmin/patients/FollowUp/AddGPE/${patientId}`);
                  } else {
                    // For other types, you can add navigation or logic as needed
                  }
                }}
              >
                Add Follow Up
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-base border rounded-xl overflow-x-auto">
                <thead className="bg-blue-50 text-blue-700">
                  <tr>
                    {getHeaders(type).map(h => (
                      <th key={h} className="border px-3 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grouped[type] && grouped[type].length > 0 ? (
                    grouped[type].map(fu => renderRow(type, fu))
                  ) : (
                    <tr>
                      <td colSpan={getHeaders(type).length} className="text-center text-slate-400 py-2">No follow ups found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
      <div className="mb-10 bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-700">Atopic Dermatitis</h3>
          <button
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all"
            onClick={() => navigate(`/CenterAdmin/patients/FollowUp/AtopicDermatitis/${patientId}`)}
          >
            Add Follow Up
          </button>
        </div>
        {/* Patient details for Atopic Dermatitis */}
        {patientDetails && (
          <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-wrap gap-6">
            <div><span className="font-semibold text-slate-700">Name:</span> {patientDetails.name || '-'}</div>
            <div><span className="font-semibold text-slate-700">Age:</span> {patientDetails.age || '-'}</div>
            <div><span className="font-semibold text-slate-700">Gender:</span> {patientDetails.gender || '-'}</div>
            <div><span className="font-semibold text-slate-700">Center Code:</span> {patientDetails.centerCode || patientDetails.center?.code || '-'}</div>
            <div><span className="font-semibold text-slate-700">Phone:</span> {patientDetails.phone || patientDetails.contact || '-'}</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-base border rounded-xl overflow-x-auto">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="border px-3 py-2">Patient Name</th>
                <th className="border px-3 py-2">Age</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Symptoms</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {atopicDermatitisRecords.length > 0 ? (
                atopicDermatitisRecords.map(record => {
                  const patient = record.patientId || {};
                  return (
                    <tr key={record._id}>
                      <td className="border px-3 py-2">{patient.name || "-"}</td>
                      <td className="border px-3 py-2">{patient.age || "-"}</td>
                      <td className="border px-3 py-2">{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}</td>
                      <td className="border px-3 py-2">{record.symptoms || "-"}</td>
                      <td className="border px-3 py-2 text-center">
                        <button
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          onClick={() => navigate(`/CenterAdmin/patients/FollowUp/ViewAtopicDermatitis/${record._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400 py-2">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FollowUp; 