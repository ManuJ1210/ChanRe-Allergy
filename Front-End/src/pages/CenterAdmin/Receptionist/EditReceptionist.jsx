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
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Receptionist</h2>
      {message && <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name*" className="input border border-gray-300 p-2 rounded" required />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone*" className="input border border-gray-300 p-2 rounded" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email*" className="input border border-gray-300 p-2 rounded" required />
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username*" className="input border border-gray-300 p-2 rounded" required />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password*"
            className="input border border-gray-300 p-2 rounded w-full"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded col-span-1 md:col-span-2">
          Update Receptionist
        </button>
      </form>
    </div>
  );
};

export default EditReceptionist; 