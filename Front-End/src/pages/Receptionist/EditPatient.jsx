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
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Patient Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 text-sm"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 text-sm"
              />
            </div>
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {success && <div className="text-green-600 mb-2">Patient updated successfully!</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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
