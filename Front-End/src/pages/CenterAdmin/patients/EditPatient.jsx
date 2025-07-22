import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSinglePatient,
  updatePatient,
} from "../../../features/patient/patientThunks";
import { resetPatientState } from "../../../features/patient/patientSlice";

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    singlePatient,
    patientLoading,
    patientError,
    editSuccess,
  } = useSelector((state) => state.patient);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
  });

  useEffect(() => {
    dispatch(getSinglePatient(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (singlePatient) {
      setFormData({
        name: singlePatient.name || "",
        email: singlePatient.email || "",
        phone: singlePatient.phone || "",
        age: singlePatient.age || "",
        gender: singlePatient.gender || "",
        address: singlePatient.address || "",
      });
    }
  }, [singlePatient]);

  useEffect(() => {
    if (editSuccess) {
      alert("Patient updated successfully!");
      dispatch(resetPatientState());
      navigate("/CenterAdmin/patients/PatientList");
    }
  }, [editSuccess, dispatch, navigate]);

  useEffect(() => {
    if (patientError) {
      alert(patientError);
    }
  }, [patientError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting patient update:", formData);
    dispatch(updatePatient({ id, updatedData: formData }));
  };

  if (patientLoading) {
    return <div className="text-center py-10">Loading patient data...</div>;
  }

  return (
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
