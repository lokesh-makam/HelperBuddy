"use client";

import React, { useEffect, useState } from "react";
import {Eye, Check, Clock, User, Mail, Phone, MapPin, CreditCard, Package} from "lucide-react";
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
import Loading from "@/src/app/loading";
import { FaIndianRupeeSign } from "react-icons/fa6";
const InfoRow = ({ label, value, icon, badge = false }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}:</span>
      <div className="flex items-center gap-1 text-right">
        {icon && icon}
        {badge ? (
            <span
                className={`font-medium px-2 py-1 rounded-full text-xs ${
                    value === "Paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                }`}
            >
          {value}
        </span>
        ) : (
            <span className="font-medium">{value}</span>
        )}
      </div>
    </div>
);

const SummaryRow = ({ label, value, highlight = false }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}:</span>
      <span className={`${highlight ? "text-green-600" : ""}`}>
      ₹{value}
    </span>
    </div>
);

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
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
      // @ts-ignore
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

  if (isLoading) return <Loading/>;
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
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Order #ORD-{selectedOrder.id.slice(0, 8)}</h3>
                        <p className="text-gray-600 text-sm">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOrder.status === "completed" ? "bg-green-100 text-green-700" :
                            selectedOrder.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                selectedOrder.status === "Accepted" ? "bg-blue-100 text-blue-700" :
                                    selectedOrder.status === "cancelled" ? "bg-red-100 text-red-700" :
                                        "bg-gray-100 text-gray-700"
                    }`}>
                      {selectedOrder.status || "Processing"}
                    </div>
                  </div>

                  {/* Customer & Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Info */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <div className="flex items-center mb-4">
                        <Clock className="h-5 w-5 text-gray-700 mr-2" />
                        <h3 className="font-bold text-lg">Order Information</h3>
                      </div>
                      <div className="space-y-3">
                        <InfoRow label="Order ID" value={`ORD-${selectedOrder.id.slice(0, 8)}`} />
                        <InfoRow label="Date" value={formatDate(selectedOrder.createdAt)} />
                        <InfoRow label="Service" value={selectedOrder.service?.name} />
                        <InfoRow label="Estimated Time" value={selectedOrder.service?.estimatedTime || "-"} />
                        <InfoRow label="Preferred Date" value={formatDate(selectedOrder.serviceDate)}/>
                        <InfoRow label="Preferred Time" value={selectedOrder.serviceTime} />
                        <InfoRow label="Payment Method" value={selectedOrder.paymentMethod} icon={<CreditCard className="h-4 w-4 text-gray-500" />} />
                        <InfoRow
                            label="Payment Status"
                            value={selectedOrder.paymentStatus}
                            badge
                        />
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                      <div className="flex items-center mb-4">
                        <User className="h-5 w-5 text-gray-700 mr-2" />
                        <h3 className="font-bold text-lg">Customer Information</h3>
                      </div>
                      <div className="space-y-3">
                        <InfoRow label="Name" value={`${selectedOrder.firstName} ${selectedOrder.lastName}`} icon={<User className="h-4 w-4 text-gray-500" />} />
                        <InfoRow label="Phone" value={selectedOrder.phone || "-"} icon={<Phone className="h-4 w-4 text-gray-500" />} />
                        <InfoRow label="Email" value={selectedOrder.email || "-"} icon={<Mail className="h-4 w-4 text-gray-500" />} />
                        <InfoRow
                            label="Address"
                            value={`${selectedOrder.houseNo}, ${selectedOrder.street}, ${selectedOrder.city}, ${selectedOrder.state} - ${selectedOrder.postalCode}, ${selectedOrder.country}`}
                            icon={<MapPin className="h-4 w-4 text-gray-500" />}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-bold text-lg border-b pb-2 mt-6 flex items-center">
                      <FaIndianRupeeSign className="h-5 w-5 text-gray-700 mr-2" />
                      Order Summary
                    </h3>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-3">
                      <SummaryRow label="Subtotal" value={selectedOrder.cartTotal} />
                      <SummaryRow label="Tax" value={selectedOrder.tax} />
                      <SummaryRow label="Shipping" value={selectedOrder.shippingCost} />
                      {selectedOrder.useWallet && (
                          <SummaryRow label="Wallet Used" value={-selectedOrder.walletAmountUsed} highlight />
                      )}
                      <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-200">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="font-bold text-lg">₹{selectedOrder.amountToPay}</span>
                      </div>
                    </div>
                  </div>
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
