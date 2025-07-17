import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice'; // ✅ Updated import

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      const { token, user } = res.data;

      // Save in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update Redux state
      dispatch(setUser(user)); // ✅ Correct Redux Toolkit usage

      // Navigate based on role
      navigateRole(user.role.toLowerCase());
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}
