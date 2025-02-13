"use client";
import Image from "next/image";
import { useState } from "react";

export function Sidebar() {
  const [selected, setSelected] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: "/images/dashboard-icon" },
    { name: "Bookings", icon: "/images/bookings-icon" },
    { name: "Services", icon: "/images/services-icon" },
    { name: "Customers", icon: "/images/customers-icon" },
  ];

  return (
    <div className="w-64 bg-white p-5 shadow-lg min-h-screen">
      <div className="flex items-center p-2 mb-14">
        <img
          src="https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex w-full flex-col">
          <span className="font-semibold pl-3">John Smith</span>
          <span className="text-xs pl-3">CEO</span>
        </div>
      </div>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`p-2 rounded-2xl m-2 my-3 cursor-pointer transition-all 
              ${
                selected === item.name
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-slate-100 text-black hover:bg-gray-200"
              }`}
            onClick={() => setSelected(item.name)}
          >
            <div className="flex items-center">
              <img
                src={`${item.icon}-${selected === item.name ? "light" : "dark"}.svg`}
                alt={`${item.name} Icon`}
                className="m-1 w-5 h-5"
              />
              <span className="ml-2">{item.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
