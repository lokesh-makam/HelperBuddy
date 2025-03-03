"use client";

import React, { useEffect, useState } from "react";
import { Eye, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { getPendingServiceRequests, updateServiceRequestStatus } from "@/src/actions/partner";
import { toast } from "react-toastify";

const ServiceDashboard = ({ partnerdetails }: any) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any>([]);

  const queryClient = useQueryClient();

  // Fetch orders
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getPendingServiceRequests,
  });

  useEffect(() => {
    if (data) {
      console.log(data.data);
      setOrders(data.data);
    }
  }, [data]);

  // Mutation to update order status (Only Accept)
  const mutation = useMutation({
    mutationFn: async (orderId: string) => {
      if (!orderId) throw new Error("Invalid order ID.");
      await updateServiceRequestStatus(orderId, "Accepted", partnerdetails.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]); // Refetch data after update
      setIsConfirmOpen(false);
      toast.success("Order accepted successfully!");
    },
    onError: (error) => {
      console.error("Error updating service request:", error);
      toast.error(error?.message || "Failed to accept order.");
    },
  });

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const openConfirmDialog = (orderId: string) => {
    setConfirmOrderId(orderId);
    setIsConfirmOpen(true);
  };

  const handleConfirmAccept = () => {
    if (confirmOrderId) {
      mutation.mutate(confirmOrderId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Failed to fetch service requests.</p>;

  return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Service Orders</h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.service.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-6">
                      <button onClick={() => handleViewDetails(order)} className="text-gray-600 hover:text-gray-900">
                        <Eye size={20} />
                      </button>
                      {order.status === "pending" && (
                          <button
                              onClick={() => openConfirmDialog(order.id)}
                              className="text-green-600 hover:text-green-900"
                          >
                            <Check size={20} />
                          </button>
                      )}
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
                <div className="mt-4 space-y-4">
                  <p>
                    <strong>Customer:</strong> {selectedOrder.firstName} {selectedOrder.lastName}
                  </p>
                  <p>
                    <strong>Service:</strong> {selectedOrder.service.name}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                  </p>
                </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Accept Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to accept this order? This will mark the order as Pending.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 space-x-2">
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleConfirmAccept}>
                Accept
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default ServiceDashboard;
