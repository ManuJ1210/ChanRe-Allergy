import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';

export default function ReceptionistLayout({ children }) {
  // Fallback: if Redux is not set, use localStorage
  const userInfo = useSelector((state) => state.user?.userInfo) || JSON.parse(localStorage.getItem('user'));
  // If userInfo is missing or role is not receptionist, force receptionist role for sidebar
  const receptionistUserInfo = userInfo && userInfo.role === 'receptionist' ? userInfo : { role: 'receptionist' };
  return (
    <div className="flex min-h-screen">
      <Sidebar userInfo={receptionistUserInfo} />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
} 