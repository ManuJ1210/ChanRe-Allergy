import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const EditReceptionist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    userType: 'receptionist',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchReceptionist = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/receptionists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({ ...res.data, password: '' });
      } catch (err) {
        setMessage('Failed to fetch receptionist');
      } finally {
        setLoading(false);
      }
    };
    fetchReceptionist();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/receptionists/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Receptionist updated successfully!');
      setTimeout(() => navigate('/CenterAdmin/Receptionist/ManageReceptionists'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update receptionist');
    }
  };

  if (loading) return <div className="p-6 text-gray-700">Loading...</div>;

  return (
    <div className="p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 w-full max-w-3xl mx-auto mt-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent drop-shadow-lg mb-8 tracking-tight">Edit Receptionist</h2>
      {message && <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name*" className="p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 text-blue-700 placeholder-blue-400 transition" required />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone*" className="p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 text-blue-700 placeholder-blue-400 transition" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email*" className="p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 text-blue-700 placeholder-blue-400 transition" required />
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username*" className="p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 text-blue-700 placeholder-blue-400 transition" required />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password*"
            className="p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 text-blue-700 placeholder-blue-400 transition w-full"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <button type="submit" className="col-span-1 md:col-span-2 w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition-all duration-200">
          Update Receptionist
        </button>
      </form>
    </div>
  );
};

export default EditReceptionist; 