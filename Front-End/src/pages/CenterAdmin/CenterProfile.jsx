import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserFromLocal } from '../../features/auth/authSlice';

const CenterProfile = () => {
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const centerId = user?.centerId;

  // On mount, if user is not in Redux, try to load from localStorage
  useEffect(() => {
    if (!user) {
      dispatch(setUserFromLocal());
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchCenterStats = async () => {
      if (!centerId) {
        setError("No center ID found for this user.");
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/centers/${centerId}/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCenter(res.data);
        // Store center name in localStorage for header
        if (res.data?.name) {
          localStorage.setItem('centerName', res.data.name);
        }
      } catch (err) {
        setError("Failed to load center data.");
      } finally {
        setLoading(false);
      }
    };
    if (centerId) fetchCenterStats();
  }, [centerId]);

  if (loading) return <div className="p-6 text-gray-700">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!center) return null;

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          {center.name || "N/A"}
        </h2>
        <div className="mb-6 text-center text-gray-600">
          <p>
            <strong>Address:</strong> {center.address || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {center.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {center.phone || "N/A"}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Doctors" value={center.doctorCount ?? 0} color="blue" />
          <StatCard label="Receptionists" value={center.receptionistCount ?? 0} color="green" />
          <StatCard label="Lab Staff" value={center.labCount ?? 0} color="yellow" />
          <StatCard label="Patients" value={center.patientCount ?? 0} color="purple" />
        </div>
        <div className="bg-blue-50 rounded-xl p-6 shadow-inner">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Center Admin</h3>
          {center.admin ? (
            <div>
              <p>
                <strong>Name:</strong> {center.admin.name}
              </p>
              <p>
                <strong>Email:</strong> {center.admin.email}
              </p>
              <p>
                <strong>Phone:</strong> {center.admin.phone || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">No admin assigned to this center.</p>
          )}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/CenterAdmin/dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className={`bg-${color}-100 p-6 rounded-xl text-center shadow`}>
    <p className={`text-3xl font-bold text-${color}-700`}>{value}</p>
    <p className="text-gray-700 mt-2">{label}</p>
  </div>
);

export default CenterProfile;
