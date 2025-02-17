"use client"
import React, { useState } from 'react';
import { Eye, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/src/components/ui/dialog';
import Button  from '@/src/components/ui/Button';

const ServiceDashboard = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmAction, setConfirmAction] = useState({ type: '', orderId: null });

  // Sample data - replace with your backend data later
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "John Smith",
      service: "Home Cleaning",
      date: "2025-02-16",
      price: 149.99,
      address: "123 Main St, City, State",
      email: "john@example.com",
      phone: "(555) 123-4567",
      serviceDetails: "Deep cleaning of 3 bedroom house",
      status: "new"  // Changed initial status to "new"
    },
    {
      id: 2,
      customerName: "Emma Wilson",
      service: "Car Wash",
      date: "2025-02-17",
      price: 49.99,
      address: "456 Oak Ave, City, State",
      email: "emma@example.com",
      phone: "(555) 987-6543",
      serviceDetails: "Premium exterior and interior cleaning",
      status: "new"
    },
    {
      id: 3,
      customerName: "Michael Brown",
      service: "Lawn Care",
      date: "2025-02-18",
      price: 89.99,
      address: "789 Pine Rd, City, State",
      email: "michael@example.com",
      phone: "(555) 246-8135",
      serviceDetails: "Lawn mowing and edge trimming",
      status: "new"
    },
  ]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const openConfirmDialog = (type, orderId) => {
    setConfirmAction({ type, orderId });
    setIsConfirmOpen(true);
  };

  const handleAccept = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'pending' }  // Changed to set status to "pending"
        : order
    ));
    setIsConfirmOpen(false);
  };

  const handleDecline = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'declined' }
        : order
    ));
    setIsConfirmOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Service Orders</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${order.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-6">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye size={20} />
                    </button>
                    {order.status === 'new' && (  // Changed condition to check for 'new' status
                      <>
                        <button
                          onClick={() => openConfirmDialog('accept', order.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => openConfirmDialog('decline', order.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X size={20} />
                        </button>
                      </>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Name</p>
                  <p className="mt-1">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Service</p>
                  <p className="mt-1">{selectedOrder.service}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="mt-1">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="mt-1">${selectedOrder.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 capitalize">{selectedOrder.status}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1">{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-1">{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Service Details</p>
                  <p className="mt-1">{selectedOrder.serviceDetails}</p>
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
            <DialogTitle>
              {confirmAction.type === 'accept' ? 'Accept Order' : 'Decline Order'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction.type === 'accept' 
                ? 'Are you sure you want to accept this order? This will mark the order as pending.'
                : 'Are you sure you want to decline this order? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction.type === 'accept' ? 'default' : 'destructive'}
              onClick={() => {
                if (confirmAction.type === 'accept') {
                  handleAccept(confirmAction.orderId);
                } else {
                  handleDecline(confirmAction.orderId);
                }
              }}
            >
              {confirmAction.type === 'accept' ? 'Accept' : 'Decline'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDashboard;