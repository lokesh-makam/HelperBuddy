"use server";
import {db} from "@/src/lib/db";
import crypto from "crypto";
import {sendMail} from "@/src/lib/mail";
import {sendOrderUpdateEmail} from "@/src/actions/partner";
export async function saveUserToDatabase(props: any) {
    try {
        const existingUser = await db.user.findUnique({
            where: { email:props.email },
        });
        if(existingUser) return { success: false, existingUser };

        const user = await db.user.create({
            data: {
                id:props.id,
                email: props.email,
                firstName: props.firstname,
                lastName: props.lastname,
            },
        });
        return { success: true, user };
    } catch (error) {
        console.error("Error saving user:", error);
        return { success: false, error: "Failed to save user." };
    }
}
// src/actions/orderActions.js
export async function fetchOrders(userId:any) {
    try {
        const orders = await db.serviceRequest.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                user: true, // Include user details
                service: true, // Include service details
                servicePartner: true,
            },
        });
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders.");
    }
}

export async function cancelOrderServer(orderId: string,reason: string) {
    try {
        const order = await db.serviceRequest.findUnique({ where: { id: orderId } });
        if (!order) {
            throw new Error("Order not found");
        }
        if(order.status==="cancelled") return { success: false, message: "You cannot cancel an order that has already been cancelled." };
        if(order.status==="Accepted") return { success: false, message: "You cannot cancel an order that has already been accepted." };
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        // Users can cancel **only if** more than 2 hours have passed
        if (order.createdAt >= twoHoursAgo) {
            return { success: false, message: "You can cancel an order only after 2 hours." };
        }

        // If a provider has accepted, cancellation is not allowed
        if (order.acceptedByProvider) {
            return { success: false, message: "You cannot cancel an order that has already been accepted by a service provider." };
        }

        await db.serviceRequest.update({
            where: { id: orderId },
            data: { status: "cancelled", cancellationReason: reason ,cancelledAt: new Date()},
        });

        return { success: true, message: "Order cancelled successfully." };
    } catch (error) {
        console.error("Error cancelling order:", error);
        return { success: false, message: error || "Something went wrong" };
    }
}
export async function getuser(email:string){
    console.log(email)
    const res=await db.user.findUnique({where: {email}});
    console.log(res)
    return res;
}

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export async function sendOtp(orderId: string, email: string) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 20 * 60 * 1000; // 5 minutes
    otpStore.set(orderId, { otp, expiresAt });

    const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Your OTP Code</h2>
      <p>Here is your one-time password (OTP) to confirm your order completion:</p>
      <h3 style="color: #4CAF50; font-size: 24px;">${otp}</h3>
      <p>This code will expire in 5 minutes.</p>
      <br/>
      <p>— Helper Buddy Team</p>
    </div>
  `;

    await sendMail(email, "Helper Buddy - Confirm Your Order", html);
}
export async function verifyOtpAndCompleteOrder(orderId: string, enteredOtp: string) {
    const record = otpStore.get(orderId);
    if (!record) {
        throw new Error("OTP Expired. Please request a new one.");
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(orderId);
        throw new Error("OTP has expired. Please request a new one.");
    }

    if (record.otp !== enteredOtp) {
        throw new Error("Invalid OTP. Please try again.");
    }

    await db.serviceRequest.update({
        where: { id: orderId },
        data: {
            completionstatus: "completed",
            status: "completed",
            completedAt: new Date(), // ✅ Use Date object
        },
    });
    const existingOrder = await db.serviceRequest.findUnique({
        where: { id: orderId },
        include: {
            user: true,
            servicePartner: true,
            service: true, // If you also want service details
        },
    });
    // Send email notification to the user
    if (existingOrder?.user?.email) {
        await sendOrderUpdateEmail(existingOrder.user.email, existingOrder.status, existingOrder, existingOrder.servicePartner);
    }

    otpStore.delete(orderId);
}
export const getDashboardStats = async () => {
    const allOrders = await db.serviceRequest.findMany({
        select: {
            status: true,
            orderTotal: true,
            createdAt: true,
        },
    });

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.orderTotal, 0);

    const completedOrders = allOrders.filter(o => o.status === 'completed');
    const cancelledOrders = allOrders.filter(o => o.status === 'cancelled');
    const pendingOrders = allOrders.filter(o =>
        ['pending', 'accepted'].includes(o.status)
    );

    const lastMonthRevenue = allOrders
        .filter(o => o.createdAt >= lastMonth && o.createdAt < thisMonth)
        .reduce((sum, o) => sum + o.orderTotal, 0);

    const revenueGrowth = lastMonthRevenue
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : totalRevenue > 0
            ? 100
            : 0;

    return {
        totalOrders,
        totalRevenue,
        completedCount: completedOrders.length,
        cancelledCount: cancelledOrders.length,
        pendingCount: pendingOrders.length,
        revenueGrowth,
    };
};


export async function getStats() {
    const [trustedPartners, happyCustomers, serviceTypes, servicesDelivered] = await Promise.all([
        db.servicePartner.count({
            where: { status: "approved" },
        }),
        db.user.count(),
        db.service.count(),
        db.serviceRequest.count({
            where: { status: 'completed' },
        }),
    ]);

    return [
        {
            value: trustedPartners,
            label: "Trusted Partners",
            description: "Service Providing Partners",
            icon: 'handshake',
            color: "from-blue-100 to-blue-200",
        },
        {
            value: happyCustomers,
            label: "Happy Customers",
            description: "Satisfied clients",
            icon: 'smile',
            color: "from-emerald-100 to-emerald-200",
        },
        {
            value: serviceTypes,
            label: "Service Types",
            description: "Unique Services we offer",
            icon: 'listChecks',
            color: "from-purple-100 to-purple-200",
        },
        {
            value: servicesDelivered,
            label: "Services Delivered",
            description: "Successfully Executed Orders",
            icon: 'truck',
            color: "from-amber-100 to-amber-200",
        },
    ];
}
export async function getnooforders(serviceId: string): Promise<number> {
    return db.serviceRequest.count({
        where: {
            serviceId,
        },
    });
}