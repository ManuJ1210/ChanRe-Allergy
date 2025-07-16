import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
  FaHospital,
  
} from "react-icons/fa";

export default function EditCenter() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    address: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const res = await API.get(`/centers/${id}`);
        setForm(res.data);
      } catch (error) {
        console.error(error);
        setMessage({ type: "error", text: "❌ Failed to load center." });
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const res = await API.put(`/centers/${id}`, form);
      setMessage({ type: "success", text: "✅ Center updated successfully!" });
      setTimeout(() => navigate("/superadmin/centers"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "❌ Update failed.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded-3xl mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
        <FaHospital className="text-blue-500" /> Edit Center
      </h2>

      {message.text && (
        <div
          className={`mb-4 px-4 py-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-medium text-gray-700 mb-1 block">
            Center Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="ChanRe Allergy Center"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700 mb-1 block">City</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Bangalore"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-medium text-gray-700 mb-1 block">
            Full Address
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="123 Street, Near XYZ Hospital, Bangalore"
          ></textarea>
        </div>

        <div>
          <label className="font-medium text-gray-700 mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="center@example.com"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700 mb-1 block">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="md:col-span-2 flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Update Center
          </button>
        </div>
      </form>
    </div>
  );
}
