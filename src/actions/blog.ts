"use server";

import { db } from "@/src/lib/db";
import cloudinary from "@/src/lib/cloudinary";

export async function submitBlog(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const authorName = formData.get("authorName") as string;
    const authorBio = formData.get("authorBio") as string;
    const category = formData.get("category") as string;
    const readTime = formData.get("readTime") as string;
    const tagsRaw = formData.get("tags") as string;
    const imageFile = formData.get("image") as File | null;
    console.log(tagsRaw);
    // Check required fields
    if (
      !title ||
      !excerpt ||
      !content ||
      !authorName ||
      !authorBio ||
      !category ||
      !readTime ||
      !tagsRaw
    ) {
      return { error: "Please fill all required fields." };
    }

    let imageUrl = "";

    if (imageFile && imageFile instanceof File) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUri = `data:${imageFile.type};base64,${base64}`;

      try {
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "blogs",
          resource_type: "image",
        });
        imageUrl = uploadResult.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return { error: "Image upload failed. Try a different image." };
      }
    }
    if (imageUrl === "") return { error: "Error in image upload." };
    // Save to DB
    const newBlog = await db.blog.create({
      data: {
        title,
        excerpt,
        content,
        authorName,
        authorBio,
        category,
        readTime,
        image: imageUrl,
        tags: tagsRaw,
      },
    });

    return { success: "Blog submitted successfully!", blog: newBlog };
  } catch (error: any) {
    console.error("Error submitting blog:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}
export async function updateBlog(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const authorName = formData.get("authorName") as string;
    const authorBio = formData.get("authorBio") as string;
    const category = formData.get("category") as string;
    const readTime = formData.get("readTime") as string;
    const tagsRaw = formData.get("tags") as string;
    const imageFile = formData.get("image") as File | null;

    if (
      !title ||
      !excerpt ||
      !content ||
      !authorName ||
      !authorBio ||
      !category ||
      !readTime ||
      !tagsRaw
    ) {
      return { error: "Please fill all required fields." };
    }

    let imageUrl = "";

    if (imageFile && imageFile instanceof File) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUri = `data:${imageFile.type};base64,${base64}`;

      try {
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "blogs",
          resource_type: "image",
        });
        imageUrl = uploadResult.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return { error: "Image upload failed. Try a different image." };
      }
    }

    const updatedBlog = await db.blog.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        authorName,
        authorBio,
        category,
        readTime,
        tags: tagsRaw,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return { success: "Blog updated successfully!", blog: updatedBlog };
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function getBlogs() {
  try {
    const blogs = await db.blog.findMany({
      orderBy: { publishedAt: "desc" },
    });

    const data = blogs.map((blog) => ({
      ...blog,
      tags: blog.tags.split(",").map((tag) => tag.trim()), // clean whitespace too
    }));

    return { success: true, blogs: data };
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch blogs. Please try again.",
    };
  }
}
export async function deleteBlogById(postId: string) {
  try {
    const deleted = await db.blog.delete({
      where: { id: postId },
    });

    return { success: "Blog deleted successfully", blog: deleted };
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return { error: error.message || "Failed to delete blog" };
  }
}
