import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddFollowUp from "./AddFollowUp";
// import AddAllergicRhinitis from "./AddAllergicRhinitis"; // Not needed as a modal now
import AtopicDermatitisDetails from '../FollowUp/ViewAtopicDermatitis'; // (to be created)

const FOLLOWUP_TYPES = [
  "Allergic Rhinitis",
  "Atopic Dermatitis",
  "Allergic Conjunctivities",
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
  const [patientDetails, setPatientDetails] = useState(null);

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
    fetchFollowUps();
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
    // Fetch Atopic Dermatitis records and merge into followUps
    const fetchAtopicDermatitis = async () => {
      if (!patientId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/atopic-dermatitis?patientId=${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAtopicDermatitisRecords(res.data);
        // Merge Atopic Dermatitis records into followUps for unified display
        setFollowUps(prev => [
          ...prev.filter(fu => fu.type !== "Atopic Dermatitis"),
          ...res.data.map(r => ({
            ...r,
            type: "Atopic Dermatitis",
            date: r.createdAt,
            updatedBy: r.updatedBy,
            patientId: r.patientId?._id || r.patientId,
            _id: r._id,
            symptoms: r.symptoms,
          }))
        ]);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAtopicDermatitis();
    // eslint-disable-next-line
  }, [patientId]);

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
        <td className="border px-2 py-1">{fu.updatedAt ? new Date(fu.updatedAt).toLocaleDateString() : "-"}</td>
        <td className="border px-2 py-1 text-center">
          <button
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
            onClick={() => type === "Atopic Dermatitis"
              ? navigate(`/CenterAdmin/patients/FollowUp/ViewAtopicDermatitis/${fu._id}`)
              : fu.allergicRhinitisId && navigate(`/CenterAdmin/patients/FollowUp/ViewAllergicRhinitis/${fu.allergicRhinitisId}`)
            }
            disabled={type !== "Atopic Dermatitis" && !fu.allergicRhinitisId}
            title={type === "Atopic Dermatitis" ? 'View Atopic Dermatitis Details' : (fu.allergicRhinitisId ? 'View Allergic Rhinitis Details' : 'No details available')}
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
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Follow Up</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        FOLLOWUP_TYPES.map(type => (
          <div key={type} className="mb-8 bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">{type}</h3>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                onClick={() => {
                  if (type === "Allergic Rhinitis") {
                    navigate(`/CenterAdmin/patients/FollowUp/AddAllergicRhinitis/${patientId}`);
                  } else if (type === "Atopic Dermatitis") {
                    navigate(`/CenterAdmin/patients/FollowUp/AtopicDermatitis/${patientId}`);
                  } else {
                    // For other types, you can add navigation or logic as needed
                  }
                }}
              >
                Add Follow Up
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    {getHeaders(type).map(h => (
                      <th key={h} className="border px-2 py-1">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grouped[type] && grouped[type].length > 0 ? (
                    grouped[type].map(fu => renderRow(type, fu))
                  ) : (
                    <tr>
                      <td colSpan={getHeaders(type).length} className="text-center text-gray-400 py-2">No follow ups found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700">Atopic Dermatitis</h3>
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={() => navigate(`/CenterAdmin/patients/FollowUp/AtopicDermatitis/${patientId}`)}
          >
            Add Follow Up
          </button>
        </div>
        {/* Patient details for Atopic Dermatitis */}
        {patientDetails && (
          <div className="mb-4 p-4 bg-blue-50 rounded flex flex-wrap gap-6">
            <div><span className="font-semibold">Name:</span> {patientDetails.name || '-'}</div>
            <div><span className="font-semibold">Age:</span> {patientDetails.age || '-'}</div>
            <div><span className="font-semibold">Gender:</span> {patientDetails.gender || '-'}</div>
            <div><span className="font-semibold">Center Code:</span> {patientDetails.centerCode || patientDetails.center?.code || '-'}</div>
            <div><span className="font-semibold">Phone:</span> {patientDetails.phone || patientDetails.contact || '-'}</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Symptoms</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {atopicDermatitisRecords.length > 0 ? (
                atopicDermatitisRecords.map(record => (
                  <tr key={record._id}>
                    <td className="border px-2 py-1">{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="border px-2 py-1">{record.symptoms || "-"}</td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        onClick={() => navigate(`/CenterAdmin/patients/FollowUp/ViewAtopicDermatitis/${record._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-2">No records found.</td>
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