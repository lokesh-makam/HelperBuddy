"use client";
import React, { useState, useEffect } from "react";
import {
  Share,
  Clock,
  Calendar,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { getBlogs } from "@/src/actions/blog";
import Loading from "@/src/app/loading";

// Define the blog post type
interface BlogPost {
  id: string; // Unique identifier (UUID)
  title: string; // Blog title
  excerpt: string; // Short summary (excerpt)
  content: string; // Full HTML content
  image: string; // Image URL
  authorName: string; // Author name
  authorBio: string; // Author bio
  tags: string[]; // Array of tags (strings)
  category: string; // Category (e.g. Lifestyle, Tech)
  readTime: string; // Read time (e.g. "5 min read")
  publishedAt: Date; // Date of publishing
  createdAt: Date; // Creation date
  updatedAt: Date; // Date of last update
}

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [blogPosts, setblogPost] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await getBlogs();
        console.log(data);
        setblogPost(data.blogs);
        setFilteredPosts(data.blogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchBlogPosts();
  }, []);
  // Get all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

  // Filter posts based on search query and active tags
  useEffect(() => {
    let result = blogPosts;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post: BlogPost) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          post.category.toLowerCase().includes(query)
      );
    }

    // Apply tag filters
    if (activeFilters.length > 0) {
      result = result.filter((post) =>
        activeFilters.some((filter) => post.tags.includes(filter))
      );
    }

    setFilteredPosts(result);
  }, [searchQuery, activeFilters]);

  const openBlogPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const sharePost = () => {
    if (selectedPost && navigator.share) {
      navigator
        .share({
          title: selectedPost.title,
          text: selectedPost.excerpt,
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      setShareDialogOpen(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setShareDialogOpen(false), 500);
  };
  if (loading) {
    return <Loading />;
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Glass Effect */}
      <div className="relative h-96 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-black/80 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/mai.png')] bg-cover bg-center opacity-40 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                The Blog
              </span>
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-white rounded-full"></span>
            </span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto my-6">
            Discover insights, trends, and stories from our experts across
            technology, lifestyle, health, and sustainability.
          </p>

          {/* Search Bar with Glass Effect */}
          <div className="relative max-w-xl mx-auto mt-8">
            <div className="backdrop-blur-md bg-white/20 rounded-full flex items-center p-1 pl-4 border border-white/30">
              <Search className="h-5 w-5 text-white/80" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="w-full bg-transparent border-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Curved Bottom */}
        <div className="absolute -bottom-12 left-0 right-0 h-24 bg-white rounded-t-[50%]"></div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Latest Articles
          </h2>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-4 py-2 rounded-full transition-all"
          >
            <span>Filter by tags</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                showFilters ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        {/* Tag Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex flex-wrap gap-2 py-4">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleFilter(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      activeFilters.includes(tag)
                        ? "bg-black text-white"
                        : "bg-black/5 text-black hover:bg-black/10"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {activeFilters.length > 0 && (
                  <button
                    onClick={() => setActiveFilters([])}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 pb-24">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-600">
              No articles found matching your search.
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search terms or filters.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setActiveFilters([]);
              }}
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
                        <span>
                          {formatDate(post.createdAt.toLocaleDateString())}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-black/5 px-2 py-1 rounded-full"
                        >
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
                        <span className="text-sm font-medium">
                          {post.authorName}
                        </span>
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

        {/* Pagination */}
        {filteredPosts.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Previous page"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  variant="outline"
                  className={`rounded-full transition-all ${
                    currentPage === page
                      ? "bg-black text-white hover:bg-black/90"
                      : "hover:bg-black hover:text-white"
                  }`}
                >
                  {page}
                </Button>
              ))}
              <span className="px-1 sm:px-2 text-gray-500">...</span>
              {/* Last Page */}
              <Button
                onClick={() => setCurrentPage(totalPages)}
                variant="outline"
                className={`rounded-full transition-all ${
                  currentPage === totalPages
                    ? "bg-black text-white hover:bg-black/90"
                    : "hover:bg-black hover:text-white"
                }`}
              >
                {totalPages}
              </Button>
              {/* Next */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Next page"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Blog Post Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-xl border border-black/10">
          {selectedPost && (
            <>
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
                      <span className="mr-2">
                        {formatDate(
                          selectedPost.createdAt.toLocaleDateString()
                        )}
                      </span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{selectedPost.readTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={sharePost}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {selectedPost.title}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-black/5 text-black border-none"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
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
                    <span className="font-medium">
                      {selectedPost.authorName}
                    </span>
                  </div>
                  <p className="text-gray-600">{selectedPost.authorBio}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-sm bg-white rounded-xl border border-black/10 p-6">
          <h3 className="text-lg font-medium mb-4">Share this article</h3>
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
            >
              <Twitter className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Input
              readOnly
              value={window.location.href}
              className="pr-16 bg-gray-50 border-gray-200"
            />
            <Button
              onClick={copyLink}
              variant="default"
              size="sm"
              className="absolute right-1 top-1 h-8 bg-black text-white hover:bg-black/80"
            >
              <LinkIcon className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPage;
