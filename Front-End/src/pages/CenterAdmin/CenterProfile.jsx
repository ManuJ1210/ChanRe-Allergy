import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCenterStats } from '../../features/centerAdmin/centerAdminThunks';
import { setUserFromLocal } from '../../features/auth/authSlice';
import { 
  Building, 
  ArrowLeft, 
  Users, 
  User, 
  UserCheck, 
  FlaskConical,
  Mail, 
  Phone, 
  MapPin,
  Shield
} from 'lucide-react';

const CenterProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { center, centerLoading, centerError } = useSelector((state) => state.centerAdmin);
  
  // Fix: Ensure centerId is always a string (ObjectId)
  const centerId = typeof user?.centerId === 'object' ? user.centerId._id : user?.centerId;

  // Debug logging


  // On mount, if user is not in Redux, try to load from localStorage
  useEffect(() => {
    if (!user) {
      dispatch(setUserFromLocal());
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (centerId) {

      dispatch(fetchCenterStats(centerId));
    } else {
      
    }
  }, [dispatch, centerId]);

  if (centerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading center profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (centerError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{centerError}</p>
            <button
              onClick={() => centerId && dispatch(fetchCenterStats(centerId))}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-700">Please log in to view center profile.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is center admin
  if (user.role !== 'centeradmin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">Access denied. Only center admins can view this page.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-700">No center data available. Please try refreshing the page.</p>
            <button
              onClick={() => centerId && dispatch(fetchCenterStats(centerId))}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
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
            onClick={() => navigate('/dashboard/centeradmin/dashboard')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Center Profile
          </h1>
          <p className="text-slate-600">
            Overview and statistics for your healthcare center
          </p>
        </div>

        {/* Center Information */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-8">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-500" />
              {center.name || 'Unnamed Center'}
            </h2>
            <p className="text-slate-600 mt-1">
              Center Code: {center.code || 'N/A'}
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {center.location && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Location</p>
                      <p>{center.location}</p>
                    </div>
                  </div>
                )}
                {center.address && (
                  <div className="flex items-start gap-3 text-slate-700">
                    <MapPin className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Address</p>
                      <p>{center.address}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {center.email && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Email</p>
                      <p>{center.email}</p>
                    </div>
                  </div>
                )}
                {center.phone && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Phone</p>
                      <p>{center.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Patients</p>
                <p className="text-2xl font-bold text-slate-800">{center.patientCount || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Doctors</p>
                <p className="text-2xl font-bold text-slate-800">{center.doctorCount || 0}</p>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Receptionists</p>
                <p className="text-2xl font-bold text-slate-800">{center.receptionistCount || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Lab Staff</p>
                <p className="text-2xl font-bold text-slate-800">{center.labCount || 0}</p>
              </div>
              <FlaskConical className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              Quick Actions
            </h2>
            <p className="text-slate-600 mt-1">
              Manage your center operations
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/dashboard/centeradmin/doctors/doctorlist')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-3"
              >
                <User className="h-6 w-6" />
                <div className="text-center">
                  <h3 className="font-semibold">Manage Doctors</h3>
                  <p className="text-sm opacity-90">View and manage doctors</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/dashboard/centeradmin/patients/patientlist')}
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-3"
              >
                <Users className="h-6 w-6" />
                <div className="text-center">
                  <h3 className="font-semibold">Manage Patients</h3>
                  <p className="text-sm opacity-90">View and manage patients</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/dashboard/centeradmin/receptionist/managereceptionists')}
                className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-3"
              >
                <UserCheck className="h-6 w-6" />
                <div className="text-center">
                  <h3 className="font-semibold">Manage Receptionists</h3>
                  <p className="text-sm opacity-90">View and manage receptionists</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/dashboard/centeradmin/dashboard')}
                className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-3"
              >
                <Shield className="h-6 w-6" />
                <div className="text-center">
                  <h3 className="font-semibold">Dashboard</h3>
                  <p className="text-sm opacity-90">View center dashboard</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterProfile;
