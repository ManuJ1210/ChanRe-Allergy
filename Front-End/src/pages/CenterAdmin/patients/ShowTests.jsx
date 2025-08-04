import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSinglePatient,
  fetchPatientTests,
} from "../../../features/patient/patientThunks";

const ShowTests = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log('ShowTests component rendered, id:', id);

  return (
    <div style={{ padding: '20px', backgroundColor: 'lightcyan', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>TEST - Show Tests</h1>
      <p>Patient ID: {id}</p>
      <button onClick={() => navigate('/CenterAdmin/patients/PatientList')}>
        Back to Patients List
      </button>
    </div>
  );
};

export default ShowTests; 