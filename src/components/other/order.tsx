"use client";

import React, {useState, useEffect, useRef} from "react";
import {
    Package,
    User,
    ShoppingCart,
    AlertCircle,
    Star,
    Clock,
    CheckCircle,
    X,
    CreditCard,
    Phone,
    Mail,
    MapPin, DollarSign, Download, Printer, UserCheck,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import Loading from "@/src/app/loading";
import { toast } from "react-toastify";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/components/ui/tabs";
import {useUser} from "@clerk/nextjs";
import {cancelOrderServer, fetchOrders} from "@/src/actions/user";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {FaIndianRupeeSign} from "react-icons/fa6";
import {submitreview} from "@/src/actions/review";
export interface Order {
    id: string;
    userId: string;
    serviceId: string;
    servicePartnerId?: string | null;

    status: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    acceptedByProvider: boolean;
    acceptedAt?: string | null;
    completedAt?: string | null;
    completionstatus: string;

    paymentStatus: string;
    paymentMethod: string;

    cancellationReason?: string | null;
    cancelledAt?: string | null;

    createdAt: string;
    updatedAt: string;

    houseNo: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: string;

    serviceDate: string;
    serviceTime: string;

    cartTotal: number;
    tax: number;
    shippingCost: number;
    orderTotal: number;
    walletBalance: number;
    walletAmountUsed: number;
    amountToPay: number;
    useWallet: boolean;

    user?: User;
    service?: Service;
    servicePartner?: ServicePartner;
    Review?: Review[];
}
interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    // Add other fields if you need them
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
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

interface ServicePartner {
    id: string;
    userId: string;
    experience: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    totalServicesCompleted: number;
    rating: number;
    pendingServices: number;
    createdAt: string;
    updatedAt: string;
    bio?: string;
    status: string;
    upi?: string;
    serviceAreas: string;
    idCard?: string;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    // Add related order or user fields if needed
}


const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [cancellationReason, setCancellationReason] = useState("");
    const [reasonError, setReasonError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState("");
    const [reviewError, setReviewError] = useState(false);
    const [rating, setRating] = useState(0);
    const [activeTab, setActiveTab] = useState("details");
    const { user } = useUser();
    useEffect(() => {
        if (user) {
            fetchOrders(user.id).then((data: any) => {
                console.log(data);
                setOrders(data);
                setLoading(false);
            });
        }
    }, [user]);
    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsDialogOpen(true);
        setCancellationReason("");
        setReviewText("");
        setRating(0);
        setReasonError(false);
        setReviewError(false);
        setActiveTab("details");
    };

    const cancelOrder = async () => {
        if (!cancellationReason.trim()) {
            setReasonError(true);
            return;
        }
        if (!selectedOrder) return;
        const res = await cancelOrderServer(selectedOrder.id, cancellationReason);
        if (res.success) {
            setOrders((prevOrders: any) =>
                prevOrders.map((order: any) =>
                    order.id === selectedOrder.id
                        ? { ...order, status: "Cancelled", cancellationReason }
                        : order
                )
            );
            toast.success("Order cancelled successfully!");
        } else {
            toast.error("Something went wrong");
        }
        setSelectedOrder(null);
        setIsDetailsDialogOpen(false);
        setCancellationReason("");
        setReasonError(false);
    };
    const submitReview =async () => {
        if (!reviewText.trim()) {
            setReviewError(true);
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating before submitting.");
            return;
        }
        if(!selectedOrder) return;
        const res=await submitreview({ serviceRequestId: selectedOrder.id, rating:rating, review: reviewText });
        if(!res.success){
            toast.error(res.error);
            return;
        }
        console.log("Review submitted for order:", selectedOrder, "with text:", reviewText, "and rating:", rating);
        toast.success("Review submitted successfully!");
        // setSelectedOrder(null);
        setReviewText("");
        setRating(0);
    };
    // Utility to get status color classes
    const getStatusColor = (status: string) => {
        const normalizedStatus = status.toLowerCase();

        switch (normalizedStatus) {
            case "completed":
                return "bg-green-500 text-white";
            case "cancelled":
                return "bg-red-500 text-white";
            case "pending":
                return "bg-yellow-500 text-white";
            case "Accepted":
                return "bg-blue-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

// Timeline step interface
    interface TimelineStep {
        status: string;
        completed: boolean;
        date: string | null;
        reason?: string;
    }

// Main timeline generator
    const getOrderTimeline = (order: any | null): TimelineStep[] => {
        if (!order) return [];

        const status = order.status.toLowerCase();
        const createdDate = new Date(order.createdAt).toLocaleDateString();
        const acceptedDate = order.acceptedAt ? new Date(order.acceptedAt).toLocaleDateString() : null;
        const completedDate = order.completedAt ? new Date(order.completedAt).toLocaleDateString() : null;
        const cancelledDate = order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString() : null;

        // Handle cancellation scenario early
        if (status === "cancelled") {
            return [
                {
                    status: "Order Received",
                    completed: true,
                    date: createdDate,
                },
                {
                    status: "Order Cancelled",
                    completed: true,
                    date: cancelledDate || "Cancelled",
                    reason: order.cancellationReason || undefined,
                },
            ];
        }

        return [
            {
                status: "Order Received",
                completed: true,
                date: createdDate,
            },
            {
                status: "Partner Assigned",
                completed: !!order.servicePartnerId,
                date: order.servicePartnerId ? createdDate : null, // Or use updatedAt if assignment date differs
            },
            {
                status: "In Progress",
                completed: ["accepted", "completed"].includes(status),
                date: ["accepted", "completed"].includes(status) ? (acceptedDate || "In Progress") : null,
            },
            {
                status: "Service Completed",
                completed: status === "completed",
                date: status === "completed" ? completedDate || "Completed" : null,
            },
        ];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return (
            date.toLocaleDateString() +
            ", " +
            date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
    };
    const printRef = useRef(null);


    // Download PDF handler
    const handleDownload = async () => {
        const element = printRef.current;
        if(!element) return;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("order-details.pdf");
    };
    if (loading) return <Loading />;

    // @ts-ignore
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Order Management</h1>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No orders found
                    </h3>
                    <p className="mt-1 text-gray-500">
                        You haven't placed any orders yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <Card
                            key={order.id}
                            className="w-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-gray-600 text-sm font-normal">
                    ORD-
                  </span>
                                    {order.id.slice(0, 8)}
                                </CardTitle>
                                <Badge
                                    className={`${getStatusColor(
                                        order.status
                                    )} px-3 py-1 rounded-full`}
                                >
                                    {order.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="font-semibold flex items-center gap-1">
                                            <Package className="h-4 w-4" />
                                            Service:
                                        </div>
                                        <div className="text-md font-bold">
                                            {order?.service?.name}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <div className="font-semibold">Customer:</div>
                                        <div className="text-md">
                                            {order.firstName} {order.lastName}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <div className="font-semibold">Date:</div>
                                        <div className="text-md">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <div className="font-semibold">Total:</div>
                                        <div className="flex gap-2">
                                            {order.orderTotal !== order.amountToPay && (
                                                <span className="text-md line-through text-gray-500">
                          ₹{order.orderTotal}
                        </span>
                                            )}
                                            <span className="text-md font-bold">
                        ₹{order.amountToPay}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4 border-t border-gray-200">
                                <Button
                                    className="w-full bg-gray-900 text-white hover:bg-gray-700"
                                    onClick={() => handleViewDetails(order)}
                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Order Details Dialog */}
            <AlertDialog
                open={isDetailsDialogOpen}
                onOpenChange={setIsDetailsDialogOpen}
            >
                <AlertDialogContent className="border border-gray-300 bg-white max-w-3xl max-h-[90vh] overflow-hidden">
                    {selectedOrder && (
                        <>
                            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <Package className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                                            Order Details - ORD-{selectedOrder.id.slice(0, 8)}
                                        </AlertDialogTitle>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(selectedOrder.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    className={`${getStatusColor(
                                        selectedOrder.status
                                    )} px-3 py-1 rounded-full`}
                                >
                                    {selectedOrder.status}
                                </Badge>
                            </div>

                            <div
                                className="overflow-y-auto pr-2"
                                style={{ maxHeight: "calc(90vh - 200px)" }}
                            >
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid grid-cols-4 mb-4">
                                        <TabsTrigger value="details">Details</TabsTrigger>
                                        <TabsTrigger value="timeline">Track Order</TabsTrigger>
                                        {selectedOrder.status.toLowerCase() !== "cancelled" && (
                                            <>
                                                <TabsTrigger value="cancel">Cancel</TabsTrigger>
                                                <TabsTrigger value="review">Review</TabsTrigger>
                                            </>
                                        )}
                                    </TabsList>

                                    <TabsContent value="details" className="space-y-8 pt-4">
                                        <div ref={printRef}>
                                            {/* Order Status Banner */}
                                            <div
                                                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                        <Package className="h-6 w-6 text-blue-600"/>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">Order
                                                            #ORD-{selectedOrder.id.slice(0, 8)}</h3>
                                                        <p className="text-gray-600 text-sm">{formatDate(selectedOrder.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        selectedOrder.status === "completed" ? "bg-green-100 text-green-700" :
                                                            selectedOrder.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                                selectedOrder.status === "accepted" ? "bg-blue-100 text-blue-700" :
                                                                    selectedOrder.status === "cancelled" ? "bg-red-100 text-red-700" :
                                                                        "bg-gray-100 text-gray-700"
                                                    }`}>
                                                        {selectedOrder.status || "Processing"}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Order Information */}
                                                <div
                                                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                                                    <div className="flex items-center mb-4">
                                                        <Clock className="h-5 w-5 text-gray-700 mr-2"/>
                                                        <h3 className="font-bold text-lg">Order Information</h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Order ID:</span>
                                                            <span
                                                                className="font-medium">ORD-{selectedOrder.id.slice(0, 8)}</span>
                                                        </div>
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Date:</span>
                                                            <span>{formatDate(selectedOrder.createdAt)}</span>
                                                        </div>
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Service:</span>
                                                            <span
                                                                className="font-medium">{selectedOrder.service?.name}</span>
                                                        </div>
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Estimated Time:</span>
                                                            <span>{selectedOrder.service?.estimatedTime || "-"}</span>
                                                        </div>
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Preferred Date:</span>
                                                            <span
                                                                className="font-medium">{formatDate(selectedOrder.serviceDate)}</span>
                                                        </div>
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Preferred Time:</span>
                                                            <span
                                                                className="font-medium">{selectedOrder.serviceTime}</span>
                                                        </div>
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Payment Method:</span>
                                                            <div className="flex items-center gap-1">
                                                                <CreditCard className="h-4 w-4 text-gray-500"/>
                                                                <span>{selectedOrder.paymentMethod}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center py-2">
                                                            <span className="text-gray-600">Payment Status:</span>
                                                            <span
                                                                className={`font-medium px-2 py-1 rounded-full text-xs ${selectedOrder.paymentStatus === "Paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
            {selectedOrder.paymentStatus}
          </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Customer Info */}
                                                <div
                                                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                                                    <div className="flex items-center mb-4">
                                                        <User className="h-5 w-5 text-gray-700 mr-2"/>
                                                        <h3 className="font-bold text-lg">Customer Information</h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Name:</span>
                                                            <div className="flex items-center gap-1">
                                                                <User className="h-4 w-4 text-gray-500"/>
                                                                <span>{selectedOrder.firstName} {selectedOrder.lastName}</span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Phone:</span>
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="h-4 w-4 text-gray-500"/>
                                                                <span>{selectedOrder.phone || "-"}</span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Email:</span>
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="h-4 w-4 text-gray-500"/>
                                                                <span>{selectedOrder.email || "-"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-start py-2">
                                                            <span className="text-gray-600">Address:</span>
                                                            <div className="flex items-start gap-1 text-right max-w-xs">
                                                                <MapPin
                                                                    className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0"/>
                                                                <span>
              {selectedOrder.houseNo}, {selectedOrder.street}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postalCode}, {selectedOrder.country}
            </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {selectedOrder.servicePartner && (
                                                        <div className="space-y-3 pt-4 mt-4 border-t border-gray-200">
                                                            <div className="flex items-center mb-2">
                                                                <UserCheck className="h-5 w-5 text-gray-700 mr-2"/>
                                                                <h3 className="font-bold text-md">Service Partner
                                                                    Information</h3>
                                                            </div>
                                                            <div
                                                                className="flex justify-between items-center py-2 border-b border-gray-100">
                                                                <span className="text-gray-600">Name:</span>
                                                                <span
                                                                    className="font-medium">{selectedOrder.servicePartner.fullName}</span>
                                                            </div>
                                                            <div
                                                                className="flex justify-between items-center py-2 border-b border-gray-100">
                                                                <span className="text-gray-600">Phone:</span>
                                                                <span>{selectedOrder.servicePartner.phone}</span>
                                                            </div>
                                                            <div
                                                                className="flex justify-between items-center py-2 border-b border-gray-100">
                                                                <span className="text-gray-600">Email:</span>
                                                                <span
                                                                    className="truncate max-w-xs">{selectedOrder.servicePartner.email}</span>
                                                            </div>
                                                            <div
                                                                className="flex justify-between items-center py-2 border-b border-gray-100">
                                                                <span className="text-gray-600">Experience:</span>
                                                                <span>{selectedOrder.servicePartner.experience} years</span>
                                                            </div>
                                                            <div
                                                                className="flex justify-between items-center py-2 border-b border-gray-100">
                                                                <span
                                                                    className="text-gray-600">Completed Services:</span>
                                                                <span>{selectedOrder.servicePartner.totalServicesCompleted}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-2">
                                                                <span className="text-gray-600">Rating:</span>
                                                                <div className="flex items-center">
                                                                    <Star className="h-4 w-4 text-yellow-500 mr-1"
                                                                          fill="currentColor"/>
                                                                    <span>{selectedOrder.servicePartner.rating}/5</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Items & Summary */}
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-lg border-b pb-2 mt-6 flex items-center">
                                                    <FaIndianRupeeSign className="h-5 w-5 text-gray-700 mr-2"/>
                                                    Order Summary
                                                </h3>
                                                <div
                                                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-3">
                                                    <div
                                                        className="flex justify-between items-center py-2 border-b border-gray-100">
                                                        <span className="text-gray-600">Subtotal:</span>
                                                        <span>₹{selectedOrder.cartTotal}</span>
                                                    </div>
                                                    <div
                                                        className="flex justify-between items-center py-2 border-b border-gray-100">
                                                        <span className="text-gray-600">Tax:</span>
                                                        <span>₹{selectedOrder.tax}</span>
                                                    </div>
                                                    <div
                                                        className="flex justify-between items-center py-2 border-b border-gray-100">
                                                        <span className="text-gray-600">Shipping:</span>
                                                        <span>₹{selectedOrder.shippingCost}</span>
                                                    </div>
                                                    {selectedOrder.useWallet && (
                                                        <div
                                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">Wallet Used:</span>
                                                            <span
                                                                className="text-green-600">-₹{selectedOrder.walletAmountUsed}</span>
                                                        </div>
                                                    )}
                                                    <div
                                                        className="flex justify-between items-center pt-3 mt-1 border-t border-gray-200">
                                                        <span className="font-bold text-lg">Total:</span>
                                                        <span
                                                            className="font-bold text-lg">₹{selectedOrder.amountToPay}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Action buttons */}
                                        <div className="flex flex-wrap gap-3 justify-end mb-4">
                                            <Button variant="outline" size="sm" className="flex items-center"
                                                    onClick={handleDownload}>
                                                <Download className="h-4 w-4 mr-1"/> Download PDF
                                            </Button>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="timeline" className="space-y-4 pt-2">
                                        <h3 className="font-bold text-lg">Order Timeline</h3>
                                        <div className="space-y-6 py-4">
                                            {getOrderTimeline(selectedOrder).map(
                                                (step, index, array) => (
                                                    <div key={index} className="flex items-start">
                                                        <div className="flex flex-col items-center mr-4">
                                                            <div
                                                                className={`rounded-full p-2 ${
                                                                    step.completed
                                                                        ? "bg-green-500"
                                                                        : "bg-gray-200"
                                                                } text-white`}
                                                            >
                                                                {step.completed ? (
                                                                    <CheckCircle className="h-5 w-5" />
                                                                ) : (
                                                                    <Clock className="h-5 w-5 text-gray-500" />
                                                                )}
                                                            </div>
                                                            {index < array.length - 1 && (
                                                                <div
                                                                    className={`h-12 w-0.5 ${
                                                                        step.completed
                                                                            ? "bg-green-500"
                                                                            : "bg-gray-200"
                                                                    }`}
                                                                ></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3
                                                                className={`font-bold ${
                                                                    step.completed
                                                                        ? "text-black"
                                                                        : "text-gray-500"
                                                                }`}
                                                            >
                                                                {step.status}
                                                            </h3>
                                                            {step.date && (
                                                                <p
                                                                    className={`text-sm ${
                                                                        step.completed
                                                                            ? "text-gray-700"
                                                                            : "text-gray-400"
                                                                    }`}
                                                                >
                                                                    {step.date}
                                                                </p>
                                                            )}
                                                            {step.reason && (
                                                                <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded border border-gray-200">
                                                                    Reason: {step.reason}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </TabsContent>

                                    {selectedOrder.status.toLowerCase() !== "cancelled" && (
                                        <>
                                            <TabsContent value="cancel" className="space-y-4 pt-2">
                                                <h3 className="font-bold text-lg">Cancel Order</h3>
                                                <AlertDialogDescription>
                                                Please provide a reason for cancelling this order.
                                                    This action cannot be undone.
                                                </AlertDialogDescription>
                                                <div className="py-4">
                                                    <Label htmlFor="cancellation-reason">
                                                        Cancellation Reason
                                                    </Label>
                                                    <Textarea
                                                        id="cancellation-reason"
                                                        value={cancellationReason}
                                                        onChange={(e) =>
                                                            setCancellationReason(e.target.value)
                                                        }
                                                        placeholder="Enter the reason for cancellation"
                                                        className={`resize-none h-32 ${
                                                            reasonError ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    />
                                                    {reasonError && (
                                                        <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                                            <AlertCircle className="h-4 w-4" />
                                                            Please provide a reason for cancellation
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setActiveTab("details")}
                                                        className="bg-white hover:bg-gray-100 border-gray-300"
                                                    >
                                                        Go Back
                                                    </Button>
                                                    <Button
                                                        onClick={cancelOrder}
                                                        variant="destructive"
                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                    >
                                                        Cancel Order
                                                    </Button>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="review" className="space-y-4 pt-2">
                                                <h3 className="font-bold text-lg">Leave a Review</h3>
                                                <AlertDialogDescription>
                                                    Share your experience with this service. Your feedback
                                                    is valuable!
                                                </AlertDialogDescription>
                                                <div className="py-4">
                                                    {/* Rating Section */}
                                                    <div className="mb-4">
                                                        <Label>Rating</Label>
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    onClick={() => setRating(star)}
                                                                    className={`text-2xl ${
                                                                        star <= rating
                                                                            ? "text-yellow-500"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                >
                                                                    ★
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Review Text Section */}
                                                    <Label htmlFor="review-text">Your Review</Label>
                                                    <Textarea
                                                        id="review-text"
                                                        value={reviewText}
                                                        onChange={(e) => setReviewText(e.target.value)}
                                                        placeholder="Write your review here..."
                                                        className={`resize-none h-32 ${
                                                            reviewError ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                    />
                                                    {reviewError && (
                                                        <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                                            <AlertCircle className="h-4 w-4" />
                                                            Please write a review before submitting.
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setActiveTab("details")}
                                                        className="bg-white hover:bg-gray-100 border-gray-300"
                                                    >
                                                        Go Back
                                                    </Button>
                                                    <Button
                                                        onClick={submitReview}
                                                        className="bg-green-600 text-white hover:bg-green-700"
                                                    >
                                                        Submit Review
                                                    </Button>
                                                </div>
                                            </TabsContent>
                                        </>
                                    )}
                                </Tabs>
                            </div>

                            <AlertDialogFooter className="border-t pt-4">
                                <Button
                                    onClick={() => setIsDetailsDialogOpen(false)}
                                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Close
                                </Button>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default OrderManagement;
