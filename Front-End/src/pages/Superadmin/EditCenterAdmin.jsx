import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import Input from '../../components/Input'; // ✅ Make sure this path is correct!

import {
  FaUserAlt,
  FaUserMd,
  FaIdBadge,
  FaHospital,
  FaCode,
  FaPhone,
  FaEnvelope,
  FaUserCircle,
  FaKey,
} from 'react-icons/fa';

export default function EditCenterAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
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
  });

  // Load admin data on mount
  useEffect(() => {
    API.get(`/center-admins/${id}`)
      .then((res) => setAdmin(res.data))
      .catch((err) => {
        console.error('Error loading admin:', err);
        alert('❌ Failed to load admin info');
      });
  }, [id]);

  const handleAdminChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...admin };
      if (!admin.password) delete dataToSend.password; // Only send password if filled

      await API.put(`/center-admins/${id}`, dataToSend);
      alert('✅ Admin updated successfully');
      navigate('/superadmin/manage-admins');
    } catch (err) {
      console.error('Error updating admin:', err);
      alert('❌ Failed to update admin');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Edit Center Admin</h2>

      <form onSubmit={handleSubmit}>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">👤 Admin Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" name="name" value={admin.name} onChange={handleAdminChange} icon={<FaUserAlt />} />
          <Input label="Qualification" name="qualification" value={admin.qualification} onChange={handleAdminChange} icon={<FaUserMd />} />
          <Input label="Designation" name="designation" value={admin.designation} onChange={handleAdminChange} icon={<FaIdBadge />} />
          <Input label="KMC No" name="kmcNo" value={admin.kmcNumber} onChange={handleAdminChange} icon={<FaIdBadge />} />
          <Input label="Hospital Name" name="hospitalName" value={admin.hospitalName} onChange={handleAdminChange} icon={<FaHospital />} />
          <Input label="Center Code" name="centerCode" value={admin.centerCode} onChange={handleAdminChange} icon={<FaCode />} />
          <Input label="Phone" name="phone" value={admin.phone} onChange={handleAdminChange} icon={<FaPhone />} />
          <Input label="Email" type="email" name="email" value={admin.email} onChange={handleAdminChange} icon={<FaEnvelope />} />
          <Input label="Username" name="username" value={admin.username} onChange={handleAdminChange} icon={<FaUserCircle />} />
          <Input label="Password" type="password" name="password" value={admin.password} onChange={handleAdminChange} icon={<FaKey />} />
        </div>

        <button
          type="submit"
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
