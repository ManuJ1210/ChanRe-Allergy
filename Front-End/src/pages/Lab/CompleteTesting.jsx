import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CompleteTesting() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/lab/test-request/${id}`)}
          className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Test Request Details
        </button>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Complete Lab Testing
          </h1>
          <p className="text-slate-600 mb-4">
            Test Request ID: {id}
          </p>
          <p className="text-slate-600">
            This page will allow lab technicians to complete testing and enter results.
            Implementation coming soon...
          </p>
        </div>
      </div>
    </div>
  );
} 