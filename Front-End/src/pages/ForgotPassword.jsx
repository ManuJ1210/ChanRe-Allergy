import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert('❌ Passwords do not match');
            return;
        }

        try {
            const res = await API.post('/auth/forgot-password', {
                email: form.email,
                newPassword: form.password,
                confirmPassword: form.confirmPassword
            });


            alert('✅ Password updated successfully');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || '❌ Failed to reset password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Forgot Password
                </h2>

                <input
                    name="email"
                    type="email"
                    placeholder="Registered Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />

                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div className="relative">
                    <input
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    >
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}
