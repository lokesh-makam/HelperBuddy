"use client"
import React, { useState } from "react";
import { Trash2, Package, User, ShoppingCart, AlertCircle } from "lucide-react";
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

const OrderManagement = () => {
    const [orders, setOrders] = useState([
        {
            id: 1,
            customerName: "John Doe",
            items: [
                { product: "Laptop", quantity: 1, price: 1200 },
                { product: "Mouse", quantity: 2, price: 40 },
            ],
            total: 1280,
            status: "Processing",
            cancellationReason: null,
        },
        {
            id: 2,
            customerName: "Alice Smith",
            items: [{ product: "Smartphone", quantity: 1, price: 900 }],
            total: 900,
            status: "Shipped",
            cancellationReason: null,
        },
        {
            id: 3,
            customerName: "Alice Smith",
            items: [{ product: "Smartphone", quantity: 1, price: 900 }],
            total: 900,
            status: "Shipped",
            cancellationReason: null,
        },
        {
            id: 4,
            customerName: "Alice Smith",
            items: [{ product: "Smartphone", quantity: 1, price: 900 }],
            total: 900,
            status: "Shipped",
            cancellationReason: null,
        },
        {
            id: 5,
            customerName: "Alice Smith",
            items: [{ product: "Smartphone", quantity: 1, price: 900 }],
            total: 900,
            status: "Shipped",
            cancellationReason: null,
        },
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancellationReason, setCancellationReason] = useState("");
    const [reasonError, setReasonError] = useState(false);

    const confirmCancelOrder = (orderId:any) => {
        setSelectedOrder(orderId);
        setIsDialogOpen(true);
        setCancellationReason("");
        setReasonError(false);
    };

    const cancelOrder = () => {
        if (!cancellationReason.trim()) {
            setReasonError(true);
            return;
        }

        setOrders((prevOrders):any =>
            prevOrders.map((order) =>
                order.id === selectedOrder
                    ? {
                        ...order,
                        status: "Cancelled",
                        cancellationReason: cancellationReason.trim(),
                    }
                    : order
            )
        );
        setIsDialogOpen(false);
        setSelectedOrder(null);
        setCancellationReason("");
        setReasonError(false);
    };

    const getStatusColor = (status:any) => {
        const colors = {
            Processing: "bg-blue-100 text-blue-800",
            Shipped: "bg-green-100 text-green-800",
            Cancelled: "bg-red-100 text-red-800",
        };
        // @ts-ignore
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Order Management</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <Card key={order.id} className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {order.customerName}
                            </CardTitle>
                            <Badge
                                className={`${getStatusColor(order.status)} px-2 py-1 rounded-full`}
                            >
                                {order.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="mt-4">
                                    <div className="text-sm text-gray-500 mb-2">Order Items:</div>
                                    <ul className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-gray-500" />
                                                    <span>{item.product}</span>
                                                </div>
                                                <div className="text-sm">
                                                    {item.quantity} x ${item.price}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="font-semibold">Total:</div>
                                    <div className="text-lg font-bold">${order.total}</div>
                                </div>
                                {order.status === "Cancelled" && (
                                    <div className="mt-2 p-3 bg-red-50 rounded-md">
                                        <div className="text-sm font-medium text-red-800 mb-1">
                                            Cancellation Reason:
                                        </div>
                                        <div className="text-sm text-red-600 break-words max-h-24 overflow-y-auto">
                                            {order.cancellationReason}
                                        </div>
                                    </div>
                                )}
                                {order.status !== "Cancelled" && (
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => confirmCancelOrder(order.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Cancel Order
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please provide a reason for cancelling this order. This action cannot
                            be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Label htmlFor="cancellation-reason">Cancellation Reason</Label>
                        <Textarea
                            id="cancellation-reason"
                            value={cancellationReason}
                            onChange={(e) => {
                                setCancellationReason(e.target.value);
                                setReasonError(false);
                            }}
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
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setReasonError(false);
                            }}
                        >
                            Keep Order
                        </Button>
                        <Button onClick={cancelOrder} variant="destructive">
                            Cancel Order
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default OrderManagement;