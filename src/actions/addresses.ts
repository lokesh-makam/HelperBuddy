"use server";

import {db} from "@/src/lib/db";

export const getAddresses = async (id:string) => {
    try {
        // Fetch addresses using user ID
        return await db.address.findMany({
            where: { userId: id },
            orderBy: { createdAt: "desc" },
        });

    } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
    }
};
export const removeAddressdb = async (addressId: string) => {
    try {

        // Delete the address
        await db.address.delete({
            where: { id: addressId },
        });

        return { success: true };
    } catch (error) {
        console.error("Error removing address:", error);
        throw new Error("Failed to remove address");
    }
};
export const setDefaultAddressdb = async (addressId: string) => {
    try {
        // Unset any existing default address
        await db.address.updateMany({
            where: { default: true },
            data: { default: false },
        });

        // Set the selected address as default
        await db.address.update({
            where: { id: addressId },
            data: { default: true },
        });

        return { success: true };
    } catch (error) {
        console.error("Error setting default address:", error);
        throw new Error("Failed to set default address");
    }
};

export const addAddressdb = async (addressData: {
    houseNo: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    default: boolean;
},id:string) => {
    try {
        if(!addressData.houseNo || !addressData.street || !addressData.city || !addressData.state || !addressData.postalCode || !addressData.country) throw new Error("All fields are required");
        if (addressData.default) {
            await db.address.updateMany({
                where: { userId: id, default: true },
                data: { default: false },
            });
        }

        // Add the new address
        return await db.address.create({
            data: {
                userId: id,
                ...addressData,
            },
        });
    } catch (error) {
        console.error("Error adding address:", error);
        throw new Error("Failed to add address");
    }
};
export const editAddressdb = async (addressId: string, updatedData: {
    houseNo?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    default?: boolean
}) => {
    try {

        // If updating to default, remove existing default
        if (updatedData.default) {
            await db.address.updateMany({
                where: { default: true },
                data: { default: false },
            });
        }

        // Update the address with the new data
        const updatedAddress = await db.address.update({
            where: { id: addressId },
            data: updatedData,
        });

        return updatedAddress;
    } catch (error) {
        console.error("Error editing address:", error);
        throw new Error("Failed to edit address");
    }
};

export async function getDefaultAddress(id: string|undefined) {
    try {
        if (!id) throw new Error("Email is required");
        const defaultAddress = await db.address.findFirst({
            where: { userId: id, default: true },
        });

        if (!defaultAddress) return null;

        return defaultAddress;
    } catch (error) {
        console.error("Error fetching default address:", error);
        return null;
    }
}