import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function LabRouteProtection({ children }) {
  const { user } = useSelector((state) => state.auth);
  
  // If user is Lab Staff, redirect them away from lab dashboard
  if (user && (user.role === 'Lab Staff' || user.role === 'lab staff')) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow access for other lab roles (Lab Technician, Lab Assistant, Lab Manager)
  return children;
} 