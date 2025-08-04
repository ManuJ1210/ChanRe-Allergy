import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../services/api";

const ViewHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  console.log('ViewHistory component rendered, patientId:', patientId);

  return (
    <div style={{ padding: '20px', backgroundColor: 'lightsteelblue', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>TEST - View History</h1>
      <p>Patient ID: {patientId}</p>
      <button onClick={() => navigate('/CenterAdmin/patients/PatientList')}>
        Back to Patients List
      </button>
    </div>
  );
};

export default ViewHistory; 