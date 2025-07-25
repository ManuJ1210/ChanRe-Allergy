import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import ReceptionistLayout from './ReceptionistLayout';

export default function AddPatient() {
  const navigate = useNavigate();
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
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setDoctorLoading(true);
    setDoctorError("");
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/doctors", { headers: { Authorization: `Bearer ${token}` } });
      setDoctors(res.data);
    } catch (err) {
      setDoctorError("Failed to load doctors");
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await API.post("/patients", formData, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(true);
      setFormData({
        name: "",
        age: "",
        gender: "",
        address: "",
        contact: "",
        email: "",
        centerCode: "",
        assignedDoctor: "",
      });
      setTimeout(() => navigate("/receptionist/patients"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReceptionistLayout>
      <div className="p-10 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <h2 className="text-3xl font-extrabold mb-10 text-blue-500 text-center tracking-tight">Add Patient</h2>
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl max-w-3xl mx-auto border border-blue-100 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Patient Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-base font-medium text-slate-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows={3}
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              ></textarea>
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Contact No</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Center Code</label>
              <input
                type="text"
                name="centerCode"
                value={formData.centerCode}
                onChange={handleChange}
                placeholder="Enter center code"
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Assign Doctor</label>
              {doctorLoading ? (
                <div className="text-blue-600">Loading doctors...</div>
              ) : doctorError ? (
                <div className="text-red-600">Failed to load doctors</div>
              ) : (
                <select
                  name="assignedDoctor"
                  value={formData.assignedDoctor}
                  onChange={handleChange}
                  className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
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
          {error && <div className="mb-4 bg-red-50 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl">{error}</div>}
          {success && <div className="mb-4 bg-blue-50 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl">Patient added successfully!</div>}
          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-3 px-10 rounded-xl shadow-md text-lg transition-all"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </ReceptionistLayout>
  );
}
