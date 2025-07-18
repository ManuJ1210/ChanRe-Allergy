import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";

const ShowTests = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef();
  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        const patientRes = await axios.get(`http://localhost:5000/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatient(patientRes.data);

        const testsRes = await axios.get(`http://localhost:5000/api/patients/${id}/tests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(testsRes.data.tests || []);
      } catch (error) {
        console.error("Failed to fetch patient/test data:", error);
      }
    };

    fetchPatientData();
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Patient-${patient?.name}-Tests`,
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

      <div ref={componentRef} className="bg-white p-6 rounded shadow">
        {patient && (
          <div className="mb-6 text-gray-700">
            <h3 className="text-lg font-bold mb-2">Patient Details</h3>
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
            {patient.email && <p><strong>Email:</strong> {patient.email}</p>}
            {patient.address && <p><strong>Address:</strong> {patient.address}</p>}
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-700 mb-3">Test Reports</h3>
        {tests.length === 0 ? (
          <p className="text-gray-500">No tests available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Date</th>
                  {Object.keys(tests[0] || {}).filter(key => key !== "_id" && key !== "date").map((key, idx) => (
                    <th key={idx} className="border px-3 py-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tests.map((test, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{new Date(test.date).toLocaleDateString()}</td>
                    {Object.keys(test).filter(k => k !== "_id" && k !== "date").map((key, i) => (
                      <td key={i} className="border px-3 py-2">{test[key]}</td>
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
