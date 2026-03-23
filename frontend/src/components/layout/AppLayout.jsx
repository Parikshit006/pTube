import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const AppLayout = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Navbar />
      <Sidebar />
      <main className={`flex-1 pt-[56px] transition-[margin] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? 'lg:ml-[240px]' : 'lg:ml-[68px]'}`}>
        <div className="max-w-[1800px] mx-auto w-full p-4 lg:p-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
