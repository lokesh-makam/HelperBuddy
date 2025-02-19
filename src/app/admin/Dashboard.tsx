// 'use client';
//
// import { useState, useEffect } from 'react';
// import { Bar, Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js';
// import AnimatedCounter from './AnimatedCounter';
//
// // Register necessary chart components
// ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);
//
// export default function Dashboard() {
//   const customers = 1245;
//   const bookings = 378;
//   const revenue = 45320;
//
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [],
//   });
//
//   // Pie chart data for service orders
//   const [pieChartData, setPieChartData] = useState({
//     labels: ['Cleaning Service', 'Plumbing Service', 'Electrical Repair', 'Gardening Service'],
//     datasets: [
//       {
//         data: [35, 25, 20, 20], // Example data representing percentage of orders
//         backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722'],
//         borderColor: ['#388E3C', '#F57C00', '#1976D2', '#D32F2F'],
//         borderWidth: 2,
//       },
//     ],
//   });
//
//   useEffect(() => {
//     setChartData({
//       labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//       datasets: [
//         {
//           label: 'Revenue',
//           data: [12000, 15000, 8000, 18000, 22000, 17000, 25000],
//           backgroundColor: 'rgba(99, 102, 241, 0.6)',
//           borderColor: 'rgba(99, 102, 241, 1)',
//           borderWidth: 2,
//           borderRadius: 6,
//           barThickness: 40,
//         },
//       ],
//     });
//   }, []);
//
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false, // Allow charts to resize based on container
//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: false,
//       },
//       tooltip: {
//         backgroundColor: '#1f2937',
//         titleColor: '#f3f4f6',
//         bodyColor: '#f3f4f6',
//         padding: 12,
//         cornerRadius: 8,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: '#6b7280',
//         },
//       },
//       y: {
//         grid: {
//           color: '#e5e7eb',
//         },
//         ticks: {
//           color: '#6b7280',
//           precision: 0,
//         },
//       },
//     },
//     animation: {
//       duration: 1500, // Duration of animation for smooth transitions
//       easing: 'easeInOutQuad', // Smooth easing function
//     },
//   };
//
//   return (
//     <div className="bg-gray-100 min-h-screen p-4 sm:p-6">
//       {/* Top Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
//         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col gap-2">
//           <h3 className="text-gray-500 text-sm uppercase">Number of Customers</h3>
//           <p className="text-2xl sm:text-3xl font-bold text-gray-800">
//             <AnimatedCounter endValue={customers} />
//           </p>
//         </div>
//         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col gap-2">
//           <h3 className="text-gray-500 text-sm uppercase">Number of Bookings</h3>
//           <p className="text-2xl sm:text-3xl font-bold text-gray-800">
//             <AnimatedCounter endValue={bookings} />
//           </p>
//         </div>
//         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col gap-2">
//           <h3 className="text-gray-500 text-sm uppercase">Revenue</h3>
//           <p className="text-2xl sm:text-3xl font-bold text-green-600">
//             ₹<AnimatedCounter endValue={revenue} />
//           </p>
//         </div>
//       </div>
//
//       {/* Sales Graph */}
//       <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6 sm:mb-8">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales Overview</h3>
//         <div className="h-64 sm:h-72">
//           <Bar data={chartData} options={chartOptions} />
//         </div>
//       </div>
//
//       {/* Pie Chart for Service Orders */}
//       <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6 sm:mb-8">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Order Distribution</h3>
//         <div className="flex justify-center items-center h-80 sm:h-96">
//           <div className="w-full h-full max-w-[600px]">
//             <Pie
//               data={pieChartData}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false, // Allow pie chart to resize
//                 plugins: {
//                   tooltip: {
//                     backgroundColor: '#1f2937',
//                     titleColor: '#f3f4f6',
//                     bodyColor: '#f3f4f6',
//                     padding: 12,
//                     cornerRadius: 8,
//                   },
//                   legend: {
//                     position: 'top',
//                     labels: {
//                       font: {
//                         size: 14,
//                       },
//                     },
//                   },
//                 },
//                 animation: {
//                   animateScale: true,
//                   animateRotate: true,
//                   duration: 1500, // Smooth animation duration
//                   easing: 'easeInOutQuad', // Smooth easing function
//                 },
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import AnimatedCounter from "./AnimatedCounter";
import { getServiceStats } from "@/src/actions/admin"; // Import server action
import { toast } from "react-toastify";

// Register necessary chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [customers, setCustomers] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  // Pie chart remains fake
  const pieChartData = {
    labels: ["Cleaning Service", "Plumbing Service", "Electrical Repair", "Gardening Service"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#FF5722"],
        borderColor: ["#388E3C", "#F57C00", "#1976D2", "#D32F2F"],
        borderWidth: 2,
      },
    ],
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getServiceStats();
        if (response.error) {
          toast.error(response.error);
          return;
        }
        setCustomers(response.totalCustomers);
        setBookings(response.totalServiceRequests);
        setRevenue(response.totalRevenue);

        // Populate Bar Chart Data
        setChartData({
          //@ts-ignore
          labels: response.monthlyRevenue.map((entry:any) => entry.month), // Months
          datasets: [
            //@ts-ignore
            {
              label: "Revenue",
              data: response?.monthlyRevenue?.map((entry:any) => entry.revenue),
              backgroundColor: "rgba(99, 102, 241, 0.6)",
              borderColor: "rgba(99, 102, 241, 1)",
              borderWidth: 2,
              borderRadius: 6,
              barThickness: 40,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast.error("Failed to load dashboard data.");
      }
    }

    fetchStats();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f3f4f6",
        bodyColor: "#f3f4f6",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6b7280" } },
      y: { grid: { color: "#e5e7eb" }, ticks: { color: "#6b7280", precision: 0 } },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuad",
    },
  };

  return (
      <div className="bg-gray-100 min-h-screen p-6">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-2">
            <h3 className="text-gray-500 text-sm uppercase">Number of Customers</h3>
            <p className="text-3xl font-bold text-gray-800">
              <AnimatedCounter endValue={customers} />
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-2">
            <h3 className="text-gray-500 text-sm uppercase">Number of Bookings</h3>
            <p className="text-3xl font-bold text-gray-800">
              <AnimatedCounter endValue={bookings} />
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-2">
            <h3 className="text-gray-500 text-sm uppercase">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              ₹<AnimatedCounter endValue={revenue} />
            </p>
          </div>
        </div>

        {/* Sales Graph */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales Overview</h3>
          <div className="h-72">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart for Service Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Order Distribution</h3>
          <div className="flex justify-center items-center h-96">
            <div className="w-full h-full max-w-[600px]">
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>
      </div>
  );
}
