import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import ReceptionistLayout from './ReceptionistLayout';

export default function ReceptionistDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/patients/receptionist/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      setError("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReceptionistLayout>
      <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col gap-8">
        
        

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 tracking-tight">Receptionist Dashboard</h1>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-xl shadow-lg font-semibold text-base transition-all duration-150 flex items-center gap-2"
            onClick={() => navigate("/receptionist/add-patient")}
          >
            <span className="text-lg">+</span> Add Patient
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
          <h2 className="text-xl font-bold mb-6 text-blue-700">My Registered Patients</h2>
          {loading ? (
            <div className="text-blue-600 text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : patients.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No patients found.</div>
          ) : (
            <table className="min-w-full text-sm rounded-xl overflow-hidden shadow border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Age</th>
                  <th className="px-6 py-3 text-left font-semibold">Gender</th>
                  <th className="px-6 py-3 text-left font-semibold">Assigned Doctor</th>
                  <th className="px-6 py-3 text-left font-semibold">Center Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, idx) => (
                  <tr key={p._id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50 hover:bg-blue-100 transition"}>
                    <td className="px-6 py-3 whitespace-nowrap font-medium text-gray-800">{p.name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.age}</td>
                    <td className="px-6 py-3 whitespace-nowrap capitalize">{p.gender}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.assignedDoctor?.name || '-'}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{p.centerId?.name || '-'}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ReceptionistLayout>
  );
} 