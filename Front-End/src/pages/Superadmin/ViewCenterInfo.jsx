import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaHospital,
  FaUserMd,
  FaUser,
  FaVial,
  FaUsers
} from 'react-icons/fa';
import axios from 'axios';

export default function ViewCenterInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/centers/${id}/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCenter(res.data);
      } catch (err) {
        setError('❌ Failed to load center info');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [id]);

  if (loading) return <p className="p-6">Loading center info...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!center) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 bg-gradient-to-br from-slate-100 to-purple-50 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-8 flex items-center gap-3">
          <FaHospital className="text-purple-500" />
          {center.name || 'Unnamed Center'}
        </h2>

        <div className="space-y-3 text-slate-700 mb-8">
          {center.location && (
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-300" /> Location: {center.location}
            </p>
          )}
          {center.address && (
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-300" /> Address: {center.address}
            </p>
          )}
          {center.email && (
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-purple-300" /> Email: {center.email}
            </p>
          )}
          {center.phone && (
            <p className="flex items-center gap-2">
              <FaPhone className="text-purple-300" /> Phone: {center.phone}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<FaUserMd className="text-purple-400" />} label="Doctors" value={center.doctorCount ?? 0} />
          <StatCard icon={<FaUser className="text-green-400" />} label="Receptionists" value={center.receptionistCount ?? 0} />
          <StatCard icon={<FaVial className="text-yellow-400" />} label="Lab Staff" value={center.labCount ?? 0} />
          <StatCard icon={<FaUsers className="text-purple-500" />} label="Patients" value={center.patientCount ?? 0} />
        </div>

        {center.admin ? (
          <div className="bg-purple-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-xl font-semibold text-purple-700 mb-3 flex items-center gap-2">
              <FaUserShield className="text-purple-500" />
              Center Admin Details
            </h3>
            <p className="text-slate-700">
              <strong>Name:</strong> {center.admin.name}
            </p>
            <p className="text-slate-700">
              <strong>Email:</strong> {center.admin.email}
            </p>
            <p className="text-slate-700">
              <strong>Phone:</strong> {center.admin.phone || 'N/A'}
            </p>
            <p className="text-slate-700">
              <strong>Role:</strong> {center.admin.role}
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 text-yellow-800 shadow-inner mt-4">
            <p className="flex items-center mb-3">
              <FaUserShield className="inline-block mr-2 text-yellow-600" />
              No center admin assigned yet.
            </p>
            <button
              onClick={() => navigate(`/superadmin/edit-admin/${center._id}`)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow text-sm font-semibold transition"
            >
              Assign Center Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center shadow">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}