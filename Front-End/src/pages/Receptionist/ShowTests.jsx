import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import API from "../../services/api";
import ReceptionistLayout from './ReceptionistLayout';

const ShowTests = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef();
  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchPatientAndTests();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchPatientAndTests = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/patients/${id}/show-tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatient(res.data.patient);
      setTests(res.data.tests);
    } catch (err) {
      setError("Failed to fetch patient or tests");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Patient-${patient?.name}-Tests`,
  });

  return (
    <ReceptionistLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Patient Test Report</h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/receptionist/patients")}
              className="bg-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-400"
            >
              <FaArrowLeft /> Back to Patient List
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            >
              <FaDownload /> Download PDF
            </button>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
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
          {!tests.length ? (
            <p className="text-gray-500">No test reports found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">Date</th>
                    {Object.keys(tests[0])
                      .filter((key) => key !== "_id" && key !== "date" && key !== "patient" && key !== "__v")
                      .map((key, idx) => (
                        <th key={idx} className="border px-3 py-2">{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, idx) => (
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
    </ReceptionistLayout>
  );
};

export default ShowTests;
