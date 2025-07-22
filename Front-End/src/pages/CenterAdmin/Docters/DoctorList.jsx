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
    <div className="p-6 bg-white rounded-2xl shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Doctors</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">KMC No</th>
                <th className="px-4 py-3">Qualification</th>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y text-gray-800">
  {doctors.map((doc) => (
    <tr key={doc._id} className="hover:bg-gray-50 transition">
      <td className="px-4 py-3">{doc.name}</td>
      <td className="px-4 py-3">{doc.email}</td>
      <td className="px-4 py-3">{doc.phone || 'N/A'}</td>
      <td className="px-4 py-3">{doc.kmcNumber || 'N/A'}</td>
      <td className="px-4 py-3">{doc.qualification || 'N/A'}</td>
      <td className="px-4 py-3">{doc.hospitalName || 'Narayana Hospital'}</td>
      <td className="px-4 py-3 flex justify-center gap-3">
        <button
          onClick={() => handleEdit(doc._id)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full"
          title="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => handleDelete(doc._id)}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
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
  );
};

export default DoctorList;
