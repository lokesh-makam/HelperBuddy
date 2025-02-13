"use server";

import { db } from "@/src/lib/db";
import { uploadToMega } from "@/src/lib/mega";
import {currentUser} from "@clerk/nextjs/server";

export async function registerServicePartner(formData: FormData) {
    try {
        const experience = formData.get("experience") as string;
        const bio = formData.get("bio") as string;
        const upi = formData.get("upi") as string;
        const serviceAreas = formData.get("serviceAreas") as string;
        const idCardFile = formData.get("idCard") as File;
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress; // Correct way to get email
        const existingUser = await db.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!existingUser) {
            return { error: "User not found." };
        }
        if (!experience || !serviceAreas || !idCardFile) {
            return { error: "Missing required fields." };
        }
        if (!(idCardFile instanceof File)) {
            return { error: "Invalid file upload." };
        }
        // Convert the file to a buffer
        const fileArrayBuffer = await idCardFile.arrayBuffer();
        const fileBuffer = Buffer.from(fileArrayBuffer);

        if (!fileBuffer || fileBuffer.length === 0) {
            return { error: "Failed to process file." };
        }

        console.log("Uploading file...");
        const fileUrl = await uploadToMega(fileBuffer, idCardFile.name);
        console.log("File uploaded successfully:", fileUrl);

        const newServicePartner = await db.servicePartner.create({
            data: {
                userId: existingUser.id, // Generate a unique ID
                experience: parseInt(experience),
                bio,
                upi,
                serviceAreas: serviceAreas.split(","), // Store as an array
                isVerified: false,
                idCard: fileUrl, // Store the uploaded file URL
            },
        });

        return { success: "Service Partner registered successfully!", servicePartner: newServicePartner };
    } catch (error) {
        console.error("Error registering service partner:", error);
        return { error: "Failed to register service partner." };
    }
}
