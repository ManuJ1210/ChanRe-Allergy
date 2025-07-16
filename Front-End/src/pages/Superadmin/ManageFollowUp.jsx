// src/pages/followup/ManageFollowUp.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ManageFollowUp() {
  const [followUps, setFollowUps] = useState([]);

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const res = await API.get("/followup");
      setFollowUps(res.data);
    } catch (err) {
      console.error("Error fetching follow-ups", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/followup/${id}`, { status: newStatus });
      fetchFollowUps();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">Manage Follow Ups</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Condition</th>
              <th className="px-4 py-2">Last Visit</th>
              <th className="px-4 py-2">Next Follow-up</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{item.patientName}</td>
                <td className="px-4 py-2">{item.condition}</td>
                <td className="px-4 py-2">{new Date(item.lastVisit).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(item.nextVisit).toLocaleDateString()}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleStatusChange(item._id, "completed")}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => handleStatusChange(item._id, "pending")}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Mark Pending
                  </button>
                </td>
              </tr>
            ))}
            {followUps.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-400">
                  No follow-up data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
