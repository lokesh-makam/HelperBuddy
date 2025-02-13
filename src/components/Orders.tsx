"use client";

import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Order {
  id: string;
  service: {
    id: string;
    name: string;
  };
  status: string;
  date: string;
  time: string;
  totalAmount: string;
  createdAt: string;
  remark?: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <Skeleton key={idx} height={180} borderRadius={8} />
            ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {order.service.name}
                </h3>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    order.status === "COMPLETED"
                      ? "bg-green-100 text-green-600"
                      : order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Date: {new Date(order.date).toDateString()} at {order.time}
              </p>
              <p className="text-gray-800 font-semibold mb-2">
                Total: ₹{order.totalAmount}
              </p>
              {order.remark && (
                <p className="text-gray-500 italic">Remark: {order.remark}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
