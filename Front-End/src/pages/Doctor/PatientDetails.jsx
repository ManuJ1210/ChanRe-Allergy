import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPatientDetails, addTestRequest, fetchPatientTestRequests, downloadTestReport } from '../../features/doctor/doctorThunks';
import { resetPatientDetails } from '../../features/doctor/doctorSlice';
import { 
  User, 
  FileText, 
  Pill, 
  Clock, 
  Plus, 
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  RefreshCw
} from 'lucide-react';

const PatientDetails = () => {
  const { patientId: rawPatientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Bulletproof patientId conversion - ensure it's always a string
  const patientId = typeof rawPatientId === 'object' && rawPatientId !== null
    ? rawPatientId._id || rawPatientId.id || String(rawPatientId)
    : String(rawPatientId);

  const { 
    patientDetails, 
    patientDetailsLoading, 
    patientDetailsError, 
    patientTestRequests,
    loading 
  } = useSelector((state) => state.doctor);

  const [activeTab, setActiveTab] = useState('overview');
  const [showTestForm, setShowTestForm] = useState(false);
  const [testForm, setTestForm] = useState({
    testType: '',
    notes: '',
    priority: 'normal'
  });

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientDetails(patientId));
      dispatch(fetchPatientTestRequests(patientId));
    }
    return () => {
      dispatch(resetPatientDetails());
    };
  }, [dispatch, patientId]);

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addTestRequest({ patientId, testData: testForm })).unwrap();
      setTestForm({ testType: '', notes: '', priority: 'normal' });
      setShowTestForm(false);
      
      // Refresh patient test requests data
      dispatch(fetchPatientTestRequests(patientId));
    } catch (error) {
      console.error('Error creating test request:', error);
      alert('Failed to create test request. Please try again.');
    }
  };

  const handleChange = (e) => {
    setTestForm({ ...testForm, [e.target.name]: e.target.value });
  };

  const handleDownloadReport = async (testRequestId) => {
    try {
      const result = await dispatch(downloadTestReport(testRequestId)).unwrap();
      
      // Create a blob URL and trigger download
      const blob = new Blob([result], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `test-report-${testRequestId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  if (patientDetailsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (patientDetailsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{patientDetailsError}</p>
          <button
            onClick={() => navigate('/dashboard/doctor/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!patientDetails) {
    return null;
  }

  const { patient, history, medications, tests } = patientDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/doctor/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
                  <p className="text-slate-600">
                    {patient.age} years old • {patient.gender} • {patient.centerId?.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    dispatch(fetchPatientDetails(patientId));
                    dispatch(fetchPatientTestRequests(patientId));
                  }}
                  disabled={patientDetailsLoading}
                  className="bg-slate-500 text-white px-3 py-1 rounded-lg hover:bg-slate-600 flex items-center disabled:opacity-50 text-sm"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${patientDetailsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              <button
                onClick={() => setShowTestForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Test Request
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-slate-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{patient.phone}</span>
              </div>
              {patient.email && (
                <div className="flex items-center text-slate-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{patient.email}</span>
                </div>
              )}
              {patient.address && (
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{patient.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6">
          <div className="border-b border-blue-100">
            <nav className="flex space-x-8 px-6">
              {['overview', 'history', 'medications', 'tests', 'test-requests'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab === 'test-requests' ? 'Test Requests' : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold text-slate-800">Total Tests</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{tests.length}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Pill className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-semibold text-slate-800">Medications</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{medications.length}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                    <h3 className="font-semibold text-slate-800">Pending Tests</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {tests.filter(test => test.status === 'pending').length}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="font-semibold text-slate-800">History</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {history ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Patient History</h3>
                {history ? (
                  <div className="space-y-6">
                    {/* Section One - Medical Conditions */}
                    {history.sectionOne?.conditions && (
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-800 mb-4 text-lg">Medical Conditions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(history.sectionOne.conditions).map(([condition, value]) => (
                            <div key={condition} className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-slate-700 font-medium">{condition}:</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                value === 'yes' ? 'bg-green-100 text-green-700' : 
                                value === 'no' ? 'bg-red-100 text-red-700' : 
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section Two - Symptoms and Asthma */}
                    {history.sectionTwo && (
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-800 mb-4 text-lg">Symptoms & Asthma Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(history.sectionTwo).map(([key, value]) => (
                            value && (
                              <div key={key} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                <span className="text-slate-700 font-medium">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                </span>
                                <span className="text-slate-600">{value}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section Three - Questions and Triggers */}
                    {history.sectionThree && (
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-800 mb-4 text-lg">Medical Questions & Triggers</h4>
                        
                        {history.sectionThree.questions && (
                          <div className="mb-4">
                            <h5 className="font-medium text-slate-700 mb-3">Medical Questions</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(history.sectionThree.questions).map(([question, answer]) => (
                                <div key={question} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                  <span className="text-slate-700 font-medium">{question}:</span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    answer === 'yes' ? 'bg-green-100 text-green-700' : 
                                    answer === 'no' ? 'bg-red-100 text-red-700' : 
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {answer}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {history.sectionThree.triggers && history.sectionThree.triggers.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-slate-700 mb-3">Triggers</h5>
                            <div className="flex flex-wrap gap-2">
                              {history.sectionThree.triggers.map((trigger, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {trigger}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {history.sectionThree.otherTrigger && (
                          <div>
                            <h5 className="font-medium text-slate-700 mb-2">Other Triggers</h5>
                            <p className="text-slate-600 p-3 bg-white rounded-lg">{history.sectionThree.otherTrigger}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Section Four - Rhinitis */}
                    {history.sectionFour && (
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-800 mb-4 text-lg">Rhinitis Information</h4>
                        <div className="space-y-4">
                          {history.sectionFour.rhinitisType && (
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-slate-700 font-medium">Rhinitis Type:</span>
                              <span className="text-slate-600">{history.sectionFour.rhinitisType}</span>
                            </div>
                          )}
                          
                          {history.sectionFour.symptoms && (
                            <div>
                              <h5 className="font-medium text-slate-700 mb-3">Symptoms</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(history.sectionFour.symptoms).map(([symptom, severity]) => (
                                  <div key={symptom} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="text-slate-700 font-medium">{symptom}:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      severity === 'Mild' ? 'bg-yellow-100 text-yellow-700' :
                                      severity === 'Moderate' ? 'bg-orange-100 text-orange-700' :
                                      severity === 'Severe' ? 'bg-red-100 text-red-700' :
                                      'bg-blue-100 text-blue-700'
                                    }`}>
                                      {severity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Section Five - Allergies */}
                    {history.sectionFive && (
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-800 mb-4 text-lg">Allergy Information</h4>
                        <div className="space-y-4">
                          {history.sectionFive.allergyType && (
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-slate-700 font-medium">Allergy Type:</span>
                              <span className="text-slate-600">{history.sectionFive.allergyType}</span>
                            </div>
                          )}

                          {history.sectionFive.skinAllergy && (
                            <div>
                              <h5 className="font-medium text-slate-700 mb-3">Skin Allergy</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(history.sectionFive.skinAllergy).map(([type, details]) => (
                                  <div key={type} className="p-3 bg-white rounded-lg">
                                    <div className="font-medium text-slate-700 mb-2">{type}</div>
                                    <div className="text-sm text-slate-600">
                                      <div>Answer: {details.answer}</div>
                                      {details.distribution && <div>Distribution: {details.distribution}</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {history.sectionFive.history && (
                            <div>
                              <h5 className="font-medium text-slate-700 mb-3">Medical History</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(history.sectionFive.history).map(([condition, status]) => (
                                  <div key={condition} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span className="text-slate-700 font-medium">{condition}:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      status === 'Yes' ? 'bg-green-100 text-green-700' : 
                                      status === 'No' ? 'bg-red-100 text-red-700' : 
                                      'bg-blue-100 text-blue-700'
                                    }`}>
                                      {status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Section Six - Comprehensive Examination */}
                    {history.sectionSix && (
                      <div className="bg-slate-50 rounded-lg p-6">
                        <h4 className="font-semibold text-slate-800 mb-4 text-lg">Comprehensive Examination</h4>
                        <div className="space-y-4">
                          {/* Drug Allergy */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {history.sectionSix.DrugAllergyKnown && (
                              <div className="p-3 bg-white rounded-lg">
                                <div className="font-medium text-slate-700 mb-1">Drug Allergy Known</div>
                                <div className="text-slate-600">{history.sectionSix.DrugAllergyKnown}</div>
                              </div>
                            )}
                            {history.sectionSix.Probable && (
                              <div className="p-3 bg-white rounded-lg">
                                <div className="font-medium text-slate-700 mb-1">Probable</div>
                                <div className="text-slate-600">{history.sectionSix.Probable}</div>
                              </div>
                            )}
                            {history.sectionSix.Definite && (
                              <div className="p-3 bg-white rounded-lg">
                                <div className="font-medium text-slate-700 mb-1">Definite</div>
                                <div className="text-slate-600">{history.sectionSix.Definite}</div>
                              </div>
                            )}
                          </div>

                          {/* Occupation and Exposure */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {history.sectionSix.Occupation && (
                              <div className="p-3 bg-white rounded-lg">
                                <div className="font-medium text-slate-700 mb-1">Occupation</div>
                                <div className="text-slate-600">{history.sectionSix.Occupation}</div>
                              </div>
                            )}
                            {history.sectionSix.ProbableChemicalExposure && (
                              <div className="p-3 bg-white rounded-lg">
                                <div className="font-medium text-slate-700 mb-1">Chemical Exposure</div>
                                <div className="text-slate-600">{history.sectionSix.ProbableChemicalExposure}</div>
                              </div>
                            )}
                            {history.sectionSix.Location && (
                              <div className="p-3 bg-white rounded-lg">
                                <div className="font-medium text-slate-700 mb-1">Location</div>
                                <div className="text-slate-600">{history.sectionSix.Location}</div>
                              </div>
                            )}
                          </div>

                          {history.sectionSix.FamilyHistory && (
                            <div className="p-3 bg-white rounded-lg">
                              <div className="font-medium text-slate-700 mb-1">Family History</div>
                              <div className="text-slate-600">{history.sectionSix.FamilyHistory}</div>
                            </div>
                          )}

                          {/* Physical Examination */}
                          <div>
                            <h5 className="font-medium text-slate-700 mb-3">Physical Examination</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {['OralCavity', 'Skin', 'ENT', 'Eye', 'RespiratorySystem', 'CVS', 'CNS', 'Abdomen'].map(system => (
                                history.sectionSix[system] && (
                                  <div key={system} className="p-3 bg-white rounded-lg">
                                    <div className="font-medium text-slate-700 mb-1">
                                      {system.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </div>
                                    <div className="text-slate-600">{history.sectionSix[system]}</div>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>

                          {history.sectionSix.AnyOtherFindings && (
                            <div className="p-3 bg-white rounded-lg">
                              <div className="font-medium text-slate-700 mb-1">Other Findings</div>
                              <div className="text-slate-600">{history.sectionSix.AnyOtherFindings}</div>
                            </div>
                          )}

                          {history.sectionSix.reportFile && (
                            <div className="p-3 bg-white rounded-lg">
                              <div className="font-medium text-slate-700 mb-1">Report File</div>
                              <div className="text-slate-600">{history.sectionSix.reportFile}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No history available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'medications' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Medications</h3>
                {medications.length > 0 ? (
                  <div className="space-y-4">
                    {medications.map((med, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-800">{med.drugName}</h4>
                          <span className="text-sm text-slate-500">
                            {new Date(med.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-1">Dose: {med.dose}</p>
                        <p className="text-slate-600 mb-1">Duration: {med.duration}</p>
                        {med.adverseEvent && (
                          <p className="text-slate-600">Adverse Event: {med.adverseEvent}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Pill className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No medications found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tests' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Test Results</h3>
                {tests.length > 0 ? (
                  <div className="space-y-4">
                    {tests.map((test, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-800">
                            {test.testType || 'General Test'}
                          </h4>
                          <span className="text-sm text-slate-500">
                            {new Date(test.date).toLocaleDateString()}
                          </span>
                        </div>
                        {test.notes && (
                          <p className="text-slate-600 mb-2">Notes: {test.notes}</p>
                        )}
                        {test.status && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            test.status === 'completed' ? 'bg-green-100 text-green-600' :
                            test.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {test.status}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No tests found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'test-requests' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Test Requests</h3>
                  <button
                    onClick={() => navigate('/dashboard/doctor/new-test-request')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Test Request
                  </button>
                </div>
                
                {patientTestRequests.length > 0 ? (
                  <div className="space-y-4">
                    {patientTestRequests.map((testRequest) => (
                      <div key={testRequest._id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-slate-800 mb-1">
                              {testRequest.testType}
                            </h4>
                            {testRequest.testDescription && (
                              <p className="text-sm text-slate-600 mb-2">
                                {testRequest.testDescription}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-slate-500">
                                Created: {new Date(testRequest.createdAt).toLocaleDateString()}
                              </span>
                              {testRequest.completedDate && (
                                <span className="text-slate-500">
                                  Completed: {new Date(testRequest.completedDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testRequest.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              testRequest.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              testRequest.status === 'Assigned' ? 'bg-orange-100 text-orange-700' :
                              testRequest.status === 'Sample Collected' ? 'bg-purple-100 text-purple-700' :
                              testRequest.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {testRequest.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testRequest.urgency === 'Emergency' ? 'bg-red-100 text-red-700' :
                              testRequest.urgency === 'Urgent' ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {testRequest.urgency}
                            </span>
                          </div>
                        </div>
                        
                        {testRequest.assignedLabStaffName && (
                          <div className="text-sm text-slate-600 mb-2">
                            Assigned to: {testRequest.assignedLabStaffName}
                          </div>
                        )}
                        
                        {testRequest.notes && (
                          <div className="text-sm text-slate-600 mb-2">
                            Notes: {testRequest.notes}
                          </div>
                        )}
                        
                        {testRequest.status === 'Completed' && testRequest.testResults && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                            <h5 className="font-medium text-slate-800 mb-2">Test Results</h5>
                            <p className="text-sm text-slate-600">{testRequest.testResults}</p>
                            {testRequest.testReport && (
                              <button
                                onClick={() => handleDownloadReport(testRequest._id)}
                                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                Download Report
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No test requests found</p>
                    <button
                      onClick={() => navigate('/dashboard/doctor/new-test-request')}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Create First Test Request
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Test Request Modal */}
        {showTestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Add Test Request</h3>
              <form onSubmit={handleTestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Test Type
                  </label>
                  <input
                    type="text"
                    name="testType"
                    value={testForm.testType}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., CBC, Allergy Panel"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={testForm.notes}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes..."
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={testForm.priority}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTestForm(false)}
                    className="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Test Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails; 