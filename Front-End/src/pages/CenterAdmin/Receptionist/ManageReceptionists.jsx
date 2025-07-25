import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

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
    <div className="mt-6 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent drop-shadow-lg mb-12 tracking-tight mt-8">Manage Receptionists</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : receptionists.length === 0 ? (
          <p className="text-slate-500">No receptionists found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-3xl shadow-2xl border border-blue-100 p-6">
            <table className="min-w-full divide-y divide-blue-100 text-base">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Name</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Email</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Phone</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Username</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50 text-slate-700">
                {receptionists.map((r) => (
                  <tr key={r._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-center">{r.name}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{r.email}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{r.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{r.username}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(r._id)}
                        className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white p-2 rounded-full font-semibold shadow transition-all duration-200"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full font-semibold shadow transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReceptionists; 