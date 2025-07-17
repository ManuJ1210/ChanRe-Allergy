import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCenterField, setAdminField, resetForm, createCenterWithAdmin } from "../../redux/slices/centerSlice";

import { useNavigate } from "react-router-dom";
import {
  FaHospital, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaPlusCircle,
  FaUserAlt, FaUserMd, FaIdBadge, FaCode, FaPhone, FaUserCircle, FaKey, FaUserCog, FaEye, FaEyeSlash
} from "react-icons/fa";

export default function AddCenterWithAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { center, admin, success, error, loading } = useSelector((state) => state.center);
  const [showPassword, setShowPassword] = useState(false);

  const handleCenterChange = (e) => {
    dispatch(setCenterField({ name: e.target.name, value: e.target.value }));
  };

  const handleAdminChange = (e) => {
    dispatch(setAdminField({ name: e.target.name, value: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createCenterWithAdmin({ center, admin }));

    if (createCenterWithAdmin.fulfilled.match(result)) {
      setTimeout(() => {
        dispatch(resetForm());
        navigate("/superadmin/centers");
      }, 1500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-800 mb-8 flex items-center gap-3">
          <FaPlusCircle className="text-blue-600" /> Add Healthcare Center + Admin
        </h2>

        {success && <p className="text-green-600 mb-4">✅ Successfully added center and admin!</p>}
        {error && <p className="text-red-600 mb-4">❌ {error}</p>}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 rounded-xl shadow-xl space-y-10">
          {/* Center Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">🏥 Center Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Center Name" name="name" value={center.name} onChange={handleCenterChange} icon={<FaHospital />} />
              <Input label="Location (City)" name="location" value={center.location} onChange={handleCenterChange} icon={<FaMapMarkerAlt />} />
              <div className="md:col-span-2">
                <TextArea label="Full Address" name="address" value={center.address} onChange={handleCenterChange} icon={<FaMapMarkerAlt />} />
              </div>
              <Input label="Email" name="email" type="email" value={center.email} onChange={handleCenterChange} icon={<FaEnvelope />} />
              <Input label="Phone" name="phone" value={center.phone} onChange={handleCenterChange} icon={<FaPhoneAlt />} />
            </div>
          </div>

          {/* Admin Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">👤 Admin Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" name="name" value={admin.name} onChange={handleAdminChange} icon={<FaUserAlt />} />
              <Input label="Qualification" name="qualification" value={admin.qualification} onChange={handleAdminChange} icon={<FaUserMd />} />
              <Input label="Designation" name="designation" value={admin.designation} onChange={handleAdminChange} icon={<FaIdBadge />} />
              <Input label="KMC No" name="kmcNo" value={admin.kmcNo} onChange={handleAdminChange} icon={<FaIdBadge />} />
              <Input label="Hospital Name" name="hospitalName" value={admin.hospitalName} onChange={handleAdminChange} icon={<FaHospital />} />
              <Input label="Center Code" name="centerCode" value={admin.centerCode} onChange={handleAdminChange} icon={<FaCode />} />
              <Input label="Phone" name="phone" value={admin.phone} onChange={handleAdminChange} icon={<FaPhone />} />
              <Input label="Email" name="email" type="email" value={admin.email} onChange={handleAdminChange} icon={<FaEnvelope />} />
              <Input label="Username" name="username" value={admin.username} onChange={handleAdminChange} icon={<FaUserCircle />} />

              {/* Password with eye toggle */}
              <div>
                <label className="mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaKey className="text-gray-500" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={admin.password}
                    onChange={handleAdminChange}
                    required
                    className="w-full border border-gray-300 p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* User Type */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaUserCog className="text-gray-500" />
                  User Type *
                </label>
                <select
                  name="userType"
                  value={admin.userType}
                  onChange={handleAdminChange}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="centeradmin">Center Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="lab">Lab</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold shadow transition text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? "Submitting..." : "Submit Both"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable components
function Input({ label, name, value, onChange, type = "text", icon }) {
  return (
    <div>
      <label className="mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
        <span className="text-gray-500">{icon}</span>
        {label} *
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, icon }) {
  return (
    <div>
      <label className="mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
        <span className="text-gray-500">{icon}</span>
        {label} *
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required
        rows={3}
        className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
