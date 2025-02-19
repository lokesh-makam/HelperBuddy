"use client"
import React, { useState } from "react";
import { Clock, Calendar, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";

// Define the blog post type
interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        avatar?: string;
    };
    date: string;
    readTime: string;
    image: string;
    tags: string[];
    category: string;
    videoUrl?: string;
}

// Sample blog data - keeping the existing data
const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Glow Up with Clean Beauty: Why It's Trending in 2024",
        excerpt: "In 2024, the beauty industry is embracing the clean beauty movement more than ever, and it's not just about skincare—it's a full-on lifestyle shift.",
        content: `
      <h2>What is Clean Beauty?</h2>
      <p>Clean beauty refers to products that are made without toxic ingredients, such as parabens, sulfates, phthalates, and synthetic fragrances. It focuses on transparency, ethical sourcing, and safe formulations that not only protect your skin but also the planet. Consumers are now more informed and seeking beauty products that align with their values.</p>
      
      <h2>The Rise of Ethical Consumerism</h2>
      <p>As climate change concerns grow, ethical consumerism is on the rise. People are choosing brands that are eco-friendly, cruelty-free, and ethically produced. Clean beauty products often boast recyclable or biodegradable packaging, further reducing their environmental footprint.</p>
      
      <h2>Ingredients Matter</h2>
      <p>In 2024, consumers are more ingredient-conscious than ever. Clean beauty products are filled with natural and organic ingredients, such as plant-based oils, antioxidants, and botanicals. These ingredients not only nourish the skin but are also less likely to cause irritation, making clean beauty suitable for all skin types, including sensitive skin.</p>
      
      <h2>Why Clean Beauty is Here to Stay</h2>
      <ol>
        <li><strong>Health Consciousness</strong>: People are becoming more aware of the harmful chemicals in their beauty products and opting for safer alternatives.</li>
        <li><strong>Sustainability</strong>: The beauty industry is making strides to reduce waste, with many brands launching refillable, reusable, or compostable packaging.</li>
        <li><strong>Inclusivity</strong>: Clean beauty brands often cater to a wide range of skin tones and types, ensuring that everyone can experience healthier beauty.</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>The clean beauty movement is more than just a passing trend—it's a shift toward conscious consumerism and sustainability in the beauty industry. As 2024 progresses, the clean beauty trend will only grow, pushing for transparency and wellness in our beauty routines.</p>
      <p>So, if you're looking to elevate your beauty regimen this year, it's time to switch to clean, eco-friendly, and healthy products that are kind to your skin and the planet. Let your glow be natural!</p>
    `,
        author: {
            name: "Yash Rawal",
            avatar: "/avatars/yash.jpg"
        },
        date: "December 19, 2024",
        readTime: "2 min read",
        image: "/images/mai.png",
        tags: ["Beauty", "Skincare", "Sustainability"],
        category: "Lifestyle"
    },
    {
        id: 2,
        title: "The Future of AI in Everyday Tech: What to Expect in 2025",
        excerpt: "As AI becomes more integrated into our daily lives, here's what you can expect to see in your devices and apps by 2025.",
        content: `
      <h2>AI Assistants Become More Human-like</h2>
      <p>By 2025, AI assistants will become eerily good at understanding context, emotions, and even sarcasm. They'll handle complex tasks across multiple apps and services seamlessly, making them true digital companions rather than simple command responders.</p>
      
      <h2>Personalization Reaches New Heights</h2>
      <p>From your shopping experiences to your entertainment choices, AI will curate experiences that feel tailor-made for you. Recommendation systems will become so advanced that they'll anticipate your needs before you even realize them yourself.</p>
      
      <h2>Healthcare Transformation</h2>
      <p>AI-powered health monitoring through smartphones and wearables will detect potential health issues days or weeks before symptoms appear. Personalized health insights will become commonplace, with AI suggesting lifestyle changes based on your unique biometric data.</p>
      
      <h2>Ethical Considerations</h2>
      <p>As AI becomes more pervasive, questions about privacy, data ownership, and algorithmic bias will take center stage. Companies will need to balance innovation with strong ethical frameworks to maintain consumer trust.</p>
      
      <h2>Conclusion</h2>
      <p>The integration of AI into everyday technology is accelerating rapidly. While the benefits are immense, we'll also need thoughtful regulation and ethical guidelines to ensure these powerful tools enhance rather than compromise our lives.</p>
    `,
        author: {
            name: "Priya Sharma",
            avatar: "/avatars/priya.jpg"
        },
        date: "January 5, 2025",
        readTime: "4 min read",
        image: "/images/mai.png",
        tags: ["Technology", "AI", "Future Trends"],
        category: "Tech"
    },
    {
        id: 3,
        title: "Sustainable Living: Small Changes with Big Impact",
        excerpt: "Discover how simple everyday choices can dramatically reduce your carbon footprint while saving you money.",
        content: `
      <h2>Rethinking Consumption</h2>
      <p>The first step to sustainable living is consuming less. Before making a purchase, ask yourself: Do I need this? Can I borrow it? Is there a more sustainable alternative? This mindset shift alone can reduce waste significantly.</p>
      
      <h2>Energy Efficiency at Home</h2>
      <p>Simple changes like switching to LED bulbs, using smart thermostats, and unplugging devices when not in use can reduce your energy consumption by up to 30%. These changes not only help the planet but also lower your utility bills.</p>
      
      <h2>Sustainable Food Choices</h2>
      <p>Reducing meat consumption, buying local produce, and minimizing food waste can dramatically cut your carbon footprint. Try implementing "Meatless Mondays" or buying from farmers' markets to start making a difference.</p>
      
      <h2>Transportation Alternatives</h2>
      <p>Walking, cycling, carpooling, or using public transportation even once or twice a week can significantly reduce your carbon emissions. If possible, consider an electric or hybrid vehicle for your next car purchase.</p>
      
      <h2>Conclusion</h2>
      <p>Sustainable living doesn't require radical lifestyle changes. By making small, consistent choices, you can reduce your environmental impact while often improving your health and saving money. Remember, millions of people making imperfect efforts will have a greater impact than a few people doing it perfectly.</p>
    `,
        author: {
            name: "Rohan Mehta",
            avatar: "/avatars/rohan.jpg"
        },
        date: "February 2, 2025",
        readTime: "3 min read",
        image: "/images/mai.png",
        tags: ["Sustainability", "Lifestyle", "Environment"],
        category: "Environment"
    },
    {
        id: 4,
        title: "Digital Detox: Why Everyone Needs a Tech Break in 2025",
        excerpt: "In an increasingly connected world, taking regular breaks from technology has become essential for mental health and productivity.",
        content: `
      <h2>Signs You Need a Digital Detox</h2>
      <p>Do you check your phone first thing in the morning? Feel anxious when your battery is low? Struggle to concentrate on one task? These could be signs that you need a break from your devices.</p>
      
      <h2>Benefits of Unplugging</h2>
      <p>Studies show that regular digital detoxes can improve sleep quality, reduce anxiety, enhance face-to-face relationships, and boost creativity and focus. Even a short break from screens can reset your relationship with technology.</p>
      
      <h2>How to Do a Digital Detox</h2>
      <p>Start small with screen-free evenings or weekend mornings. Set clear boundaries by turning off notifications, keeping devices out of the bedroom, and using apps that monitor and limit your screen time.</p>
      
      <h2>What to Do Instead</h2>
      <p>Rediscover offline activities: read physical books, practice mindfulness or meditation, spend time in nature, engage in creative hobbies, or simply connect with loved ones without the distraction of screens.</p>
      
      <h2>Conclusion</h2>
      <p>Technology should enhance our lives, not control them. By consciously stepping away from our devices regularly, we can maintain a healthier relationship with technology while improving our overall wellbeing.</p>
    `,
        author: {
            name: "Aarav Patel",
            avatar: "/avatars/aarav.jpg"
        },
        date: "January 15, 2025",
        readTime: "3 min read",
        image: "/images/mai.png",
        tags: ["Mental Health", "Technology", "Wellbeing"],
        category: "Health"
    },
    {
        id: 5,
        title: "The Rise of Virtual Tourism: Exploring the World from Home",
        excerpt: "With VR technology becoming more sophisticated, virtual tourism is offering new ways to experience destinations without the carbon footprint.",
        content: `
      <h2>What is Virtual Tourism?</h2>
      <p>Virtual tourism uses technologies like VR, AR, and 360° videos to let you explore destinations around the world from your home. These immersive experiences go beyond traditional photos or videos, creating the sensation of actually being there.</p>
      
      <h2>Technological Advancements</h2>
      <p>The latest VR headsets offer stunning visual quality and spatial audio that trick your brain into feeling physically present in virtual environments. Haptic feedback systems are even beginning to simulate textures and temperatures.</p>
      
      <h2>Popular Virtual Destinations</h2>
      <p>From walking the Great Wall of China to diving in the Great Barrier Reef or touring the Louvre, virtual tourism platforms now offer thousands of experiences. Some even include local guides who interact with you in real-time.</p>
      
      <h2>Environmental Impact</h2>
      <p>While nothing replaces the authentic experience of travel, virtual tourism offers a way to explore with zero carbon emissions. It's also making travel more accessible to those with physical limitations or financial constraints.</p>
      
      <h2>The Future of Travel</h2>
      <p>Rather than replacing physical travel, virtual tourism is becoming a complementary experience—people "pre-visit" destinations virtually to plan actual trips, or revisit favorite places without leaving home.</p>
      
      <h2>Conclusion</h2>
      <p>As the technology continues to improve, virtual tourism will become an increasingly important part of how we experience the world, offering sustainable alternatives while making global exploration more accessible to everyone.</p>
    `,
        author: {
            name: "Maya Singh",
            avatar: "/avatars/maya.jpg"
        },
        date: "January 28, 2025",
        readTime: "4 min read",
        image: "/images/mai.png",
        videoUrl: "https://example.com/videos/virtual-tourism-demo.mp4",
        tags: ["Travel", "Technology", "VR", "Sustainability"],
        category: "Travel"
    }
];

const BlogPage: React.FC = () => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openBlogPost = (post: BlogPost) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white min-h-screen pt-24">
            <div className="container mx-auto px-12 py-12">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-black">
                        Our Blog
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                        Discover the latest trends, insights, and stories from our experts
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 px-16 gap-8">
                    {blogPosts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col border border-gray-200"
                        >
                            <div className="relative h-60 overflow-hidden">
                                <img
                                    src={post.image || "/placeholder.png"}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <Badge className="absolute top-4 left-4 bg-black text-white font-medium border-none">
                                    {post.category}
                                </Badge>
                            </div>

                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold mb-3 hover:text-gray-700 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                                <div className="mt-auto">
                                    <div className="flex items-center mb-4">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={post.author.avatar} />
                                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{post.author.name}</span>
                                    </div>

                                    <Button
                                        onClick={() => openBlogPost(post)}
                                        className="w-full bg-black hover:bg-gray-800 text-white transition-all duration-300"
                                    >
                                        Read More
                                    </Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Blog Post Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-lg">
                        {selectedPost && (
                            <>
                                <DialogHeader className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
                                    <div className="flex-1">
                                        <DialogTitle className="sr-only">Blog Post: {selectedPost.title}</DialogTitle>
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={selectedPost.author.avatar} />
                                                <AvatarFallback>{selectedPost.author.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium">{selectedPost.author.name}</h3>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    <span className="mr-2">{selectedPost.date}</span>
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    <span>{selectedPost.readTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </DialogHeader>

                                <div className="p-6 space-y-6">
                                    <h1 className="text-2xl md:text-3xl font-bold">{selectedPost.title}</h1>

                                    <div className="flex flex-wrap gap-2">
                                        {selectedPost.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="bg-gray-100 text-gray-700">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    {selectedPost.videoUrl ? (
                                        <div className="aspect-video rounded-lg overflow-hidden">
                                            <video
                                                src={selectedPost.videoUrl}
                                                controls
                                                className="w-full h-full object-cover"
                                                poster={selectedPost.image}
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video rounded-lg overflow-hidden">
                                            <img
                                                src={selectedPost.image}
                                                alt={selectedPost.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div
                                        className="prose prose-lg max-w-none"
                                        dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                    />

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold mb-3">About the author</h3>
                                        <div className="flex items-center space-x-3 mb-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={selectedPost.author.avatar} />
                                                <AvatarFallback>{selectedPost.author.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{selectedPost.author.name}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Expert in {selectedPost.category.toLowerCase()} with over 5 years of experience writing about {selectedPost.tags.join(", ").toLowerCase()}.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default BlogPage;