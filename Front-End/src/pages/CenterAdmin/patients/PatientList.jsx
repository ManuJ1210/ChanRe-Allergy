import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatients } from "../../../features/patient/patientThunks";
import { useNavigate } from "react-router-dom";
import { deletePatient } from '../../../features/patient/patientThunks';
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  User,
  Calendar,
  MapPin
} from 'lucide-react';

export default function PatientList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);

  const { patients, getLoading } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getPatients());
  }, [dispatch]);

  // Filter patients based on search term
  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.centerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedDoctor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleDelete = (id) => {
    
    if (window.confirm('Are you sure you want to delete this patient?')) {
      dispatch(deletePatient(id));
    }
  };

  const getGenderStats = () => {
    const maleCount = patients.filter(p => p.gender === 'male').length;
    const femaleCount = patients.filter(p => p.gender === 'female').length;
    const otherCount = patients.filter(p => p.gender === 'other').length;
    return { maleCount, femaleCount, otherCount };
  };

  const genderStats = getGenderStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Patient List
          </h1>
          <p className="text-slate-600">
            View and manage all patients in your center
          </p>
        </div>

        {/* Search and Add Button */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patients by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => navigate('/CenterAdmin/patients/addpatient')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Patient
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Patients</p>
                <p className="text-2xl font-bold text-slate-800">{patients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Male Patients</p>
                <p className="text-2xl font-bold text-slate-800">{genderStats.maleCount}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Female Patients</p>
                <p className="text-2xl font-bold text-slate-800">{genderStats.femaleCount}</p>
              </div>
              <User className="h-8 w-8 text-pink-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">With Email</p>
                <p className="text-2xl font-bold text-slate-800">
                  {patients.filter(p => p.email).length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">With Phone</p>
                <p className="text-2xl font-bold text-slate-800">
                  {patients.filter(p => p.phone || p.contact).length}
                </p>
              </div>
              <Phone className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Patients List
            </h2>
            <p className="text-slate-600 mt-1">
              {filteredPatients.length} of {patients.length} patients
            </p>
          </div>
          
          <div className="p-6">
            {getLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">
                  {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Age/Gender
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Center Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Assigned Doctor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPatients.map((patient, index) => (
                      <tr key={patient._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-slate-800">{patient.name}</div>
                            <div className="text-sm text-slate-500">#{index + 1}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {patient.email && (
                              <div className="flex items-center text-sm text-slate-600">
                                <Mail className="h-3 w-3 mr-2" />
                                {patient.email}
                              </div>
                            )}
                            {(patient.phone || patient.contact) && (
                              <div className="flex items-center text-sm text-slate-600">
                                <Phone className="h-3 w-3 mr-2" />
                                {patient.phone || patient.contact}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-slate-800">{patient.age} years</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              patient.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                              patient.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {patient.gender}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-slate-600">
                            <MapPin className="h-3 w-3 mr-2" />
                            {patient.centerCode || 'Not assigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">
                            {patient.assignedDoctor?.name || 'Not assigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/CenterAdmin/patients/ViewProfile/${patient._id}`)}
                              className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                              title="View Profile"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/CenterAdmin/patients/EditPatient/${patient._id}`)}
                              className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(patient._id)}
                              className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
