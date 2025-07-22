import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      // Store centerId for centeradmin
      if (user.role && user.role.toLowerCase() === 'centeradmin' && user.centerId) {
        localStorage.setItem('centerId', user.centerId);
      }
      const role = user.role.toLowerCase();
      if (role === 'superadmin') navigate('/superadmin/dashboard');
      else if (role === 'centeradmin') navigate('/centeradmin/dashboard');
      else if (role === 'doctor') navigate('/doctor/dashboard');
      else if (role === 'receptionist') navigate('/receptionist/dashboard');
      else if (role === 'lab') navigate('/lab/dashboard');
      else navigate('/patient/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
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

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow transition duration-300"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
