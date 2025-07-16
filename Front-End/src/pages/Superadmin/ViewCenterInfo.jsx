import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaHospital,
} from 'react-icons/fa';

export default function ViewCenterInfo() {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Use the endpoint that includes centeradmin data
    API.get(`/centers/withadmin/${id}`)
      .then((res) => setCenter(res.data))
      .catch((err) => {
        console.error(err);
        alert('❌ Failed to load center info');
      });
  }, [id]);

  if (!center) return <p className="p-6">Loading center info...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-3">
        <FaHospital className="text-blue-600" />
        {center.name || 'Unnamed Center'}
      </h2>

      <div className="space-y-3 text-gray-700 mb-6">
        {center.location && (
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-400" /> Location: {center.location}
          </p>
        )}
        {center.address && (
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-400" /> Address: {center.address}
          </p>
        )}
        {center.email && (
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-400" /> Email: {center.email}
          </p>
        )}
        {center.phone && (
          <p className="flex items-center gap-2">
            <FaPhone className="text-blue-400" /> Phone: {center.phone}
          </p>
        )}
      </div>

      {center.centeradmin ? (
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
            <FaUserShield className="text-blue-500" />
            Center Admin Details
          </h3>
          <p className="text-gray-700">
            <strong>Name:</strong> {center.centeradmin.name}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {center.centeradmin.email}
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> {center.centeradmin.phone || 'N/A'}
          </p>
          <p className="text-gray-700">
            <strong>Role:</strong> {center.centeradmin.role}
          </p>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800 shadow-inner mt-4">
          <p className="flex items-center mb-3">
            <FaUserShield className="inline-block mr-2 text-yellow-600" />
            No center admin assigned yet.
          </p>
          <button
            onClick={() => navigate(`/superadmin/edit-admin/${center._id}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-sm"
          >
            Assign Center Admin
          </button>

        </div>
      )}
    </div>
  );
}
