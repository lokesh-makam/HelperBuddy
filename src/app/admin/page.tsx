'use client';

import {useEffect, useState} from 'react';
import Sidebar from '@/src/app/admin/Sidebar';
import Dashboard from '@/src/app/admin/Dashboard';
import UserProfile from '@/src/app/admin/UserProfile';
import Blogs from '@/src/app/admin/Blogs';
import ServiceCards from './RecentServices';
import AdminProviderApproval from './ServiceProvider';
import Reviews from './Reviews';
import ServiceManagement from './ServiceManage';
import {useUser} from "@clerk/nextjs";
import {getuser} from "@/src/actions/user";
import {router} from "next/client";
import Loading from "@/src/app/loading";
import {useRouter} from "next/navigation";

export default function HomePage() {
  const [loading,setloading]=useState(true);
  const {user}=useUser();
  const router=useRouter();
  useEffect(() => {
    if(user){
  getuser(user.emailAddresses[0]?.emailAddress).then((res)=> {
    console.log(res)
    if(res?.role!=='admin') {
      router.push('/');
    return;
    }
     setloading(false);
  });
    }
  }, [user]);
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/75.jpg');

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
if(loading) return <Loading/>
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col md:ml-0 ml-20">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
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

        <main className="p-4 flex-1 overflow-auto">
          {activeMenuItem === 'Dashboard' && <Dashboard />}
          {activeMenuItem === 'User Profile' && <UserProfile profileImage={profileImage} setProfileImage={setProfileImage} />}
          {activeMenuItem === 'Blogs' && <Blogs />}
          {activeMenuItem === 'Recent Services' && <ServiceCards />}
          {activeMenuItem === 'Service Providers' && <AdminProviderApproval />}
          {activeMenuItem === 'Reviews & Feedback' && <Reviews />}
          {activeMenuItem === 'Services Management' && <ServiceManagement />}
        </main>
      </div>
    </div>
  );
}