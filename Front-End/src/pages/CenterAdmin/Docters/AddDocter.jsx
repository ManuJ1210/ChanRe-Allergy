import React, { useState } from 'react';
import axios from 'axios';

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    designation: '',
    kmcNo: '',
    hospitalName: '',
    centerCode: '',
    phone: '',   // correct field
    email: '',
    username: '',
    password: '',
    userType: 'doctor',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/doctors', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Doctor added successfully!');
      setFormData({
        name: '',
        qualification: '',
        designation: '',
        kmcNo: '',
        hospitalName: '',
        centerCode: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        userType: 'doctor',
      });
    } catch (error) {
      alert('Error adding doctor');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Doctor</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name*" className="input" required />
        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification*" className="input" required />
        <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation*" className="input" required />
        <input type="text" name="kmcNo" value={formData.kmcNo} onChange={handleChange} placeholder="KMC No*" className="input" required />
        <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="Hospital Name*" className="input" required />
        <input type="text" name="centerCode" value={formData.centerCode} onChange={handleChange} placeholder="Center Code*" className="input" required />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone*" className="input" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email*" className="input" required />
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username*" className="input" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password*" className="input" required />

        <select name="userType" value={formData.userType} onChange={handleChange} className="input col-span-1 md:col-span-2" required>
          <option value="doctor">Doctor</option>
          <option value="lab">Lab</option>
        </select>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded col-span-1 md:col-span-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;
