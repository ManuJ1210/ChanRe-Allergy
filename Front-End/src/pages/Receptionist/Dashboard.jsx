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
      <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col gap-10">
        
        

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">Receptionist Dashboard</h1>
          <button
            className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg font-semibold text-lg transition-all flex items-center gap-2"
            onClick={() => navigate("/receptionist/add-patient")}
          >
            <span className="text-2xl">+</span> Add Patient
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-10 border border-blue-100 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-8 text-blue-700">My Registered Patients</h2>
          {loading ? (
            <div className="text-blue-600 text-center py-12">Loading...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-12">{error}</div>
          ) : patients.length === 0 ? (
            <div className="text-slate-400 text-center py-12">No patients found.</div>
          ) : (
            <table className="min-w-full text-base rounded-xl overflow-hidden shadow border border-blue-100">
              <thead className="bg-blue-50 text-blue-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Age</th>
                  <th className="px-6 py-4 text-left font-semibold">Gender</th>
                  <th className="px-6 py-4 text-left font-semibold">Assigned Doctor</th>
                  <th className="px-6 py-4 text-left font-semibold">Center Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, idx) => (
                  <tr key={p._id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50 hover:bg-blue-100 transition"}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{p.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-slate-500">{p.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{p.assignedDoctor?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{p.centerId?.name || p.centerCode || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{new Date(p.createdAt).toLocaleString()}</td>
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