import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPatients } from "../../../features/patient/patientThunks";
import { useNavigate } from "react-router-dom";

export default function ManagePatients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { patients = [], loading, error } = useSelector((state) => state.patient);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  if (loading) return <div className="text-center py-10">Loading patients...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="mt-6 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-500 tracking-tight">Manage Patients</h1>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl p-2">
          <table className="min-w-full divide-y divide-blue-100 text-base">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">S.No</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Name</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Email</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Phone</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Age</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Gender</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                (patients || []).map((patient, index) => (
                  <tr key={patient?._id || index} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-center font-semibold">{index + 1}</td>
                    <td className="px-6 py-4 text-center text-slate-700">{patient?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{patient?.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{patient?.contact || patient?.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{patient?.age || 'N/A'}</td>
                    <td className="px-6 py-4 text-center text-slate-500 capitalize">{patient?.gender || 'N/A'}</td>
                    <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/dashboard/CenterAdmin/patients/AddTest/${patient?._id}`)}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 font-semibold transition"
                      >
                        Add Test
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/CenterAdmin/patients/AddHistory/${patient?._id}`)}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 font-semibold transition"
                      >
                        Add History
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/CenterAdmin/patients/profile/AddMedications/${patient?._id}`)}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 font-semibold transition"
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
    </div>
  );
}
