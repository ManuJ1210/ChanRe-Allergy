import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="pt-14 transition-all duration-300 md:ml-[18.5rem]">
        <div className="max-w-7xl mx-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
