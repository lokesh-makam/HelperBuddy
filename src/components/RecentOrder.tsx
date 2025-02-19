"use client";
import React, { useEffect, useState } from "react";
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
import { useUser } from "@clerk/nextjs";
import Loading from "@/src/app/loading";
import { getAcceptedServiceRequests } from "@/src/actions/partner";

interface Order {
  address: any;
  city: React.ReactNode | undefined;
  phone: any;
  id: string;
  status: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    houseNo: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  service: {
    basePrice: React.ReactNode | undefined;
    name: string;
    price: number;
  };
  createdAt: string;
  completionstatus: string;
}

export default function RecentOrders({ partnerdetails }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [recentOrders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      getAcceptedServiceRequests(partnerdetails.id).then((orders) => {
        //@ts-ignore
        setOrders(orders || []);
        setLoading(false);
      });
    }
  }, [user, partnerdetails.id]);

  const filteredOrders = recentOrders.filter((order) =>
      [order.user.firstName, order.user.lastName, order.user.email, order.service.name]
          .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  if (loading) return <Loading />;

  return (
      <div className="h-full w-full bg-white dark:bg-gray-800 md:bg-transparent">
        <div className="space-y-4 p-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Recent Orders</h1>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full md:w-auto relative">
              <div className="relative flex-grow md:flex-grow-0 md:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                <SelectTrigger className="w-full md:w-[180px] dark:bg-gray-800">
                  <SelectValue placeholder="Sort by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="overflow-x-auto">
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
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.user.firstName} {order.user.lastName}</span>
                            <span className="text-sm text-gray-500">{order.user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{order.city}</TableCell>
                        <TableCell>{order.service.name}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>Rs{order.service.basePrice}</TableCell>
                        <TableCell>
                          <Badge color={order.completionstatus === "completed" ? "success" : order.completionstatus === "pending" ? "warning" : "error"}>
                            {order.completionstatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button onClick={() => handleViewDetails(order)} className="text-gray-600 hover:text-gray-900">
                            <Eye size={20} />
                          </button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
                <div className="space-y-6">
                  <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                  <p><strong>Customer:</strong> {selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
                  <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                  <p><strong>Service:</strong> {selectedOrder.service.name}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.address},{selectedOrder.city}</p>
                  <p><strong>Status:</strong> {selectedOrder.completionstatus}</p>
                  <p><strong>Price:</strong> ${selectedOrder.service.basePrice}</p>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}
