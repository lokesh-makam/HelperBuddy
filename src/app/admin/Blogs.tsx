"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { HiOutlineCamera } from "react-icons/hi";
import { submitBlog } from "@/src/actions/blog"; // Import server action

export default function Blogs() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<{ title: string; content: string; author: string; image?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", content);
    formData.append("author", author);
    if (image) {
      formData.append("image", image);
    }

    const response = await submitBlog(formData);
    setLoading(false);

    if (response.success) {
      const newBlog = response.blog;
      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      resetForm();
    } else {
      alert(response.error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAuthor("");
    setImage(null);
    setImagePreview(null);
    setEditingIndex(null);
  };

  return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Write a Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
              type="text"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
          />
          <input
              type="text"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Blog Content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleImageChange}
              />
              <Button
                  type="button"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 text-xl"
              >
                <HiOutlineCamera className="text-xl" />
                <span>Add a Pic</span>
              </Button>
            </div>

            <div className="flex-1">
              <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-all text-xl"
                  disabled={loading}
              >
                {loading ? "Publishing..." : "Publish Blog"}
              </Button>
            </div>
          </div>
        </form>

        {imagePreview && (
            <div className="mt-4 text-center">
              <img src={imagePreview} alt="Image Preview" className="max-w-full h-auto rounded-lg shadow-lg" />
            </div>
        )}

        {blogs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Published Blogs</h2>
              <div className="space-y-4">
                {blogs.map((blog, index) => (
                    <div key={index} className="p-6 border rounded-lg bg-gray-50 shadow-lg hover:shadow-xl transition-all">
                      {blog.image && (
                          <div className="mb-4">
                            <img src={blog.image} alt="Blog" className="w-full h-auto rounded-lg" />
                          </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-700">{blog.title}</h3>
                      <p className="text-gray-600 mt-2">{blog.content}</p>
                      <p className="text-gray-500 mt-2 italic">By {blog.author}</p>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );
}

