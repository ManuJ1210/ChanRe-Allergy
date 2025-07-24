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
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Patients</h1>
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium">S.No</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Age</th>
                <th className="px-4 py-3 text-left font-medium">Gender</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-6">Loading patients...</td></tr>
              ) : error ? (
                <tr><td colSpan="7" className="text-center py-6 text-red-600">{error}</td></tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{patient.name}</td>
                    <td className="px-4 py-3">{patient.email}</td>
                    <td className="px-4 py-3">{patient.contact || patient.phone}</td>
                    <td className="px-4 py-3">{patient.age}</td>
                    <td className="px-4 py-3 capitalize">{patient.gender}</td>
                    <td className="px-4 py-3 space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/receptionist/add-test/${patient._id}`)}
                        className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md hover:bg-orange-200 transition"
                      >
                        Add Test
                      </button>
                      <button
                        onClick={() => navigate(`/receptionist/add-history/${patient._id}`)}
                        className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md hover:bg-yellow-200 transition"
                      >
                        Add History
                      </button>
                      <button
                        onClick={() => navigate(`/receptionist/add-medications/${patient._id}`)}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-200 transition"
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
