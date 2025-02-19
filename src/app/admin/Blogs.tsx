import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { HiOutlineCamera, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'; // Importing icons

export default function Blogs() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [blogs, setBlogs] = useState<{ title: string; content: string; image?: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const blogData: { title: string; content: string; image?: string } = { title, content };

    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        blogData.image = reader.result as string;
        if (editingIndex !== null) {
          const updatedBlogs = [...blogs];
          updatedBlogs[editingIndex] = blogData;
          setBlogs(updatedBlogs);
        } else {
          setBlogs((prevBlogs) => [...prevBlogs, blogData]);
        }
        resetForm();
      };
      reader.readAsDataURL(image);
    } else {
      if (editingIndex !== null) {
        const updatedBlogs = [...blogs];
        updatedBlogs[editingIndex] = blogData;
        setBlogs(updatedBlogs);
      } else {
        setBlogs((prevBlogs) => [...prevBlogs, blogData]);
      }
      resetForm();
    }
  };

  const handleEdit = (index: number) => {
    const blog = blogs[index];
    setTitle(blog.title);
    setContent(blog.content);
    setImage(blog.image ? new File([blog.image], 'image.jpg') : null);
    setImagePreview(blog.image ?? null);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedBlogs = blogs.filter((_, i) => i !== index);
    setBlogs(updatedBlogs);
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
    setTitle('');
    setContent('');
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
            >
              {editingIndex !== null ? 'Update Blog' : 'Publish Blog'}
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
              <div
                key={index}
                className="p-6 border rounded-lg bg-gray-50 shadow-lg hover:shadow-xl transition-all"
              >
                {blog.image && (
                  <div className="mb-4">
                    <img src={blog.image} alt="Blog" className="w-full h-auto rounded-lg" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-700">{blog.title}</h3>
                <p className="text-gray-600 mt-2">{blog.content}</p>
                <div className="flex gap-4 mt-4">
                  <Button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                    onClick={() => handleEdit(index)}
                  >
                    <HiOutlinePencil className="text-lg" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    type="button"
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all flex items-center space-x-2"
                    onClick={() => handleDelete(index)}
                  >
                    <HiOutlineTrash className="text-lg" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}