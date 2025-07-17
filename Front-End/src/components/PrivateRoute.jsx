import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children }) {
  const userInfo = useSelector((state) => state.user?.userInfo);
  const token = userInfo?.token || localStorage.getItem('token');

  return token ? children : <Navigate to="/login" />;
}
