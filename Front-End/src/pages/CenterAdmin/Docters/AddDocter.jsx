import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createDoctor } from '../../../features/centerAdmin/centerAdminThunks';
import { resetCenterAdminState } from '../../../features/centerAdmin/centerAdminSlice';
import { Eye, EyeOff, UserCheck, ArrowLeft } from 'lucide-react';

const AddDocter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, addSuccess } = useSelector((state) => state.centerAdmin);
  
  // Try Redux first, then fallback to localStorage
  const centerId = user?.centerId || JSON.parse(localStorage.getItem('user'))?.centerId;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    specialization: '',
    userType: 'doctor',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (addSuccess) {
      setTimeout(() => {
        dispatch(resetCenterAdminState());
        navigate('/CenterAdmin/Docters/DocterList');
      }, 1500);
    }
  }, [addSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!centerId) {
      alert('No center ID found. Please log in again as a center admin.');
      return;
    }
    dispatch(createDoctor({ ...formData, centerId }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/CenterAdmin/Docters/DocterList')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doctors
          </button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Add New Doctor
          </h1>
          <p className="text-slate-600">
            Register a new doctor for your center
          </p>
        </div>

        {/* Alert Messages */}
        {addSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <UserCheck className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-green-700">Doctor added successfully!</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <UserCheck className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-blue-500" />
              Doctor Information
            </h2>
            <p className="text-slate-600 mt-1">
              Fill in the doctor details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter full name"
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
                  Email Address *
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
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Specialization *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter specialization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/CenterAdmin/Docters/DocterList')}
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
                    Adding Doctor...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Add Doctor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDocter;
