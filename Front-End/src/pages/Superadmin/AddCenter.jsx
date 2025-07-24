// src/pages/superadmin/AddCenterWithAdmin.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCenterWithAdmin } from "../../features/center/centerThunks";
import { resetStatus } from "../../features/center/centerSlice";
import { useNavigate } from "react-router-dom";
import {
  FaHospital, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaPlusCircle,
  FaUserAlt, FaUserMd, FaIdBadge, FaCode, FaPhone, FaUserCircle, FaKey,
  FaUserCog, FaEye, FaEyeSlash
} from "react-icons/fa";

export default function AddCenterWithAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector((state) => state.center);

  const [center, setCenter] = useState({
    centername: "", location: "", fulladdress: "", email: "", phone: "", code: ""
  });

  const [admin, setAdmin] = useState({
    name: "", qualification: "", designation: "", kmcNumber: "", hospitalName: "",
    phone: "", email: "", username: "", password: "", userType: "centeradmin",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleCenterChange = (e) => {
    const { name, value } = e.target;
    setCenter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCenterWithAdmin({ center, admin }));
  };

  useEffect(() => {
    if (success) {
      setCenter({ centername: "", location: "", fulladdress: "", email: "", phone: "", code: "" });
      setAdmin({
        name: "", qualification: "", designation: "", kmcNumber: "", hospitalName: "",
        phone: "", email: "", username: "", password: "", userType: "centeradmin",
      });

      setTimeout(() => {
        dispatch(resetStatus());
        navigate("/superadmin/centers");
      }, 1500);
    }
  }, [success, navigate, dispatch]);

  return (
    <div className="w-full min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-500 mb-8 flex items-center gap-3">
          Add Healthcare Center + Admin
        </h2>

        {success && <p className="text-green-600 mb-4">✅ Successfully added center and admin!</p>}
        {error && <p className="text-red-600 mb-4">❌ {error}</p>}

        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-10">
          {/* Center Info */}
          <Section title="🏥 Center Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Center Name" name="centername" value={center.centername} onChange={handleCenterChange} icon={<FaHospital className='text-blue-400' />} />
              <Input label="Location (City)" name="location" value={center.location} onChange={handleCenterChange} icon={<FaMapMarkerAlt className='text-blue-300' />} />
              <Input label="Center Code" name="code" value={center.code} onChange={handleCenterChange} icon={<FaCode className='text-blue-300' />} />
              <div className="md:col-span-2">
                <TextArea label="Full Address" name="fulladdress" value={center.fulladdress} onChange={handleCenterChange} icon={<FaMapMarkerAlt className='text-blue-300' />} />
              </div>
              <Input label="Email" name="email" type="email" value={center.email} onChange={handleCenterChange} icon={<FaEnvelope className='text-blue-300' />} />
              <Input label="Phone" name="phone" value={center.phone} onChange={handleCenterChange} icon={<FaPhoneAlt className='text-blue-300' />} />
            </div>
          </Section>

          {/* Admin Info */}
          <Section title="👤 Admin Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" name="name" value={admin.name} onChange={handleAdminChange} icon={<FaUserAlt className='text-blue-400' />} />
              <Input label="Qualification" name="qualification" value={admin.qualification} onChange={handleAdminChange} icon={<FaUserMd className='text-blue-300' />} />
              <Input label="Designation" name="designation" value={admin.designation} onChange={handleAdminChange} icon={<FaIdBadge className='text-blue-300' />} />
              <Input label="KMC Number" name="kmcNumber" value={admin.kmcNumber} onChange={handleAdminChange} icon={<FaIdBadge className='text-blue-300' />} />
              <Input label="Hospital Name" name="hospitalName" value={admin.hospitalName} onChange={handleAdminChange} icon={<FaHospital className='text-blue-300' />} />
              <Input label="Phone" name="phone" value={admin.phone} onChange={handleAdminChange} icon={<FaPhone className='text-blue-300' />} />
              <Input label="Email" name="email" type="email" value={admin.email} onChange={handleAdminChange} icon={<FaEnvelope className='text-blue-300' />} />
              <Input label="Username" name="username" value={admin.username} onChange={handleAdminChange} icon={<FaUserCircle className='text-blue-300' />} />

              {/* Password */}
              <div>
                <label className="mb-2 text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FaKey className="text-blue-300" /> Password *
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={admin.password}
                    onChange={handleAdminChange}
                    required
                    className="w-full border border-slate-100 p-3 pr-10 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <span
                    className="absolute right-3 top-3 text-slate-400 hover:text-blue-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* User Type */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-2 text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FaUserCog className="text-blue-300" /> User Type *
                </label>
                <select
                  name="userType"
                  value={admin.userType}
                  onChange={handleAdminChange}
                  required
                  className="w-full border border-slate-100 p-3 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="centeradmin">Center Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="lab">Lab</option>
                </select>
              </div>
            </div>
          </Section>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg font-semibold text-lg transition-all duration-200 disabled:opacity-60 ${loading ? 'opacity-60' : ''}`}
            >
              {loading ? "Submitting..." : "Submit Both"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Input = ({ label, name, value, onChange, type = "text", icon }) => (
  <div>
    <label className="mb-2 text-sm font-medium text-slate-700 flex items-center gap-2">
      <span className="text-blue-500">{icon}</span>
      {label} *
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, icon }) => (
  <div>
    <label className="mb-2 text-sm font-medium text-slate-700 flex items-center gap-2">
      <span className="text-blue-500">{icon}</span>
      {label} *
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required
      rows={3}
      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-semibold text-blue-700 mb-2">{title}</h3>
    {children}
  </div>
);
