import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigateRole(res.data.user.role);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const navigateRole = (role) => {
    if (role === 'superadmin') navigate('/superadmin/dashboard');
    else if (role === 'centeradmin') navigate('/centeradmin/dashboard');
    else if (role === 'doctor') navigate('/doctor/dashboard');
    else if (role === 'receptionist') navigate('/receptionist/dashboard');
    else if (role === 'lab') navigate('/lab/dashboard');
    else navigate('/patient/dashboard');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input name="name" type="text" placeholder="Name" onChange={handleChange} className="input" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input" required />
        <select name="role" onChange={handleChange} className="input">
          <option value="patient">Patient</option>
          <option value="superadmin">Superadmin</option>
          <option value="centeradmin">Center Admin</option>
          <option value="doctor">Doctor</option>
          <option value="receptionist">Receptionist</option>
          <option value="lab">Lab</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
