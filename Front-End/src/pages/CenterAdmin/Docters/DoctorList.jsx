import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch doctors');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/doctors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDoctors(doctors.filter((doc) => doc._id !== id)); 
  } catch (err) {
    alert('Failed to delete doctor');
  }
};


  const navigate = useNavigate();

const handleEdit = (id) => {
  navigate(`/CenterAdmin/Docters/EditDoctor/${id}`);
};

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="mt-6 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-blue-500 tracking-tight">Manage Doctors</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : doctors.length === 0 ? (
          <p className="text-slate-500">No doctors found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl p-2">
            <table className="min-w-full divide-y divide-blue-100 text-base">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Name</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Email</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Phone</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">KMC No</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Qualification</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Hospital</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50 text-slate-700">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-center">{doc.name}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{doc.email}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{doc.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{doc.kmcNumber || 'N/A'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{doc.qualification || 'N/A'}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{doc.hospitalName || 'Narayana Hospital'}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(doc._id)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full font-semibold transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full font-semibold transition"
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

export default DoctorList;
