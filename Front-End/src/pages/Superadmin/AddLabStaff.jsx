import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createLabStaff } from '../../features/superadmin/superadminThunks';
import { resetSuperadminState } from '../../features/superadmin/superadminSlice';
import { ArrowLeft, Save, UserCheck, AlertCircle, Microscope } from 'lucide-react';
import API from '../../services/api';

export default function AddLabStaff() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    staffName: '',
    email: '',
    phone: '',
    role: 'Lab Staff',
    password: '',
    confirmPassword: ''
  });
  const { loading, error, addLabStaffSuccess } = useSelector((state) => state.superadmin);



  useEffect(() => {
    if (addLabStaffSuccess) {
      dispatch(resetSuperadminState());
      navigate('/superadmin/lab-staff');
    }
  }, [addLabStaffSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.staffName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const payload = {
        staffName: formData.staffName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password
      };

      dispatch(createLabStaff(payload));
    } catch (error) {
      console.error('Error creating lab staff:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/superadmin/lab-staff')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lab Staff
          </button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Add New Lab Staff
          </h1>
          <p className="text-slate-600">
            Create a new laboratory staff member account
          </p>
        </div>

        {/* Success Message */}
        {addLabStaffSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <UserCheck className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-700">Lab staff member created successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Microscope className="h-5 w-5 mr-2 text-blue-500" />
              Lab Staff Information
            </h2>
            <p className="text-slate-600 mt-1">
              Fill in the details below to create a new lab staff account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Staff Name *
                  </label>
                  <input
                    type="text"
                    name="staffName"
                    value={formData.staffName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter staff name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="Lab Staff">Lab Staff</option>
                    <option value="Lab Technician">Lab Technician</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                    <option value="Lab Manager">Lab Manager</option>
                  </select>
                </div>
              </div>
            </div>



            {/* Account Security */}
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-4">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate('/superadmin/lab-staff')}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Lab Staff
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 