'use client';

import React, { useState, useEffect } from "react";
import { Trash2, Package, User, ShoppingCart, AlertCircle, Star } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { fetchOrders, cancelOrderServer } from "@/src/actions/user";
import Loading from "@/src/app/loading";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import {submitreview} from "@/src/actions/review";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancellationReason, setCancellationReason] = useState("");
    const [reasonError, setReasonError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [reviewError, setReviewError] = useState(false);
    const [rating, setRating] = useState(0); // New state for rating
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

    const confirmCancelOrder = (orderId: any) => {
        setSelectedOrder(orderId);
        setIsDialogOpen(true);
        setCancellationReason("");
        setReasonError(false);
    };

    const cancelOrder = async () => {
        if (!cancellationReason.trim()) {
            setReasonError(true);
            return;
        }
        if (!selectedOrder) return;
        const res = await cancelOrderServer(selectedOrder, cancellationReason);
        if (res.success) {
            setOrders((prevOrders: any) =>
                prevOrders.map((order: any) =>
                    order.id === selectedOrder
                        ? { ...order, status: "Cancelled", cancellationReason }
                        : order
                )
            );
        } else {
            toast.error(res.message);
        }
        setIsDialogOpen(false);
        setSelectedOrder(null);
        setCancellationReason("");
        setReasonError(false);
    };

    const handleReviewClick = (orderId: any) => {
        setSelectedOrder(orderId);
        setIsReviewDialogOpen(true);
        setReviewText("");
        setReviewError(false);
        setRating(0); // Reset rating when opening the dialog
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
        const res=await submitreview({ serviceRequestId: selectedOrder, rating:rating, review: reviewText });
        if(!res.success){
            toast.error(res.error);
            return;
        }
        console.log("Review submitted for order:", selectedOrder, "with text:", reviewText, "and rating:", rating);
        toast.success("Review submitted successfully!");
        setIsReviewDialogOpen(false);
        setSelectedOrder(null);
        setReviewText("");
        setRating(0);
    };

    const getStatusColor = (status: any) => {
        const colors = {
            pending: "bg-blue-100 text-blue-800",
            Accepted: "bg-green-100 text-yellow-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) return <Loading />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Order Management</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders?.map((order: any) => (
                    <Card key={order.id} className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {order.firstName} {order.lastName}
                            </CardTitle>
                            <Badge className={`${getStatusColor(order.status)} px-2 py-1 rounded-full`}>
                                {order.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="font-semibold">Service:</div>
                                    <div className="text-md font-bold">{order?.service?.name}</div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="font-semibold">Provider:</div>
                                    <div className="text-md font-bold">{order?.servicePartner?.fullName || "-"}</div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="font-semibold">Phone:</div>
                                    <div className="text-md font-bold">{order?.servicePartner?.phone || "-"}</div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="font-semibold">Total:</div>
                                    <div className="text-md font-bold">Rs {order?.service?.basePrice}</div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="font-semibold">Date:</div>
                                    <div className="text-md font-bold">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                {order.status !== "cancelled" && (
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => confirmCancelOrder(order.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Cancel Order
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => handleReviewClick(order.id)}
                                        >
                                            <Star className="mr-2 h-4 w-4" />
                                            Leave a Review
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Cancel Order Dialog */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please provide a reason for cancelling this order. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Label htmlFor="cancellation-reason">Cancellation Reason</Label>
                        <Textarea
                            id="cancellation-reason"
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder="Enter the reason for cancellation"
                            className={`resize-none h-32 ${reasonError ? "border-red-500" : ""}`}
                        />
                        {reasonError && (
                            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                Please provide a reason for cancellation
                            </div>
                        )}
                    </div>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Keep Order
                        </Button>
                        <Button onClick={cancelOrder} variant="destructive">
                            Cancel Order
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Review Dialog */}
            <AlertDialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Leave a Review</AlertDialogTitle>
                        <AlertDialogDescription>
                            Share your experience with this service. Your feedback is valuable!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        {/* Rating Section */}
                        <div className="mb-4">
                            <Label>Rating</Label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
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
                            className={`resize-none h-32 ${reviewError ? "border-red-500" : ""}`}
                        />
                        {reviewError && (
                            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                Please write a review before submitting.
                            </div>
                        )}
                    </div>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={submitReview}>
                            Submit Review
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default OrderManagement;