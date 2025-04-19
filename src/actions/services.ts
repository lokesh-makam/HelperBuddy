"use server"
import { db} from "@/src/lib/db";
import  cloudinary  from "@/src/lib/cloudinary";

export async function getServices() {
    try {
        const services = await db.service.findMany();
        return { success: true, services };
    } catch (error) {
        console.error("Error fetching services:", error);
        return { success: false, error: "Failed to fetch services." };
    }
}
export async function addService(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const basePrice = parseInt(formData.get("basePrice") as string);
    const estimatedTime = formData.get("estimatedTime") as string;
    const includes= formData.get("includes") as string;
    const imageFile = formData.get("file") as File;

    if (!name || !category || isNaN(basePrice) || !imageFile||!includes) {
        return { error: "Missing required fields." };
    }

    try {
        // Convert File to Base64
        const fileBuffer = await imageFile.arrayBuffer();
        const base64String = Buffer.from(fileBuffer).toString("base64");
        const dataUri = `data:${imageFile.type};base64,${base64String}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
            folder: "services", // Cloudinary folder
            resource_type: "image",
        });

        console.log("Uploaded Image URL:", uploadResponse.secure_url);

        // Store the Image URL in your DB
        const service = await db.service.create({
            data: {
                name,
                description,
                category,
                basePrice,
                estimatedTime,
                includes,
                imageUrl: uploadResponse.secure_url, // Save Cloudinary URL
            },
        });

        return { success: "Service added successfully!", service };
    } catch (error) {
        console.error("Error adding service:", error);
        return { error: "Failed to add service." };
    }
}
export async function updateService(serviceId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const basePrice = parseInt(formData.get("basePrice") as string);
    const estimatedTime = formData.get("estimatedTime") as string;
    const includes = formData.get("includes") as string;
    const imageFile = formData.get("file") as File | null;
    const imageUrl = formData.get("imageUrl") as string; // Fallback if image not updated
    try {
        let finalImageUrl = imageUrl;
        // If a new image is uploaded
        if (imageFile) {
            const fileBuffer = await imageFile.arrayBuffer();
            const base64String = Buffer.from(fileBuffer).toString("base64");
            const dataUri = `data:${imageFile.type};base64,${base64String}`;

            const uploadResponse = await cloudinary.uploader.upload(dataUri, {
                folder: "services",
                resource_type: "image",
            });

            finalImageUrl = uploadResponse.secure_url;
        }

        const updatedService = await db.service.update({
            where: { id: serviceId },
            data: {
                name,
                description,
                category,
                basePrice,
                estimatedTime,
                includes,
                imageUrl: finalImageUrl,
            },
        });

        return { success: true, service: updatedService };
    } catch (error) {
        console.error("Error updating service:", error);
        return { error: "Failed to update service." };
    }
}