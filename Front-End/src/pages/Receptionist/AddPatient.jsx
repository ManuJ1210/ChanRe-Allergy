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
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Patient</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Center Code</label>
              <input
                type="text"
                name="centerCode"
                value={formData.centerCode}
                onChange={handleChange}
                placeholder="Enter center code"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Doctor</label>
              {doctorLoading ? (
                <div className="text-blue-600">Loading doctors...</div>
              ) : doctorError ? (
                <div className="text-red-600">Failed to load doctors</div>
              ) : (
                <select
                  name="assignedDoctor"
                  value={formData.assignedDoctor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
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
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {success && <div className="text-green-600 mb-2">Patient added successfully!</div>}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md"
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
