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
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Patient List</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium">S.No</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Age</th>
              <th className="px-4 py-3 text-left font-medium">Gender</th>
              <th className="px-4 py-3 text-left font-medium">Center Code</th>
              <th className="px-4 py-3 text-left font-medium">Assigned Doctor</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patients.length === 0 ? (
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
                  <td className="px-4 py-3">{patient.centerCode || 'N/A'}</td>
                  <td className="px-4 py-3">{patient.assignedDoctor?.name || 'N/A'}</td>
                  <td className="px-4 py-3 space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/CenterAdmin/patients/ViewProfile/${patient._id}`)}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate(`/CenterAdmin/patients/EditPatient/${patient._id}`)}
                      className="bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200 transition"
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
  );
}
