"use server"
import { db} from "@/src/lib/db";
import { uploadToMega } from "@/src/lib/mega";
export async function addService(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const basePrice = parseInt(formData.get("basePrice") as string);
    const estimatedTime = formData.get("estimatedTime") as string;
    const imageFile = formData.get("file") as File;
    if (!name || !category || isNaN(basePrice) || !imageFile) {
        return { error: "Missing required fields." };
    }
    try {
        const fileArrayBuffer = await imageFile.arrayBuffer();
        if (!fileArrayBuffer || fileArrayBuffer.byteLength === 0) {
            return { error: "Failed to process file. Please try again." };
        }
        const fileBuffer = Buffer.from(fileArrayBuffer);
        if (!fileBuffer || fileBuffer.length === 0) {
            return { error: "Failed to process file." };
        }
        console.log("File Buffer:", fileBuffer);
        const imageUrl = await uploadToMega(fileBuffer, imageFile.name);
        console.log("Image URL:", imageUrl);
        const service = await db.service.create({
            data: { name, description, category, basePrice, estimatedTime, imageUrl },
        });
        return { success: "Service added successfully!", service };
    } catch (error) {
        console.error("Error adding service:", error);
        return { error: "Failed to add service." };
    }
}

