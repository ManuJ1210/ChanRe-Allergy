import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHospital, FaUserShield, FaTrash, FaEye } from 'react-icons/fa';
import { fetchCenters, deleteCenter } from '../../features/center/centerThunks';

export default function CentersList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { centers, loading, deletingId, error } = useSelector((state) => state.center);

  useEffect(() => {
    dispatch(fetchCenters());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this center?');
    if (confirmDelete) {
      dispatch(deleteCenter(id));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-3">
          <FaHospital className="text-blue-600" />
          Registered Healthcare Centers
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading centers...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : centers.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">No centers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <div
                key={center._id}
                className="relative bg-white p-6 rounded-xl shadow-md border border-gray-200"
              >
                <button
                  className="absolute top-3 right-12 text-green-500 hover:text-green-700"
                  onClick={() => navigate(`/superadmin/edit-center/${center._id}`)}
                  title="Edit center"
                >
                  Edit
                </button>

                <button
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 disabled:opacity-50"
                  onClick={() => handleDelete(center._id)}
                  disabled={deletingId === center._id}
                  title="Delete center"
                >
                  {deletingId === center._id ? (
                    <span className="text-xs text-gray-400">Deleting...</span>
                  ) : (
                    <FaTrash />
                  )}
                </button>

                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                  <FaHospital className="text-blue-500" /> {center.centername}
                </h3>
                <p className="text-sm text-gray-500 mb-2"><strong>Code:</strong> {center.centerCode || 'N/A'}</p>

                <div className="text-gray-600 text-sm space-y-2 mb-6">
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-400" /> {center.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaUserShield className="text-blue-400" />
                    {center.centerAdminName || 'No admin assigned'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/superadmin/view-center/${center._id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow text-sm"
                  >
                    <FaEye /> View Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
