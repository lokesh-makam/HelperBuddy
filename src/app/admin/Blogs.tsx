"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { HiOutlineCamera } from "react-icons/hi";
import { FiSearch, FiX, FiEdit } from "react-icons/fi";
import {deleteBlogById, getBlogs, submitBlog, updateBlog} from "@/src/actions/blog";
import { toast } from "react-toastify";
import {motion} from "framer-motion";
import {Badge} from "@/src/components/ui/badge";
import {Calendar, ChevronLeft, ChevronRight, Clock, Pencil, Share, Trash2, X} from "lucide-react";
import {Avatar, AvatarFallback} from "@/src/components/ui/avatar";
import Loading from "@/src/app/loading";
import {Dialog, DialogContent} from "@/src/components/ui/dialog";

export default function Blogs() {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    authorName: "",
    authorBio: "",
    tags: "",
    category: "",
    readTime: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loader,setloader]=useState(true)
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<any>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    excerpt: '',
    content: '',
    authorName: '',
    authorBio: '',
    category: '',
    readTime: '',
    tags: '',
  });
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await getBlogs();
        console.log(data)
        setBlogs(data.blogs);
        setFilteredPosts(data.blogs);
        setloader(false);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchBlogPosts();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  const openBlogPost = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      authorName: "",
      authorBio: "",
      tags: "",
      category: "",
      readTime: "",
    });
    setImage(null);
    setImagePreview(null);
    setShowModal(false);
  };

  const handleDeleteBlog = async (postId: string) => {
    try {
      console.log("Deleting blog with ID:", postId);
      const result = await deleteBlogById(postId);

      if (result.error) {
        toast.error(result.error);
        return;
      }
      setBlogs((prev) => prev.filter((blog) => blog.id !== postId));
      setFilteredPosts((prev) => prev.filter((blog) => blog.id !== postId));
      setIsModalOpen(false)
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleEditBlog = (post) => {
    setEditData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      authorName: post.authorName,
      authorBio: post.authorBio,
      category: post.category,
      readTime: post.readTime,
      tags: post.tags.join(', '),
    });
    setIsModalOpen(false)
    setEditImagePreview(post.image); // Show existing image
    setShowEditModal(true);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", editData.title);
    formData.append("excerpt", editData.excerpt);
    formData.append("content", editData.content);
    formData.append("authorName", editData.authorName);
    formData.append("authorBio", editData.authorBio);
    formData.append("category", editData.category);
    formData.append("readTime", editData.readTime);
    formData.append("tags", editData.tags);
    if (editImage) formData.append("image", editImage);
    try {
        setLoading(true);
        const result = await updateBlog(selectedPost.id, formData);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        if (result?.success && result.blog) {
          const updatedBlog = result.blog;
          // @ts-ignore
          updatedBlog.tags=updatedBlog.tags.split(",");
          setBlogs((prev) =>
              prev.map((blog) =>
                  blog.id === updatedBlog.id ? updatedBlog : blog
              )
          );
          setFilteredPosts((prev:any) =>
            prev.map((blog:any) =>
                blog.id === updatedBlog.id ? updatedBlog : blog
            )
          )
          setShowEditModal(false);
          toast.success("Blog updated successfully!");
        }
    } catch(e){
      console.log(e);
      toast.error("Failed to update blog!");
    }finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, excerpt, content, authorName, category, readTime, tags, authorBio } = formData;

    if (!title || !excerpt || !content || !authorName || !category || !readTime || !authorBio || !tags) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) data.append("image", image);

    const response = await submitBlog(data);
    setLoading(false);
    if (response.success) {
      response.blog.tags=response.blog.tags.split(",");
      setBlogs((prev) => [response.blog, ...prev]);
      setFilteredPosts((prev) => [response.blog, ...prev]);
      toast.success("Blog published successfully!");
      setBlogs((prev) => [...prev, response.blog]);
      resetForm();
    } else {
      toast.error(response.error || "Failed to publish blog.");
    }
  };

  const inputClass =
      "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  useEffect(() => {
    let result = blogs;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query)) ||
          post.category.toLowerCase().includes(query)
      );
    }
    setFilteredPosts(result);
  }, [searchQuery]);

  if(loader){
    return <Loading/>
  }
  return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Blog Management</h1>

        {/* Search and Add Blog Row */}
        <div className="flex md:flex-row gap-6 mb-8">
          <div className="relative">
            <input
                type="text"
                placeholder="Search blogs..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400"/>
            {searchQuery && (
                <button
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                >
                  <FiX/>
                </button>
            )}
          </div>
          <Button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6"
              onClick={() => setShowModal(true)}
          >
            Add New Blog
          </Button>
        </div>

        {/* Blog Cards */}
        {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-600">No articles found matching your search.</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search terms or filters.</p>
              <Button
                  onClick={() => {setSearchQuery("")}}
                  className="mt-4 bg-black text-white hover:bg-black/80"
              >
                Reset All Filters
              </Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                  <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group"
                  >
                    <div className="backdrop-blur-sm bg-white shadow-lg hover:shadow-xl rounded-2xl overflow-hidden border border-black/5 transition-all duration-300 flex flex-col h-full">
                      <div className="relative h-52 overflow-hidden">
                        <img
                            src={post.image || "/placeholder.png"}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Badge className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white border-none">
                          {post.category}
                        </Badge>
                      </div>

                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{ formatDate(post.createdAt.toLocaleDateString())}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <h2 className="text-xl font-bold mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs bg-black/5 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                          ))}
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-center mb-4">
                            <Avatar className="h-8 w-8 mr-2 border border-black/10">
                              <AvatarFallback className="bg-black text-white">
                                {post.authorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{post.authorName}</span>
                          </div>

                          <Button
                              onClick={() => openBlogPost(post)}
                              className="w-full bg-white hover:bg-black hover:text-white text-black border border-black transition-all duration-300 relative overflow-hidden group"
                          >
                            <span className="relative z-10">Read Article</span>
                            <span className="absolute inset-0 w-0 bg-black group-hover:w-full transition-all duration-300 ease-out -z-10"></span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
              ))}
            </div>
        )}
        {showEditModal && selectedPost && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl md:max-w-[70vw] lg:max-w-[50vw] w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Blog</h2>
                    <button
                        onClick={() => setShowEditModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit} className="space-y-5">
                    <input
                        name="title"
                        placeholder="Blog Title"
                        className={inputClass}
                        value={editData.title}
                        onChange={handleEditChange}
                    />
                    <input
                        name="excerpt"
                        placeholder="Short Summary (Excerpt)"
                        className={inputClass}
                        value={editData.excerpt}
                        onChange={handleEditChange}
                    />
                    <textarea
                        name="content"
                        placeholder="Full HTML Content"
                        rows={6}
                        className={inputClass}
                        value={editData.content}
                        onChange={handleEditChange}
                    />
                    <input
                        name="authorName"
                        placeholder="Author Name"
                        className={inputClass}
                        value={editData.authorName}
                        onChange={handleEditChange}
                    />
                    <input
                        name="authorBio"
                        placeholder="Author Bio"
                        className={inputClass}
                        value={editData.authorBio}
                        onChange={handleEditChange}
                    />
                    <input
                        name="category"
                        placeholder="Category"
                        className={inputClass}
                        value={editData.category}
                        onChange={handleEditChange}
                    />
                    <input
                        name="readTime"
                        placeholder="Read Time"
                        className={inputClass}
                        value={editData.readTime}
                        onChange={handleEditChange}
                    />
                    <input
                        name="tags"
                        placeholder="Tags (comma-separated)"
                        className={inputClass}
                        value={editData.tags}
                        onChange={handleEditChange}
                    />

                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleEditImageChange}
                        />
                        <Button type="button" className="w-full bg-blue-600 text-white py-4 rounded-lg flex items-center justify-center">
                          <HiOutlineCamera className="text-xl" />
                          <span className="ml-2">{editImagePreview ? "Change Image" : "Upload Image"}</span>
                        </Button>
                      </div>
                      <Button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-4 rounded-lg"
                          disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>

                    {editImagePreview && (
                        <div className="mt-4">
                          <img src={editImagePreview} alt="Image Preview" className="w-full h-auto rounded-lg shadow-md" />
                        </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
        )}

        {/* Modal Form */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div
                  className="bg-white rounded-lg shadow-xl md:max-w-[70vw] lg:max-w-[50vw] w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Blog</h2>
                    <button
                        onClick={resetForm}
                        className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={24}/>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <input name="title" placeholder="Blog Title" className={inputClass} value={formData.title}
                           onChange={handleChange}/>
                    <input name="excerpt" placeholder="Short Summary (Excerpt)" className={inputClass}
                           value={formData.excerpt} onChange={handleChange}/>
                    <textarea name="content" placeholder="Full HTML Content" rows={6} className={inputClass}
                              value={formData.content} onChange={handleChange}/>
                    <input name="authorName" placeholder="Author Name" className={inputClass}
                           value={formData.authorName} onChange={handleChange}/>
                    <input name="authorBio" placeholder="Author Bio" className={inputClass} value={formData.authorBio}
                           onChange={handleChange}/>
                    <input name="category" placeholder="Category (e.g. Tech, Life)" className={inputClass}
                           value={formData.category} onChange={handleChange}/>
                    <input name="readTime" placeholder="Read Time (e.g. 3 min read)" className={inputClass}
                           value={formData.readTime} onChange={handleChange}/>
                    <input name="tags" placeholder="Tags (comma-separated)" className={inputClass} value={formData.tags}
                           onChange={handleChange}/>

                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*"
                               onChange={handleImageChange}/>
                        <Button type="button"
                                className="w-full bg-blue-600 text-white py-4 rounded-lg flex items-center justify-center">
                          <HiOutlineCamera className="text-xl"/>
                          <span className="ml-2">{imagePreview ? "Change Image" : "Upload Image"}</span>
                        </Button>
                      </div>
                      <Button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-lg"
                              disabled={loading}>
                        {loading ? "Publishing..." : "Publish Blog"}
                      </Button>
                    </div>

                    {imagePreview && (
                        <div className="mt-4">
                          <img src={imagePreview} alt="Image Preview" className="w-full h-auto rounded-lg shadow-md"/>
                        </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
        )}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-xl border border-black/10">
            {selectedPost && (
                <>
                  {/* Header with Add & Delete */}
                  <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10 border border-black/10">
                        <AvatarFallback className="bg-black text-white">
                          {selectedPost.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedPost.authorName}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-2">{formatDate(selectedPost.createdAt.toLocaleDateString())}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{selectedPost.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {/* Edit Blog */}
                      <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditBlog(selectedPost)}
                      >
                        <Pencil className="h-4 w-4"/>
                      </Button>

                      {/* Delete Blog */}
                      <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteBlog(selectedPost.id)}
                      >
                        <Trash2 className="h-4 w-4"/>
                      </Button>

                      {/* Close Dialog */}
                      <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setIsModalOpen(false)}
                      >
                        <X className="h-4 w-4"/>
                      </Button>
                    </div>

                  </div>

                  {/* Blog Content */}
                  <div className="p-6 space-y-6">
                    <h1 className="text-2xl md:text-3xl font-bold">{selectedPost.title}</h1>

                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-black/5 text-black border-none">
                            {tag}
                          </Badge>
                      ))}
                    </div>

                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                    </div>

                    <div
                        className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700"
                        dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                    />

                    <div className="bg-black/5 backdrop-blur-sm rounded-xl p-6">
                      <h3 className="font-semibold mb-3">About the author</h3>
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-12 w-12 border border-black/10">
                          <AvatarFallback className="bg-black text-white">
                            {selectedPost.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{selectedPost.authorName}</span>
                      </div>
                      <p className="text-gray-600">{selectedPost.authorBio}</p>
                    </div>
                  </div>
                </>
            )}
          </DialogContent>
        </Dialog>

      </div>
  );
}