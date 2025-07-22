import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageReceptionists = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchReceptionists = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/receptionists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceptionists(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch receptionists');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this receptionist?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/receptionists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceptionists(receptionists.filter((r) => r._id !== id));
    } catch (err) {
      alert('Failed to delete receptionist');
    }
  };

  const handleEdit = (id) => {
    navigate(`/CenterAdmin/Receptionist/EditReceptionist/${id}`);
  };

  useEffect(() => {
    fetchReceptionists();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Receptionists</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : receptionists.length === 0 ? (
        <p>No receptionists found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y text-gray-800">
              {receptionists.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{r.phone || 'N/A'}</td>
                  <td className="px-4 py-3">{r.username}</td>
                  <td className="px-4 py-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(r._id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageReceptionists; 