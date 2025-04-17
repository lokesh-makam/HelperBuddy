"use server";

import { db } from "@/src/lib/db";

export const deleteService = async (serviceId: string) => {
    try {
        await db.service.delete({
            where: { id: serviceId },
        });

        return { success: true, message: "Service deleted successfully." };
    } catch (error) {
        return { success: false, message: "Error deleting service." };
    }
};
