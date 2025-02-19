'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/src/app/admin/Sidebar';
import Dashboard from '@/src/app/admin/Dashboard';
import UserProfile from '@/src/app/admin/UserProfile';
import Blogs from '@/src/app/admin/Blogs';
import ServiceCards from './RecentServices';
import AdminProviderApproval from './ServiceProvider';
import Reviews from './Reviews';
import ServiceManagement from './ServiceManage';
import UsersPage from './Users';
import ServiceProvidersPage from './ProviderData';

export default function HomePage() {
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/75.jpg');
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`flex flex-col h-screen transition-all duration-300 ${
          isMobile
            ? isCollapsed
              ? 'ml-0'
              : 'ml-64'
            : 'ml-0' // <- THIS IS KEY FOR DESKTOP, IGNORE COLLAPSE WIDTH SHIFT
        } flex-1`}
      >
        <header className="bg-white shadow-md p-4 flex justify-between items-center shrink-0">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center space-x-5">
            <img
              src={profileImage}
              alt="User"
              className="w-10 h-10 rounded-full border cursor-pointer"
              onClick={() => setActiveMenuItem('User Profile')}
            />
          </div>
        </header>

        <main className="flex-grow h-0 overflow-y-auto p-4 bg-gray-100">
          {activeMenuItem === 'Dashboard' && <Dashboard />}
          {activeMenuItem === 'User Profile' && <UserProfile profileImage={profileImage} setProfileImage={setProfileImage} />}
          {activeMenuItem === 'Blogs' && <Blogs />}
          {activeMenuItem === 'Recent Services' && <ServiceCards />}
          {activeMenuItem === 'Service Providers' && <AdminProviderApproval />}
          {activeMenuItem === 'Reviews & Feedback' && <Reviews />}
          {activeMenuItem === 'Services Management' && <ServiceManagement />}
          {activeMenuItem === 'Users' && <UsersPage />}
          {activeMenuItem === 'Providers' && <ServiceProvidersPage />}
        </main>
      </div>
    </div>
  );
}
