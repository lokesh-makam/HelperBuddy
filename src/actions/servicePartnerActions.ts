"use server";
import { db } from "@/src/lib/db";

// Fetch all service partners
export async function getAllServicePartners() {
    return db.servicePartner.findMany({
        orderBy: {createdAt: "desc"},
    });
}

// Approve service partner
export async function approveServicePartner(id: string) {
    return db.servicePartner.update({
        where: {id},
        data: {status: "approved"},
    });
}

// Remove service partner
export async function removeServicePartner(id: string) {
    return db.servicePartner.delete({
        where: {id},
    });
}

// Reject service partner
export async function rejectServicePartner(id: string) {
    return db.servicePartner.update({
        where: {id},
        data: {status: "rejected"},
    });
}