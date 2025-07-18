import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CenterProfile = () => {
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/centers/my-center", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCenter(response.data);
      } catch (err) {
        console.error("❌ Error fetching center:", err.response?.data || err.message);
        setError("Failed to load center data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCenterData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-700">Loading center data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Center Profile</h2>
        <button
          onClick={() => navigate("/CenterAdmin/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>

      <div className="bg-white shadow p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Center Information</h3>
        <p><strong>Name:</strong> {center.name}</p>
        <p><strong>Location:</strong> {center.location}</p>
        <p><strong>Address:</strong> {center.address || "N/A"}</p>
        <p><strong>Email:</strong> {center.email}</p>
        <p><strong>Phone:</strong> {center.phone || "N/A"}</p>
      </div>

      <div className="bg-white shadow p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Center Admin</h3>
        {center.admin ? (
          <div>
            <p><strong>Name:</strong> {center.admin.name}</p>
            <p><strong>Email:</strong> {center.admin.email}</p>
            <p><strong>Phone:</strong> {center.admin.phone || "N/A"}</p>
          </div>
        ) : (
          <p className="text-gray-600">No admin assigned to this center.</p>
        )}
      </div>

      <div className="bg-white shadow p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Staff & Patients</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-lg font-bold">{center.stats?.doctors || 0}</p>
            <p className="text-sm text-gray-600">Doctors</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-lg font-bold">{center.stats?.receptionists || 0}</p>
            <p className="text-sm text-gray-600">Receptionists</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-lg font-bold">{center.stats?.lab || 0}</p>
            <p className="text-sm text-gray-600">Lab Staff</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <p className="text-lg font-bold">{center.stats?.patients || 0}</p>
            <p className="text-sm text-gray-600">Patients</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterProfile;
