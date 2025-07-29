import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSinglePatient,
  updatePatient,
} from "../../../features/patient/patientThunks";
import { resetPatientState } from "../../../features/patient/patientSlice";
import { Users, ArrowLeft, Save, Mail, Phone, MapPin, User } from 'lucide-react';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    singlePatient,
    patientLoading,
    patientError,
    editSuccess,
  } = useSelector((state) => state.patient);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
  });

  useEffect(() => {
    dispatch(getSinglePatient(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (singlePatient) {
      setFormData({
        name: singlePatient.name || "",
        email: singlePatient.email || "",
        phone: singlePatient.phone || "",
        age: singlePatient.age || "",
        gender: singlePatient.gender || "",
        address: singlePatient.address || "",
      });
    }
  }, [singlePatient]);

  useEffect(() => {
    if (editSuccess) {
      alert("Patient updated successfully!");
      dispatch(resetPatientState());
      navigate("/CenterAdmin/patients/PatientList");
    }
  }, [editSuccess, dispatch, navigate]);

  useEffect(() => {
    if (patientError) {
      alert(patientError);
    }
  }, [patientError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting patient update:", formData);
    dispatch(updatePatient({ id, updatedData: formData }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/CenterAdmin/patients/PatientList')}
            className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients List
          </button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Edit Patient
          </h1>
          <p className="text-slate-600">
            Update patient information and details
          </p>
        </div>

        {/* Loading State */}
        {patientLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading patient information...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {patientError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{patientError}</p>
          </div>
        )}

        {/* Form */}
        {!patientLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Patient Information
              </h2>
              <p className="text-slate-600 mt-1">
                Update the patient's details and contact information
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">Personal Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter patient name"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter age"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">Contact Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter contact number"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Update Patient
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
