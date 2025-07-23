import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import {
  getSinglePatient,
  fetchPatientTests,
} from "../../../features/patient/patientThunks";


const ShowTests = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const { selectedPatient, selectedTests = [], viewLoading, viewError } = useSelector(
    (state) => state.patient
  );

  const hasReports = Array.isArray(selectedTests) && selectedTests.length > 0;

  useEffect(() => {
    if (id) {
      dispatch(getSinglePatient(id));
      dispatch(fetchPatientTests(id));
    }
  }, [dispatch, id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Patient-${selectedPatient?.name}-Tests`,
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Patient Test Report</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/CenterAdmin/patients/PatientList")}
            className="bg-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-400"
          >
            <FaArrowLeft /> Back to Manage Patients
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <FaDownload /> Download PDF
          </button>
        </div>
      </div>

      {viewLoading && <p>Loading...</p>}
      {viewError && <p className="text-red-500">{viewError}</p>}

      <div ref={componentRef} className="bg-white p-6 rounded shadow">
        {selectedPatient && (
          <div className="mb-6 text-gray-700">
            <h3 className="text-lg font-bold mb-2">Patient Details</h3>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            {selectedPatient.email && <p><strong>Email:</strong> {selectedPatient.email}</p>}
            {selectedPatient.address && <p><strong>Address:</strong> {selectedPatient.address}</p>}
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-700 mb-3">Test Reports</h3>
        {!hasReports ? (
          <p className="text-gray-500">No test reports found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Date</th>
                  {Object.keys(selectedTests[0])
                    .filter((key) => key !== "_id" && key !== "date" && key !== "patient" && key !== "__v")
                    .map((key, idx) => (
                      <th key={idx} className="border px-3 py-2">{key}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {selectedTests.map((test, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      {test.date ? new Date(test.date).toLocaleDateString() : ""}
                    </td>
                    {Object.keys(test)
                      .filter((key) => key !== "_id" && key !== "date" && key !== "patient" && key !== "__v")
                      .map((key, i) => (
                        <td key={i} className="border px-3 py-2">
                          {test[key]}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTests;
