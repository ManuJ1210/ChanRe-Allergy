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
                  <td className="px-4 py-3 space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/CenterAdmin/patients/EditPatient/${patient._id}`)}
                      className="bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient._id)}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/CenterAdmin/patients/AddTest/${patient._id}`)}
                      className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md hover:bg-orange-200 transition"
                    >
                      Add Test
                    </button>
                    <button
                      onClick={() => navigate(`/CenterAdmin/patients/AddHistory/${patient._id}`)}
                      className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md hover:bg-yellow-200 transition"
                    >
                      Add History
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Patient Details</h2>
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
            >
              ×
            </button>
            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <p><strong>Phone:</strong> {selectedPatient.contact || selectedPatient.phone}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              {selectedPatient.address && <p><strong>Address:</strong> {selectedPatient.address}</p>}
              {selectedPatient.centerName && <p><strong>Center:</strong> {selectedPatient.centerName}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
