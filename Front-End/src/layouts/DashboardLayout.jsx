import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Main content wrapper (pushed right) */}
      <div className="ml-[18.5rem] flex flex-col min-h-screen">
        {/* Top header */}
        <Header />

        {/* Page content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
