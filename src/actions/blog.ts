"use server"
import { db } from "@/src/lib/db";
import cloudinary from "@/src/lib/cloudinary";

export async function submitBlog(formData: any) {
    try {
        const title = formData.get("title");
        const description = formData.get("description");
        const imageFile = formData.get("image");
        const author = formData.get("author");

        if (!title || !description || !imageFile || !author) {
            return { error: "Missing required fields." };
        }

        if (!(imageFile instanceof File)) {
            return { error: "Invalid file upload." };
        }

        const fileBuffer = await imageFile.arrayBuffer();
        const base64String = Buffer.from(fileBuffer).toString("base64");
        const dataUri = `data:${imageFile.type};base64,${base64String}`;

        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
            folder: "blogs",
            resource_type: "image",
        });

        const newBlog = await db.blog.create({
            data: {
                title,
                description,
                image: uploadResponse.secure_url,
                author,
            },
        });

        return { success: "Blog submitted successfully!", blog: newBlog };
    } catch (error) {
        console.error("Error submitting blog:", error);
        return { error: "Failed to submit blog." };
    }
}
