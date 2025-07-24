import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHospital, FaUserShield, FaTrash, FaEye, FaEdit } from 'react-icons/fa';  
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
    <div className="w-full min-h-screen bg-purple-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-blue-500 mb-8 flex items-center gap-3">
          
          Registered Healthcare Centers
        </h2>

        {loading ? (
          <p className="text-slate-500 text-center">Loading centers...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : centers.length === 0 ? (
          <p className="text-slate-500 text-center text-lg">No centers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {centers.map((center) => (
              <div
                key={center._id}
                className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4"
              >
                <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2 mb-2">
                  <FaHospital className="text-blue-500" /> {center.centername}
                </h3>
                <p className="text-sm text-slate-500 mb-2"><strong>Code:</strong> {center.centerCode || 'N/A'}</p>

                <div className="text-slate-500 text-sm space-y-2 mb-4">
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" /> {center.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaUserShield className="text-blue-500" />
                    {center.centerAdminName || 'No admin assigned'}
                  </p>
                </div>

                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                  <button
                    onClick={() => navigate(`/superadmin/view-center/${center._id}`)}
                    className="flex items-center gap-2 px-4 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl shadow-sm text-sm font-semibold transition border border-blue-100"
                  >
                    <FaEye /> View Info
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold shadow-sm transition border border-blue-100"
                    onClick={() => navigate(`/superadmin/edit-center/${center._id}`)}
                    title="Edit center"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-semibold shadow-sm transition border border-blue-100 disabled:opacity-50"
                    onClick={() => handleDelete(center._id)}
                    disabled={deletingId === center._id}
                    title="Delete center"
                  >
                    <FaTrash />
                    {deletingId === center._id ? 'Deleting...' : 'Delete'}
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
