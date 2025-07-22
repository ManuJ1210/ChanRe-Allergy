import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById, updateDoctor } from '../../../features/doctor/doctorThunks';
import { resetUpdateStatus } from '../../../features/doctor/doctorSlice';
import { Eye, EyeOff } from 'lucide-react';

const EditDoctor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctorData, loading, updateSuccess, error } = useSelector((state) => state.doctor);

  const [showPassword, setShowPassword] = useState(false);
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
    userType: 'doctor',
    password: '',
  });

  // Fetch doctor details by ID
  useEffect(() => {
    if (id) dispatch(fetchDoctorById(id));
  }, [dispatch, id]);

  // Populate form with fetched doctor data
  useEffect(() => {
    if (doctorData && typeof doctorData === 'object') {
      setFormData((prev) => ({
        ...prev,
        ...doctorData,
        password: '', // don't fill password
      }));
    }
  }, [doctorData]);

  // Handle successful update
  useEffect(() => {
    if (updateSuccess) {
      alert('Doctor updated successfully!');
      dispatch(resetUpdateStatus());
      navigate('/CenterAdmin/Docters/DocterList');
    }
  }, [updateSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDoctor({ id, formData }));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Doctor</h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name*" className="input border border-gray-300 p-2 rounded" required />
        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification*" className="input border border-gray-300 p-2 rounded" required />
        <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation*" className="input border border-gray-300 p-2 rounded" required />
        <input type="text" name="kmcNumber" value={formData.kmcNumber} onChange={handleChange} placeholder="KMC No*" className="input border border-gray-300 p-2 rounded" required />
        <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="Hospital Name*" className="input border border-gray-300 p-2 rounded" required />
        <input type="text" name="centerCode" value={formData.centerCode} onChange={handleChange} placeholder="Center Code*" className="input border border-gray-300 p-2 rounded" required />
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

        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          className="input border border-gray-300 p-2 rounded col-span-1 md:col-span-2"
          required
        >
          <option value="doctor">Doctor</option>
          <option value="lab">Lab</option>
        </select>

        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded col-span-1 md:col-span-2">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditDoctor;
