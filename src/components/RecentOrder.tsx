"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {Check, Clock, CreditCard, Eye, Mail, MapPin, Package, Phone, Search, User} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  Dialog,
  DialogContent, DialogFooter,
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
import {FaIndianRupeeSign} from "react-icons/fa6";
import {DialogDescription} from "@radix-ui/react-dialog";
import {Button} from "@/src/components/ui/button"
import {sendOtp, verifyOtpAndCompleteOrder} from "@/src/actions/user";
import {toast} from "react-toastify";

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

export default function RecentOrders({ partnerdetails }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [recentOrders, setOrders] = useState<any[]>([]);
  const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

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
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  if (loading) return <Loading />;
  const handleMarkAsCompleted = async (orderId: any) => {
    const order=recentOrders.filter((item)=>{
      return item.id===orderId;
    })
    setCurrentOrder(order[0]);
    setIsOtpDialogOpen(true);
    await sendOtp(order[0].id, order[0].user.email);
  };
  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      await sendOtp(currentOrder.id, currentOrder.user.email);
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };
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
                          <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleViewDetails(order)}
                                className="text-gray-600 hover:text-gray-900"
                                title="View Details"
                            >
                              <Eye size={20}/>
                            </button>

                            {order.completionstatus !== "completed" && (
                                <button
                                    onClick={() => {
                                      setSelectedOrderId(order.id);
                                      setIsCompleteConfirmOpen(true);
                                    }}
                                    className="text-green-600 hover:text-green-800 p-1 rounded-md border border-green-600"
                                    title="Mark as Completed"
                                >
                                  <Check size={18} />
                                </button>
                            )}
                          </div>

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
                        <InfoRow label="Preferred Date" value={formatDate(selectedOrder.serviceDate)} />
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
        <Dialog open={isCompleteConfirmOpen} onOpenChange={setIsCompleteConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Order Completed</DialogTitle>
              <DialogDescription>
                Are you sure you want to mark this order as completed?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 space-x-2">
              <Button onClick={() => setIsCompleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                  onClick={() => {
                    if (selectedOrderId) {
                      handleMarkAsCompleted(selectedOrderId);
                      setIsCompleteConfirmOpen(false);
                    }
                  }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Enter OTP</DialogTitle>
              <DialogDescription className="text-gray-500">
                Please enter the OTP sent to your email to confirm order completion.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <label htmlFor="otp-input" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                  id="otp-input"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
              />
            </div>
            <DialogFooter className="mt-6 flex justify-end gap-3">
              <Button
                  variant="outline"
                  onClick={() => setIsOtpDialogOpen(false)}
                  className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="px-4 py-2"
              >
                {isResending ? (
                    <div className="flex items-center">
                      <span className="mr-2">Resending</span>
                      <span className="inline-block h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                    </div>
                ) : (
                    "Resend OTP"
                )}
              </Button>

              <Button
                  disabled={isVerifying || !otp.trim()}
                  onClick={async () => {
                    try {
                      setIsVerifying(true);
                      if (currentOrder) {
                        await verifyOtpAndCompleteOrder(currentOrder.id, otp);
                        setOrders((prevOrders) =>
                            prevOrders.map((order) =>
                                order.id === currentOrder.id
                                    ? {
                                      ...order,
                                      completionstatus: "completed",
                                      status: "completed",
                                      completedAt: new Date().toISOString(), // optional
                                    }
                                    : order
                            )
                        );

                        setIsOtpDialogOpen(false);
                        setOtp("");
                        toast.success("Order marked as completed!");
                      }
                    } catch (error: any) {
                      toast.error(error.message || "Invalid OTP, please try again.");
                    } finally {
                      setIsVerifying(false);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
              >
                {isVerifying ? (
                    <div className="flex items-center">
                      <span className="mr-2">Verifying</span>
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    </div>
                ) : (
                    "Verify & Complete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
  );
}
