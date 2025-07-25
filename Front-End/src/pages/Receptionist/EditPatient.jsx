import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import ReceptionistLayout from './ReceptionistLayout';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPatient();
    // eslint-disable-next-line
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        age: res.data.age || "",
        gender: res.data.gender || "",
        address: res.data.address || "",
      });
    } catch (err) {
      setError("Failed to fetch patient");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      await API.put(`/patients/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setTimeout(() => navigate("/receptionist/patients"), 1000);
    } catch (err) {
      setError("Failed to update patient");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading patient data...</div>;
  }

  return (
    <ReceptionistLayout>
      <div className="max-w-3xl mx-auto p-10 bg-white shadow-xl rounded-2xl mt-12 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-500 mb-8 text-center tracking-tight">Edit Patient Details</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Contact</label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-blue-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
              />
            </div>
          </div>
          {error && <div className="mb-4 bg-red-50 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl">{error}</div>}
          {success && <div className="mb-4 bg-blue-50 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl">Patient updated successfully!</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-3 rounded-xl font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all"
              disabled={loading}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </ReceptionistLayout>
  );
}
