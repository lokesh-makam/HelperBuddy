"use server"; // Ensures this runs only on the server

import bcrypt from "bcryptjs";
import { db } from "@/src/lib/db";

export async function saveUserToDatabase(props: any) {
    try {
        const existingUser = await db.user.findUnique({
            where: { email:props.email },
        });
        if(existingUser) return { success: true, existingUser };
        const hashedPassword = await bcrypt.hash(props.password, 10);
        const user = await db.user.create({
            data: {
                email: props.email,
                firstName: props.firstname, // Ensure column names match your database
                lastName: props.lastname,
                password: hashedPassword, // Store hashed password
            },
        });
        return { success: true, user };
    } catch (error) {
        console.error("Error saving user:", error);
        return { success: false, error: "Failed to save user." };
    }
}
