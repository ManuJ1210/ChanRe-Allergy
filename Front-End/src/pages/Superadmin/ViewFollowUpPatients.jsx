// src/pages/followup/ViewFollowUpPatients.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ViewFollowUpPatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/followup/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">Patient List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-2">Patient Name</th>
              <th className="px-4 py-2">Center Code</th>
              <th className="px-4 py-2">Registered Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{patient.name}</td>
                <td className="px-4 py-2">{patient.centerCode}</td>
                <td className="px-4 py-2">{new Date(patient.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 space-x-2">
                  {patient.conditions?.map((condition, index) => (
                    <span
                      key={index}
                      className={`inline-block px-2 py-1 rounded text-white text-xs ${
                        condition === "Allergic Rhinitis"
                          ? "bg-indigo-600"
                          : condition === "Atopic Dermatis"
                          ? "bg-red-500"
                          : condition === "Allergic Conjuctivities"
                          ? "bg-emerald-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {condition}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-400">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
