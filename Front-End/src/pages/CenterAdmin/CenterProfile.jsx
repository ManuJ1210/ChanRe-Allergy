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
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-500 mb-8 text-center tracking-tight">
          {center.name || "N/A"}
        </h2>
        <div className="mb-8 text-center text-slate-500">
          <p>
            <span className="font-semibold text-slate-700">Address:</span> {center.address || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Email:</span> {center.email || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Phone:</span> {center.phone || "N/A"}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <StatCard label="Doctors" value={center.doctorCount ?? 0} />
          <StatCard label="Receptionists" value={center.receptionistCount ?? 0} />
          <StatCard label="Lab Staff" value={center.labCount ?? 0} />
          <StatCard label="Patients" value={center.patientCount ?? 0} />
        </div>
        <div className="bg-blue-50 rounded-xl p-8 shadow-inner border border-blue-100 mb-8">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Center Admin</h3>
          {center.admin ? (
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-slate-700">Name:</span> {center.admin.name}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Email:</span> {center.admin.email}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Phone:</span> {center.admin.phone || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-slate-500">No admin assigned to this center.</p>
          )}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/CenterAdmin/dashboard")}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-3 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-blue-100 p-8 rounded-xl text-center shadow border border-blue-100">
    <p className="text-3xl font-bold text-blue-700">{value}</p>
    <p className="text-slate-700 mt-2 font-medium">{label}</p>
  </div>
);

export default CenterProfile;
