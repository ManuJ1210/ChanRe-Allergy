import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPatient } from "../../../features/patient/patientThunks";
import { resetPatientState } from "../../../features/patient/patientSlice";
import { useNavigate } from "react-router-dom";
import { fetchAllDoctors } from "../../../features/doctor/doctorThunks";

const AddPatient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector((state) => state.patient);
  const doctorState = useSelector((state) => state.doctor);
  const { loading: doctorLoading, error: doctorError, doctors = [] } = doctorState;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    contact: "",
    email: "",
    centerCode: "",
    assignedDoctor: "",
  });

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPatient(formData));
  };

  useEffect(() => {
    if (success) {
      alert("Patient added successfully!");
      dispatch(resetPatientState());
      navigate("/CenterAdmin/patients/PatientList");
    }
    if (error) {
      alert(error);
    }
  }, [success, error, dispatch, navigate]);

  return (
    <div className="mt-6   flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-blue-500 tracking-tight">Add Patient</h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="w-full border border-blue-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 text-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                className="w-full border border-blue-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 text-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-blue-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 text-slate-700"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows={3}
                className="w-full border border-blue-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 text-slate-700"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact No</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="w-full border border-blue-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border border-blue-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Center Code</label>
              <input
                type="text"
                name="centerCode"
                value={formData.centerCode}
                onChange={handleChange}
                placeholder="Enter center code"
                className="w-full border border-blue-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign Doctor</label>
              {doctorLoading ? (
                <div className="text-blue-600">Loading doctors...</div>
              ) : doctorError ? (
                <div className="text-red-600">Failed to load doctors</div>
              ) : (
                <select
                  name="assignedDoctor"
                  value={formData.assignedDoctor}
                  onChange={handleChange}
                  className="w-full border border-blue-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 text-slate-700"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors && doctors.length > 0 && doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>{doc.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition-all duration-200 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
