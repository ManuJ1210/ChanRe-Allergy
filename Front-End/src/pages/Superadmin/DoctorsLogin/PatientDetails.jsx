import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSuperAdminDoctorPatientById } from '../../../features/superadmin/superAdminDoctorSlice';
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin } from 'lucide-react';

const PatientDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { selectedPatient, workingLoading, workingError } = useSelector(
    (state) => state.superAdminDoctors
  );

  useEffect(() => {
    if (patientId) {
      dispatch(fetchSuperAdminDoctorPatientById(patientId));
    }
  }, [dispatch, patientId]);

  if (workingLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (workingError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {workingError}
      </div>
    );
  }

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Patient not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
                     <button
             onClick={() => navigate('/dashboard/superadmin/doctor/my-patients')}
             className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
           >
             <ArrowLeft className="h-4 w-4 mr-2" />
             Back to Patients
           </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Patient Details</h1>
            <p className="text-slate-600">View detailed patient information</p>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedPatient.name}</h2>
                  <p className="text-slate-600">Patient ID: {selectedPatient._id?.slice(-8)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">
                    <span className="font-medium">Age:</span> {selectedPatient.age} years
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">
                    <span className="font-medium">Gender:</span> {selectedPatient.gender}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">
                    <span className="font-medium">Phone:</span> {selectedPatient.phone}
                  </span>
                </div>

                {selectedPatient.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-700">
                      <span className="font-medium">Email:</span> {selectedPatient.email}
                    </span>
                  </div>
                )}

                {selectedPatient.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-700">
                      <span className="font-medium">Address:</span> {selectedPatient.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Center Information</h3>
                <div className="space-y-2">
                  <p className="text-slate-700">
                    <span className="font-medium">Center:</span> {
                      selectedPatient.centerId && typeof selectedPatient.centerId === 'object' 
                        ? selectedPatient.centerId.name 
                        : selectedPatient.centerId || 'N/A'
                    }
                  </p>
                  {selectedPatient.centerId && typeof selectedPatient.centerId === 'object' && selectedPatient.centerId.code && (
                    <p className="text-slate-700">
                      <span className="font-medium">Center Code:</span> {selectedPatient.centerId.code}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Registration Details</h3>
                <div className="space-y-2">
                  <p className="text-slate-700">
                    <span className="font-medium">Registered:</span> {new Date(selectedPatient.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPatient.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedPatient.status || 'active'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate(`/dashboard/superadmin/doctor/patient/${patientId}/history`)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View History
            </button>

            <button
              onClick={() => navigate(`/dashboard/superadmin/doctor/patient/${patientId}/followup`)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
