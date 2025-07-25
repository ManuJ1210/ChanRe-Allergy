import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import ReceptionistLayout from './ReceptionistLayout';

export default function ManagePatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="p-10 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-3xl font-extrabold text-blue-500 mb-10 text-center tracking-tight">Manage Patients</h1>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-blue-100">
          <table className="min-w-full divide-y divide-blue-100 text-base text-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">S.No</th>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Phone</th>
                <th className="px-6 py-4 text-left font-semibold">Age</th>
                <th className="px-6 py-4 text-left font-semibold">Gender</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-blue-600">Loading patients...</td></tr>
              ) : error ? (
                <tr><td colSpan="7" className="text-center py-8 text-red-600">{error}</td></tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <tr key={patient._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{patient.name}</td>
                    <td className="px-6 py-4 text-slate-500">{patient.email}</td>
                    <td className="px-6 py-4 text-slate-500">{patient.contact || patient.phone}</td>
                    <td className="px-6 py-4 text-slate-500">{patient.age}</td>
                    <td className="px-6 py-4 capitalize text-slate-500">{patient.gender}</td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/receptionist/add-test/${patient._id}`)}
                        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all"
                      >
                        Add Test
                      </button>
                      <button
                        onClick={() => navigate(`/receptionist/add-history/${patient._id}`)}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold hover:bg-blue-200 transition-all"
                      >
                        Add History
                      </button>
                      <button
                        onClick={() => navigate(`/receptionist/add-medications/${patient._id}`)}
                        className="bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-semibold hover:bg-blue-300 transition-all"
                      >
                        Add Medications
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ReceptionistLayout>
  );
}
