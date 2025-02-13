"use client";  // Add this if using Next.js 14 App Router

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Sidebar } from "@/src/components/Sidebar";
import { Navbar } from "@/src/components/AdminNavBar";

const data = [
  { name: "Jan", revenue: 22000 },
  { name: "Feb", revenue: 29000 },
  { name: "Mar", revenue: 35000 },
  { name: "Apr", revenue: 18000 },
  { name: "May", revenue: 25000 },
  { name: "Jun", revenue: 50000 },
  { name: "Jul", revenue: 33000 },
  { name: "Aug", revenue: 40000 },
  { name: "Sep", revenue: 23000 },
  { name: "Oct", revenue: 37000 },
  { name: "Nov", revenue: 39000 },
  { name: "Dec", revenue: 42000 }
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Total Projects</h3>
              <p className="text-4xl font-bold">10,724</p>
              <p className="text-sm text-gray-500">All running & completed projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Completed Projects</h3>
              <p className="text-4xl font-bold">9,801</p>
              <p className="text-sm text-gray-500">+12% Completion rate this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Running Projects</h3>
              <p className="text-4xl font-bold">923</p>
              <p className="text-sm text-gray-500">+8% Running projects increase</p>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent>
              <h3 className="text-lg font-semibold">Revenue Chart</h3>
              {mounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
