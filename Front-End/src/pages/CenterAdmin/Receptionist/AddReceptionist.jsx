import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useSelector } from 'react-redux';

const AddReceptionist = () => {
  const { user } = useSelector((state) => state.auth);
  // Try Redux first, then fallback to localStorage
  const centerId = user?.centerId || JSON.parse(localStorage.getItem('user'))?.centerId;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    userType: 'receptionist',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (!centerId) {
      setMessage('No center ID found. Please log in again as a center admin.');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/receptionists', { ...formData, centerId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Receptionist added successfully!');
      setFormData({ name: '', phone: '', email: '', username: '', password: '', userType: 'receptionist' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add receptionist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-blue-500 tracking-tight text-center">Add Receptionist</h2>
        {message && <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
          <div className="relative col-span-1 md:col-span-2">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password*"
              className="border border-blue-100 p-3 rounded-xl w-full text-slate-700 focus:ring-2 focus:ring-blue-300"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition-all duration-200 disabled:opacity-60 col-span-1 md:col-span-2">
            {loading ? 'Submitting...' : 'Add Receptionist'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReceptionist; 