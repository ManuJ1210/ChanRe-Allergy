import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDoctor } from '../../../features/doctor/doctorThunks';
import { resetDoctorState } from '../../../features/doctor/doctorSlice';
import { Eye, EyeOff } from 'lucide-react';

const AddDoctor = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.doctor);
  const { user } = useSelector((state) => state.auth);
  // Try Redux first, then fallback to localStorage
  const centerId = user?.centerId || JSON.parse(localStorage.getItem('user'))?.centerId;

  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    designation: '',
    kmcNumber: '',
    hospitalName: '',
    centerCode: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    userType: 'doctor',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (success) {
      alert('Doctor added successfully!');
      setFormData({
        name: '',
        qualification: '',
        designation: '',
        kmcNumber: '',
        hospitalName: '',
        centerCode: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        userType: 'doctor',
      });
      dispatch(resetDoctorState());
    }
    if (error) {
      alert(error);
      dispatch(resetDoctorState());
    }
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!centerId) {
      alert('No center ID found. Please log in again as a center admin.');
      return;
    }
    dispatch(createDoctor({ ...formData, centerId }));
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-blue-500 tracking-tight text-center">Add Doctor</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
          <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
          <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
          <input type="text" name="kmcNumber" value={formData.kmcNumber} onChange={handleChange} placeholder="KMC No*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
          <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="Hospital Name*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
          <input type="text" name="centerCode" value={formData.centerCode} onChange={handleChange} placeholder="Center Code*" className="border border-blue-100 p-3 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-300" required />
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
          <select name="userType" value={formData.userType} onChange={handleChange} className="border border-blue-100 p-3 rounded-xl col-span-1 md:col-span-2 text-slate-700 focus:ring-2 focus:ring-blue-300" required>
            <option value="doctor">Doctor</option>
            <option value="lab">Lab</option>
          </select>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition-all duration-200 disabled:opacity-60 col-span-1 md:col-span-2">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
