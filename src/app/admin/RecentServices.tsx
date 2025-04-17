"use client";
interface User {
  id: string;
  walletBalance: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  referralCode: string;
  role: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  estimatedTime?: string;
  rating: number;
  includes?: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ServicePartner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  totalServicesCompleted: number;
  rating: number;
  pendingServices: number;
  createdAt: Date;
  updatedAt: Date;
  bio?: string;
  status: string;
  serviceAreas: string;
  serviceRequests: ServiceRequest[];
}

interface ServiceRequest {
  id: string;
  userId: string;
  serviceId: string;
  servicePartnerId?: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptedByProvider: boolean;
  acceptedAt?: Date;
  completedAt?: Date;
  cancellationReason?: string;
  cancelledAt?: Date;
  paymentStatus: string;
  paymentMethod: string;
  cartTotal: number;
  tax: number;
  shippingCost: number;
  orderTotal: number;
  walletBalance: number;
  walletAmountUsed: number;
  amountToPay: number;
  useWallet: boolean;
  houseNo: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: string;
  serviceDate: Date;
  serviceTime: string;
  createdAt: Date;
  updatedAt: Date;
  Review: Review[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  userId: string;
  serviceId: string;
  servicePartnerId?: string | null;
  user: User;
  service: Service;
  servicePartner?: ServicePartner | null;

  // Order details
  status: string;
  completionstatus: string;
  acceptedByProvider: boolean;
  acceptedAt?: Date | null;
  completedAt?: Date | null;
  cancellationReason?: string | null;
  cancelledAt?: Date | null;

  // Payment details
  paymentStatus: string;
  paymentMethod: string;
  cartTotal: number;
  tax: number;
  shippingCost: number;
  orderTotal: number;
  walletBalance: number;
  walletAmountUsed: number;
  amountToPay: number;
  useWallet: boolean;

  // Address details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  houseNo: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: string;
  serviceDate: Date; // ISO format Date
  serviceTime: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Optionally reviews associated with the order
  Review: Review[];
}

import React, { useState, useEffect } from "react";
import {
  Search,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Clock,
  CreditCard,
  Calendar,
  User,
  MapPin,
  Phone,
  ShoppingBag,
  AlertTriangle,
  Truck,
  Check,
  X,
  Mail,
  UserCheck,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/src/components/ui/dialog";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { getDashboardStats } from "@/src/actions/user";
import Loading from "@/src/app/loading";
import { getAllOrders } from "@/src/actions/admin";
import { FaIndianRupeeSign } from "react-icons/fa6";
type OrderStatus = "completed" | "cancelled" | "Accepted" | "pending";

const InfoRow = ({ label, value, icon, badge = false }: any) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-gray-600">{label}:</span>
    <div className="flex items-center gap-1 text-right">
      {icon && icon}
      {badge ? (
        <span
          className={`font-medium px-2 py-1 rounded-full text-xs ${
            value === "Paid"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
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
    <span className={`${highlight ? "text-green-600" : ""}`}>₹{value}</span>
  </div>
);
const RecentOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [ORDERS_DATA, setOrderData] = useState<Order[]>([]);
  const ordersPerPage = 10;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  useEffect(() => {
    const fetchAndProcessOrders = async () => {
      try {
        let filtered = ORDERS_DATA.filter((order) => {
          const searchTermLower = searchTerm.toLowerCase();
          const fullName = `${order.user?.firstName || ""} ${
            order.user?.lastName || ""
          }`.toLowerCase();
          const matchesSearchTerm =
            order.id.toLowerCase().includes(searchTermLower) ||
            fullName.includes(searchTermLower) || // Check combined full name
            order.service?.name?.toLowerCase().includes(searchTermLower); // Service name
          const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;
          return matchesSearchTerm && matchesStatus;
        });
        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to page 1 after new filtering or sorting
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchAndProcessOrders();
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getDashboardStats();
      setStats(result);
      const fetchedOrders = await getAllOrders(); // Fetch orders from API
      setOrderData(fetchedOrders);
      setFilteredOrders(fetchedOrders);
      setLoading(false);
    };

    fetchStats();
  }, []);

  // Pagination logic
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  const renderPagination = () => {
    const pages = [];
    const totalPagesToShow = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(totalPagesToShow / 2)
    );
    const endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

    // Previous button
    pages.push(
      <Button
        key="prev"
        variant="outline"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => setCurrentPage(i)}
          className="h-8 w-8 p-0"
        >
          {i}
        </Button>
      );
    }

    // Next button
    pages.push(
      <Button
        key="next"
        variant="outline"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return pages;
  };
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };
  // Status badge color mapping
  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: "green",
      Accepted: "blue",
      pending: "yellow",
      cancelled: "red",
    };

    const color = statusMap[status] || "gray";
    return (
      <Badge
        variant="default"
        className={`bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`}
      >
        {status}
      </Badge>
    );
  };

  // Handle cancel order
  const handleCancelOrder = (orderId: string) => {
    const updatedOrders = ORDERS_DATA.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: "cancelled" as OrderStatus,
            paymentStatus: "refunded",
          }
        : order
    );
    console.log(`Order ${orderId} has been cancelled`);
    setFilteredOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "cancelled" as OrderStatus,
              paymentStatus: "refunded",
            }
          : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: "cancelled",
        paymentStatus: "refunded",
      });
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Package className="mr-2 h-8 w-8 text-primary" />
          Recent Orders
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
          <ShoppingBag className="mr-1 h-4 w-4" />
          Total Orders:{" "}
          <span className="font-semibold ml-1">{stats.totalOrders}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs {stats?.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.revenueGrowth > 0 ? "+" : ""}
              {stats?.revenueGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Live updates from user bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cancelled Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.cancelledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cancelled by users or system
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search orders by ID, user, or service..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Filter by:
          </span>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as OrderStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px] rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg mb-6">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-blue-50 to-purple-50 dark:bg-gradient-to-r dark:from-blue-900 dark:to-purple-900 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3">
                User
              </th>
              <th scope="col" className="px-6 py-3">
                Service
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:bg-gradient-to-r dark:hover:from-blue-900 dark:hover:to-purple-900 transition-all"
              >
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {order.user.firstName} {order.user.lastName}
                </td>
                <td className="px-6 py-4">{order.service.name}</td>
                <td className="px-6 py-4">
                  {formatDate(order.createdAt.toLocaleDateString())}
                </td>
                <td className="px-6 py-4">Rs {order.amountToPay.toFixed(2)}</td>
                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all"
                      >
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Order Details
            </DialogTitle>
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
                    <h3 className="font-bold text-lg">
                      Order #ORD-{selectedOrder.id.slice(0, 8)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formatDate(selectedOrder.createdAt.toLocaleDateString())}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedOrder.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : selectedOrder.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : selectedOrder.status === "Accepted"
                      ? "bg-blue-100 text-blue-700"
                      : selectedOrder.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
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
                    <InfoRow
                      label="Order ID"
                      value={`ORD-${selectedOrder.id.slice(0, 8)}`}
                    />
                    <InfoRow
                      label="Date"
                      value={formatDate(
                        selectedOrder.createdAt.toLocaleDateString()
                      )}
                    />
                    <InfoRow
                      label="Service"
                      value={selectedOrder.service?.name}
                    />
                    <InfoRow
                      label="Estimated Time"
                      value={selectedOrder.service?.estimatedTime || "-"}
                    />
                    <InfoRow
                      label="Preferred Date"
                      value={formatDate(
                        selectedOrder.serviceDate.toLocaleDateString()
                      )}
                    />
                    <InfoRow
                      label="Preferred Time"
                      value={selectedOrder.serviceTime}
                    />
                    <InfoRow
                      label="Payment Method"
                      value={selectedOrder.paymentMethod}
                      icon={<CreditCard className="h-4 w-4 text-gray-500" />}
                    />
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
                    <InfoRow
                      label="Name"
                      value={`${selectedOrder.firstName} ${selectedOrder.lastName}`}
                      icon={<User className="h-4 w-4 text-gray-500" />}
                    />
                    <InfoRow
                      label="Phone"
                      value={selectedOrder.phone || "-"}
                      icon={<Phone className="h-4 w-4 text-gray-500" />}
                    />
                    <InfoRow
                      label="Email"
                      value={selectedOrder.email || "-"}
                      icon={<Mail className="h-4 w-4 text-gray-500" />}
                    />
                    <InfoRow
                      label="Address"
                      value={`${selectedOrder.houseNo}, ${selectedOrder.street}, ${selectedOrder.city}, ${selectedOrder.state} - ${selectedOrder.postalCode}, ${selectedOrder.country}`}
                      icon={<MapPin className="h-4 w-4 text-gray-500" />}
                    />
                  </div>
                </div>
              </div>
              {selectedOrder.servicePartner && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center mb-2">
                    <UserCheck className="h-5 w-5 text-gray-700 mr-2" />
                    <h3 className="font-bold text-md">
                      Service Partner Information
                    </h3>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {selectedOrder.servicePartner.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedOrder.servicePartner.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Email:</span>
                    <span className="truncate max-w-xs">
                      {selectedOrder.servicePartner.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Experience:</span>
                    <span>{selectedOrder.servicePartner.experience} years</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Completed Services:</span>
                    <span>
                      {selectedOrder.servicePartner.totalServicesCompleted}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <Star
                        className="h-4 w-4 text-yellow-500 mr-1"
                        fill="currentColor"
                      />
                      <span>{selectedOrder.servicePartner.rating}/5</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Order Summary */}
              <div>
                <h3 className="font-bold text-lg border-b pb-2 mt-6 flex items-center">
                  <FaIndianRupeeSign className="h-5 w-5 text-gray-700 mr-2" />
                  Order Summary
                </h3>
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-3">
                  <SummaryRow
                    label="Subtotal"
                    value={selectedOrder.cartTotal}
                  />
                  <SummaryRow label="Tax" value={selectedOrder.tax} />
                  <SummaryRow
                    label="Shipping"
                    value={selectedOrder.shippingCost}
                  />
                  {selectedOrder.useWallet && (
                    <SummaryRow
                      label="Wallet Used"
                      value={-selectedOrder.walletAmountUsed}
                      highlight
                    />
                  )}
                  <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-200">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg">
                      ₹{selectedOrder.amountToPay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2">{renderPagination()}</div>
      </div>
    </div>
  );
};

export default RecentOrdersPage;
