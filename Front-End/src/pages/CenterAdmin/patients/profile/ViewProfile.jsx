import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientDetails, fetchPatientMedications, fetchPatientHistory, fetchFollowUps, fetchAllergicRhinitis, fetchAllergicConjunctivitis, fetchAllergicBronchitis, fetchAtopicDermatitis, fetchGPE, fetchPrescriptions } from '../../../../features/centerAdmin/centerAdminThunks';
import { 
  ArrowLeft, User, Phone, Calendar, MapPin, Activity, Pill, FileText, Eye, Edit, Plus, AlertCircle, Mail, UserCheck
} from 'lucide-react';

const TABS = ["Overview", "Follow Up", "Prescription"];

const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Overview");

  const { 
    patientDetails: patient,
    medications, 
    history, 
    followUps,
    allergicRhinitis,
    atopicDermatitis,
    allergicConjunctivitis,
    allergicBronchitis,
    gpe,
    prescriptions,
    loading, error, medLoading, medError, historyLoading, historyError
  } = useSelector(state => state.centerAdmin);

  useEffect(() => {
    if (id) {
      console.log('Fetching patient details for ID:', id);
      dispatch(fetchPatientDetails(id));
      dispatch(fetchPatientMedications(id));
      dispatch(fetchPatientHistory(id));
      dispatch(fetchFollowUps(id));
      dispatch(fetchAllergicRhinitis(id));
      dispatch(fetchAllergicConjunctivitis(id));
      dispatch(fetchAllergicBronchitis(id));
      dispatch(fetchAtopicDermatitis(id));
      dispatch(fetchGPE(id));
      dispatch(fetchPrescriptions(id));
    }
  }, [dispatch, id]);

  // Debug logging
  useEffect(() => {
    console.log('ViewProfile state:', {
      patient,
      loading,
      error,
      medications,
      history,
      followUps,
      allergicRhinitis,
      atopicDermatitis,
      allergicConjunctivitis,
      allergicBronchitis,
      gpe,
      prescriptions
    });
  }, [patient, loading, error, medications, history, followUps, allergicRhinitis, atopicDermatitis, allergicConjunctivitis, allergicBronchitis, gpe, prescriptions]);

  if (!id) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">No patient ID provided in the URL.</p>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading patient information...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    </div>
  );

  if (!patient) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            {loading ? 'Loading patient information...' : 'Patient not found or failed to load.'}
          </p>
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
        </div>
      </div>
    </div>
  );

  // Ensure patient is an object with expected properties
  if (typeof patient !== 'object' || patient === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Invalid patient data format.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
          <div className="mb-8">
              <button
                              onClick={() => navigate('/dashboard/CenterAdmin/patients/PatientList')}
              className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
              >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients List
              </button>
          </div>

          {/* Patient Header */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{patient?.name || 'Patient Name'}</h1>
                                      <div className="flex flex-wrap gap-4 text-slate-600">
                      {patient?.gender && (
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4" />
                          {patient.gender}
                        </span>
                      )}
                      {patient?.age && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {patient.age} years
                        </span>
                      )}
                      {patient?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {patient.phone}
                        </span>
                      )}
                      {patient?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {patient.email}
                        </span>
                      )}
                      {patient?.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {patient.address}
                        </span>
                      )}
                    </div>
                </div>
            </div>
              <button
                onClick={() => navigate(`/dashboard/CenterAdmin/patients/EditPatient/${patient?._id}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-2 mb-8">
            <div className="flex gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex-1 ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
          </div>
        </div>

          {/* Tab Content */}
          {activeTab === "Overview" && (
            <div className="space-y-8">
              {/* Patient Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="p-6 border-b border-blue-100">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    Patient Details
            </h2>
                  <p className="text-slate-600 mt-1">
                    Complete patient information and contact details
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                        <p className="text-slate-800 font-medium">{patient.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Mobile</label>
                        <p className="text-slate-800">
                          {typeof patient.phone === 'string' ? patient.phone :
                           typeof patient.contact === 'string' ? patient.contact : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                        <p className="text-slate-800">{typeof patient.email === 'string' ? patient.email : 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Location</label>
                        <p className="text-slate-800">{typeof patient.address === 'string' ? patient.address : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Assigned Doctor</label>
                        <p className="text-slate-800">
                          {patient.doctorId?.name ||
                           (typeof patient.assignedDoctor === 'string' ? patient.assignedDoctor : 'Not assigned')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Gender</label>
                        <p className="text-slate-800 capitalize">{patient.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Age</label>
                        <p className="text-slate-800">{patient.age ? `${patient.age} years` : 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Center</label>
                        <p className="text-slate-800">
                          {patient.centerId?.name ||
                           (typeof patient.centerCode === 'string' ? patient.centerCode : 'N/A')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investigations */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="p-6 border-b border-blue-100">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Investigations
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Laboratory test results and medical investigations
                  </p>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CBC</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hb</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">TC</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">DC</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">N</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">E</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">L</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">M</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Platelets</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ESR</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Serum Creatinine</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Serum IgE</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">C3, C4</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ANA</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Urine</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Allergy Panel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {patient.tests && patient.tests.length > 0 ? (
                          patient.tests.map((test, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-600">{test.date ? new Date(test.date).toLocaleDateString() : ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.CBC || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.Hb || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.TC || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.DC || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.Neutrophils || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.Eosinophil || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.Lymphocytes || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.Monocytes || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.Platelets || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.ESR || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.SerumCreatinine || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.SerumIgELevels || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.C3C4Levels || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.ANA_IF || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.UrineRoutine || ''}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{test.AllergyPanel || ''}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={17} className="px-4 py-8 text-center text-slate-500">
                              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                              <p>No investigations found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="p-6 border-b border-blue-100">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-blue-500" />
                    Medications
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Current and past medications prescribed
                  </p>
                </div>
                <div className="p-6">
                  {medLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading medications...</p>
                    </div>
                  ) : medError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600">{medError}</p>
                    </div>
                  ) : medications.length === 0 ? (
                    <div className="text-center py-8">
                      <Pill className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">No medications found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Drug Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dose</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Frequency</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prescribed By</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Adverse Effect</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {medications.map((med, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">{med.drugName}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{med.dose}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{med.duration}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{med.frequency || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{med.prescribedBy || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{med.adverseEvent || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* History */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="p-6 border-b border-blue-100">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    Medical History
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Complete patient medical history and examination records
                  </p>
                </div>
                <div className="p-6">
                  {historyLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading history...</p>
                    </div>
                  ) : historyError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600">{historyError}</p>
                    </div>
                  ) : !history || history.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">No history found</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {history.map((h, idx) => (
                        <div
                          key={h._id || idx}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-6"
                        >
                          <div className="flex items-center gap-2 text-sm text-blue-500 mb-4">
                            <Calendar className="h-4 w-4" />
                            {h.createdAt ? new Date(h.createdAt).toLocaleDateString() : ""}
                          </div>

                          {/* Section 1: Conditions */}
                          {h.sectionOne?.conditions && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-slate-800 mb-2">Medical Conditions</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(h.sectionOne.conditions).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-sm font-medium text-slate-600">{key}:</span>
                                    <span className="text-sm text-slate-800">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Section 2: Hay Fever & Asthma */}
                          {h.sectionTwo && Object.keys(h.sectionTwo).length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-slate-800 mb-2">Hay Fever & Asthma</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(h.sectionTwo).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-sm font-medium text-slate-600">{key}:</span>
                                    <span className="text-sm text-slate-800">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Section 3: Frequency and Triggers */}
                          {h.sectionThree && Object.keys(h.sectionThree).length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-slate-800 mb-2">Frequency and Triggers</h4>
                              {h.sectionThree.questions && (
                                <div className="mb-3">
                                  <h5 className="text-sm font-medium text-slate-600 mb-2">Questions:</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(h.sectionThree.questions).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-sm text-slate-600">{key}:</span>
                                        <span className="text-sm text-slate-800">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {h.sectionThree.triggers && h.sectionThree.triggers.length > 0 && (
                                <div className="mb-3">
                                  <h5 className="text-sm font-medium text-slate-600 mb-2">Triggers:</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {h.sectionThree.triggers.map((trigger, i) => (
                                      <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {trigger}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {h.sectionThree.otherTrigger && (
                                <div>
                                  <span className="text-sm font-medium text-slate-600">Other Trigger:</span>
                                  <span className="text-sm text-slate-800 ml-2">{h.sectionThree.otherTrigger}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Section 4: Allergic Rhinitis */}
                          {h.sectionFour && Object.keys(h.sectionFour).length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-slate-800 mb-2">Allergic Rhinitis</h4>
                              {h.sectionFour.rhinitisType && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium text-slate-600">Type:</span>
                                  <span className="text-sm text-slate-800 ml-2">{h.sectionFour.rhinitisType}</span>
                                </div>
                              )}
                              {h.sectionFour.symptoms && Object.keys(h.sectionFour.symptoms).length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-slate-600 mb-2">Symptoms:</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(h.sectionFour.symptoms).map(([symptom, severity]) => (
                                      <div key={symptom} className="flex justify-between">
                                        <span className="text-sm text-slate-600">{symptom}:</span>
                                        <span className="text-sm text-slate-800">{severity}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Section 5: Skin Allergy & History */}
                          {h.sectionFive && Object.keys(h.sectionFive).length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-slate-800 mb-2">Skin Allergy & History</h4>
                              {h.sectionFive.allergyType && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium text-slate-600">Allergy Type:</span>
                                  <span className="text-sm text-slate-800 ml-2">{h.sectionFive.allergyType}</span>
                                </div>
                              )}
                              {h.sectionFive.skinAllergy && Object.keys(h.sectionFive.skinAllergy).length > 0 && (
                                <div className="mb-3">
                                  <h5 className="text-sm font-medium text-slate-600 mb-2">Skin Conditions:</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(h.sectionFive.skinAllergy).map(([cond, details]) => (
                                      <div key={cond} className="flex justify-between">
                                        <span className="text-sm text-slate-600">{cond}:</span>
                                        <span className="text-sm text-slate-800">
                                          {details.answer && <span>Answer: {details.answer}; </span>}
                                          {details.distribution && <span>Distribution: {details.distribution}</span>}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {h.sectionFive.history && Object.keys(h.sectionFive.history).length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-slate-600 mb-2">Medical History:</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(h.sectionFive.history).map(([cond, value]) => (
                                      <div key={cond} className="flex justify-between">
                                        <span className="text-sm text-slate-600">{cond}:</span>
                                        <span className="text-sm text-slate-800">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Section 6: Drugs, Exposure & Examination */}
                          {h.sectionSix && Object.keys(h.sectionSix).length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-2">Drugs, Exposure & Examination</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(h.sectionSix).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-sm font-medium text-slate-600">{key}:</span>
                                    <span className="text-sm text-slate-800">
                                      {typeof value === 'object' ? JSON.stringify(value) : value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "Follow Up" && (
            <div className="space-y-8">
              {/* Allergic Rhinitis */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">Allergic Rhinitis</h2>
                  <button
                                                onClick={() => navigate(`/dashboard/CenterAdmin/patients/FollowUp/AddAllergicRhinitis/${patient._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add Follow Up
                  </button>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Age</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Center Code</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {allergicRhinitis && allergicRhinitis.length > 0 ? (
                          allergicRhinitis.map((rhinitis, idx) => (
                            <tr key={rhinitis._id || idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.age}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.centerCode || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.phone || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">
                                {rhinitis.updatedAt ? new Date(rhinitis.updatedAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-800">
                                <button
                                  onClick={() => navigate(`/dashboard/CenterAdmin/patients/FollowUp/ViewAllergicRhinitis/${rhinitis._id}`)}
                                  className="text-blue-600 hover:text-blue-900 font-medium"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                              <p>No allergic rhinitis records found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
            </div>
          </div>
              </div>

              {/* Atopic Dermatitis */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">Atopic Dermatitis</h2>
                  <button
                                                onClick={() => navigate(`/dashboard/receptionist/followup/atopic-dermatitis/add/${patient._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add Follow Up
                  </button>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Symptoms</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Center Code</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Center Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated By</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {atopicDermatitis && atopicDermatitis.length > 0 ? (
                          atopicDermatitis.map((dermatitis, idx) => (
                            <tr key={dermatitis._id || idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-800">
                                {dermatitis.createdAt ? new Date(dermatitis.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-800">{dermatitis.symptoms || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.centerCode || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.centerName || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient._id}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{dermatitis.updatedBy || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">
                                <button
                                  onClick={() => navigate(`/dashboard/receptionist/followup/atopic-dermatitis/view/${dermatitis._id}`)}
                                  className="text-blue-600 hover:text-blue-900 font-medium"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                              <p>No atopic dermatitis records found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Allergic Conjunctivitis */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">Allergic Conjunctivitis</h2>
                  <button
                                                onClick={() => navigate(`/dashboard/receptionist/followup/allergic-conjunctivitis/add/${patient._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add Follow Up
                  </button>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Age</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Center Code</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {allergicConjunctivitis && allergicConjunctivitis.length > 0 ? (
                          allergicConjunctivitis.map((conjunctivitis, idx) => (
                            <tr key={conjunctivitis._id || idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.age}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.centerCode || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.phone || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">
                                {conjunctivitis.updatedAt ? new Date(conjunctivitis.updatedAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-800">
                                <button
                                  onClick={() => navigate(`/dashboard/receptionist/followup/allergic-conjunctivitis/view/${conjunctivitis._id}`)}
                                  className="text-blue-600 hover:text-blue-900 font-medium"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                              <p>No allergic conjunctivitis records found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
              </div>
            </div>
          </div>

              {/* Allergic Bronchitis */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">Allergic Bronchitis</h2>
              <button
                                                onClick={() => navigate(`/dashboard/receptionist/followup/allergic-bronchitis/add/${patient._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                    Add Follow Up
              </button>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Age</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Center Code</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {allergicBronchitis && allergicBronchitis.length > 0 ? (
                          allergicBronchitis.map((bronchitis, idx) => (
                            <tr key={bronchitis._id || idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.age}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.centerCode || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.phone || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">
                                {bronchitis.updatedAt ? new Date(bronchitis.updatedAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-800">
              <button
                                  onClick={() => navigate(`/dashboard/receptionist/followup/allergic-bronchitis/view/${bronchitis._id}`)}
                                  className="text-blue-600 hover:text-blue-900 font-medium"
              >
                                  View
              </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                              <p>No allergic bronchitis records found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
            </div>
          </div>
        </div>

              {/* GPE */}
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">GPE</h2>
            <button
                                                onClick={() => navigate(`/dashboard/receptionist/followup/gpe/add/${patient._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
                    Add Follow Up
            </button>
          </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Age</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Center Code</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {gpe && gpe.length > 0 ? (
                          gpe.map((gpe, idx) => (
                            <tr key={gpe._id || idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.age}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.centerCode || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">{patient.phone || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-slate-800">
                                {gpe.updatedAt ? new Date(gpe.updatedAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-800">
                    <button
                                  onClick={() => navigate(`/dashboard/receptionist/followup/gpe/view/${gpe._id}`)}
                                  className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                                  View
                    </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                              <p>No GPE records found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
            </div>
          )}
          {activeTab === "Prescription" && (
            <div className="bg-white rounded-xl shadow-sm border border-blue-100">
              <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800">Prescription</h2>
            <button
                                              onClick={() => navigate(`/dashboard/receptionist/followup/prescription/add/${patient._id}`)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
                  Add Prescription
            </button>
          </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Visit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated By</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {prescriptions && prescriptions.length > 0 ? (
                        prescriptions.map((prescription, idx) => (
                          <tr key={prescription._id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-slate-800">
                              {prescription.createdAt ? new Date(prescription.createdAt).toLocaleString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-800">{prescription.visitNumber || idx + 1}</td>
                            <td className="px-4 py-3 text-sm text-slate-800">{patient._id}</td>
                            <td className="px-4 py-3 text-sm text-slate-800">
                              {typeof prescription.updatedBy === 'string' ? prescription.updatedBy : 
                               typeof prescription.updatedBy === 'object' && prescription.updatedBy?.name ? prescription.updatedBy.name : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-800">
                    <button
                                onClick={() => navigate(`/dashboard/receptionist/followup/prescription/view/${prescription._id}`)}
                                className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                                View
                    </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                            <Pill className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p>No prescriptions found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default ViewProfile; 