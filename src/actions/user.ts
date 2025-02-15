"use server";
import { db } from "@/src/lib/db";
export async function saveUserToDatabase(props: any) {
    try {
        const existingUser = await db.user.findUnique({
            where: { email:props.email },
        });
        if(existingUser) return { success: true, existingUser };

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
