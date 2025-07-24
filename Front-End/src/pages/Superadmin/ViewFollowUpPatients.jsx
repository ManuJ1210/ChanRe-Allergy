// src/pages/followup/ViewFollowUpPatients.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function ViewFollowUpPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/followups/patients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  const typeToRoute = {
    "Allergic Rhinitis": (patientId) => `/Superadmin/AllergicRhinitisList/${patientId}`,
    "Atopic Dermatitis": (patientId) => `/Superadmin/AtopicDermatitisList/${patientId}`,
    "Allergic Conjunctivitis": (patientId) => `/Superadmin/AllergicConjunctivitisList/${patientId}`,
    "Allergic Bronchitis": (patientId) => `/Superadmin/AllergicBronchitisList/${patientId}`,
  };

  const typeToColor = {
    "Allergic Rhinitis": "bg-indigo-600 hover:bg-indigo-700",
    "Atopic Dermatitis": "bg-red-500 hover:bg-red-600",
    "Allergic Conjunctivitis": "bg-emerald-500 hover:bg-emerald-600",
    "Allergic Bronchitis": "bg-blue-500 hover:bg-blue-600",
  };

  const followupTypes = [
    "Allergic Rhinitis",
    "Atopic Dermatitis",
    "Allergic Conjunctivitis",
    "Allergic Bronchitis",
  ];

  // Filter patients by search
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Patient List</h1>
        <div className="flex justify-between items-center mb-4">
          <div />
          <input
            type="text"
            placeholder="Search by patient name..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">S.No</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">Patient Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">Center Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">Center Code</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">Registered Date</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, idx) => (
                <tr
                  key={patient._id}
                  className={
                    idx % 2 === 0
                      ? "bg-white hover:bg-blue-50 transition"
                      : "bg-blue-50 hover:bg-blue-100 transition"
                  }
                >
                  <td className="px-6 py-3 text-center font-semibold">{idx + 1}</td>
                  <td className="px-6 py-3 text-center font-medium text-gray-800">{patient.name}</td>
                  <td className="px-6 py-3 text-center">{patient.centerName || '-'}</td>
                  <td className="px-6 py-3 text-center">{patient.centerCode}</td>
                  <td className="px-6 py-3 text-center">{new Date(patient.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex flex-row gap-2 justify-center items-center whitespace-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50" style={{ minWidth: 340 }}>
                        {followupTypes.map((condition, index) => (
                          <button
                            key={index}
                            className={`min-w-[120px] px-3 py-1 rounded-lg text-white text-xs font-semibold shadow ${typeToColor[condition]} transition-all duration-150`}
                            onClick={() => navigate(typeToRoute[condition](patient._id))}
                          >
                            {condition}
                          </button>
                        ))}
                      </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
