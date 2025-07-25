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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl space-y-7 border border-blue-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-500 mb-2 tracking-tight">Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 text-blue-700 placeholder-blue-400 transition"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 text-blue-700 placeholder-blue-400 transition"
          required
        />

        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-500 hover:underline font-medium"
          >
            Forgot Password?
          </button>
        </div>

        {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition-all duration-200 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
