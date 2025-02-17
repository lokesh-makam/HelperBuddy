"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Eye, Search } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  city: string;
  service: string;
  serviceDetails: string;
  date: string;
  price: number;
  status: "pending" | "completed" | "cancelled";
}

const recentOrders: Order[] = [
  {
    id: "ORD-2024-001",
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, New York, NY 10001"
    },
    city: "New York",
    service: "House Cleaning",
    serviceDetails: "Complete house cleaning including kitchen, 3 bathrooms, 4 bedrooms, and living areas",
    date: "2024-02-16",
    price: 149.99,
    status: "pending"
  },
  {
    id: "ORD-2024-002",
    customer: {
      name: "Emma Wilson",
      email: "emma.w@example.com",
      phone: "(555) 234-5678",
      address: "456 Palm Ave, Los Angeles, CA 90001"
    },
    city: "Los Angeles",
    service: "Garden Maintenance",
    serviceDetails: "Full garden service including lawn mowing, hedge trimming, and flower bed maintenance",
    date: "2024-02-15",
    price: 89.99,
    status: "completed"
  },
  {
    id: "ORD-2024-003",
    customer: {
      name: "Michael Chen",
      email: "m.chen@example.com",
      phone: "(555) 345-6789",
      address: "789 Lake St, Chicago, IL 60601"
    },
    city: "Chicago",
    service: "Car Detailing",
    serviceDetails: "Premium car detailing service with interior and exterior cleaning",
    date: "2024-02-14",
    price: 199.99,
    status: "cancelled"
  },
  {
    id: "ORD-2024-004",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "(555) 456-7890",
      address: "321 Oak Rd, Houston, TX 77001"
    },
    city: "Houston",
    service: "Pest Control",
    serviceDetails: "Complete pest inspection and treatment for a 2-story house",
    date: "2024-02-16",
    price: 129.99,
    status: "pending"
  },
  {
    id: "ORD-2024-005",
    customer: {
      name: "David Brown",
      email: "david.b@example.com",
      phone: "(555) 567-8901",
      address: "654 Beach Blvd, Miami, FL 33101"
    },
    city: "Miami",
    service: "Pool Cleaning",
    serviceDetails: "Pool cleaning, chemical balance check, and filter maintenance",
    date: "2024-02-15",
    price: 79.99,
    status: "completed"
  }
];

export default function RecentOrders() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredOrders = recentOrders.filter((order) =>
    Object.values(order).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 md:bg-transparent">
      <div className="space-y-4 p-4">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Recent Orders
          </h1>
          
          {/* Search and Sort Controls */}
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4 w-full md:w-auto relative z-0">
            <div className="relative flex-grow md:flex-grow-0 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={sortOrder}
              onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-800">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
          <div className="overflow-x-auto">
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {sortedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                    </div>
                    <Badge
                      size="sm"
                      color={
                        order.status === "completed"
                          ? "success"
                          : order.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.customer.name}</p>
                    <p className="text-sm text-gray-500">{order.customer.email}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{order.service}</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${order.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-full"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className="font-medium">Order ID</TableCell>
                    <TableCell className="font-medium">Customer</TableCell>
                    <TableCell className="font-medium">City</TableCell>
                    <TableCell className="font-medium">Service</TableCell>
                    <TableCell className="font-medium">Date</TableCell>
                    <TableCell className="font-medium">Price</TableCell>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell className="font-medium">Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">{order.customer.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{order.customer.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {order.city}
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {order.service}
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {formatDate(order.date)}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white font-medium">
                    ${order.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      color={
                        order.status === "completed"
                          ? "success"
                          : order.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                  <button
                      onClick={() => handleViewDetails(order)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye size={20} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{selectedOrder.id}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Information</p>
                  <div className="mt-1 space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{selectedOrder.customer.email}</p>
                    <p className="text-gray-500 dark:text-gray-400">{selectedOrder.customer.phone}</p>
                  </div>
                </div>

                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedOrder.customer.address}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Service</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedOrder.service}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                  <p className="mt-1 text-gray-900 dark:text-white">${selectedOrder.price.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{formatDate(selectedOrder.date)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <div className="mt-1">
                    <Badge
                      size="sm"
                      color={
                        selectedOrder.status === "completed"
                          ? "success"
                          : selectedOrder.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>

                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Details</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedOrder.serviceDetails}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
        </div>
    </div>
    </div>
  );
}