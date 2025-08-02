import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchReceptionistPrescriptions, deleteReceptionistPrescription } from '../../../../features/receptionist/receptionistThunks';
import { Plus, Eye, FileText, Trash2 } from 'lucide-react';

const PrescriptionList = ({ patientId: propPatientId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const patientId = propPatientId || params.patientId || params.id;
  const { prescriptions, loading, error } = useSelector((state) => state.receptionist);

  useEffect(() => {
    if (patientId && patientId !== 'undefined') {
      dispatch(fetchReceptionistPrescriptions(patientId));
    }
  }, [dispatch, patientId]);

  const handleDelete = (prescriptionId, patientName) => {
    if (window.confirm(`Are you sure you want to delete the prescription for ${patientName}?`)) {
      dispatch(deleteReceptionistPrescription(prescriptionId));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-blue-500" />
              Prescriptions
            </h2>
            <p className="text-slate-600 mt-1">
              {prescriptions.length} prescription records found
            </p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            onClick={() => navigate(`/receptionist/followup/prescription/add/${patientId}`)}
          >
            <Plus className="h-4 w-4" />
            Add Prescription
          </button>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100">
        <div className="p-6 border-b border-blue-100">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Prescription Records
          </h3>
          <p className="text-slate-600 mt-1">
            View and manage patient prescriptions
          </p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Visit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading prescriptions...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : prescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p>No prescriptions found</p>
                    </td>
                  </tr>
                ) : (
                  prescriptions.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {p.date ? new Date(p.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{p.visit || '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-800 font-medium">{p.patientId?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{p.updatedBy?.name || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            onClick={() => navigate(`/dashboard/receptionist/followup/prescription/view/${p._id}`)}
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            onClick={() => handleDelete(p._id, p.patientId?.name || 'Unknown Patient')}
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionList; 