import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatients } from "../../../features/patient/patientThunks";
import { useNavigate } from "react-router-dom";
import { deletePatient } from '../../../features/patient/patientThunks';

export default function PatientList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { patients, getLoading } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getPatients());
  }, [dispatch]);

  const handleDelete = (id) => {
    console.log("Deleting patient:", id);
    if (window.confirm('Are you sure you want to delete this patient?')) {
      dispatch(deletePatient(id));
    }
  };

  if (getLoading) {
    return <div className="text-center py-10">Loading patients...</div>;
  }

  return (
    <div className="mt-6  flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-500 ">Patient List</h1>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-blue-100 p-2">
          <table className="min-w-full divide-y divide-blue-100 text-base">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">S.No</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Name</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Email</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Phone</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Age</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Gender</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Center Code</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Assigned Doctor</th>
                <th className="px-6 py-4 text-slate-700 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-slate-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <tr key={patient._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-center font-semibold">{index + 1}</td>
                    <td className="px-6 py-4 text-center text-slate-700">{patient.name}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{patient.email}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{patient.contact || patient.phone}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{patient.age}</td>
                    <td className="px-6 py-4 text-center text-slate-500 capitalize">{patient.gender}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{patient.centerCode || 'N/A'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{patient.assignedDoctor?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/CenterAdmin/patients/ViewProfile/${patient._id}`)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 font-semibold transition"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate(`/CenterAdmin/patients/EditPatient/${patient._id}`)}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 font-semibold transition"
                      >
                        Edit
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
