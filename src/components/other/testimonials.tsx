'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
    {
        "id": 1,
        "name": "Amit Sharma",
        "role": "Software Engineer",
        "image": "/images/dp.jpg",
        "review": "Exceptional service quality. The attention to detail and timely service from HelperBuddy was impressive.",
        "rating": 5,
        "date": "2 days ago",
        "verified": true
    },
    {
        "id": 2,
        "name": "Priya Patel",
        "role": "Product Designer",
        "image": "/images/dp.jpg",
        "review": "Fast, efficient, and very professional. Exactly what I needed. Highly recommend HelperBuddy for any service.",
        "rating": 5,
        "date": "1 week ago",
        "verified": true
    },
    {
        "id": 3,
        "name": "Ravi Kumar",
        "role": "Business Owner",
        "image": "/images/dp.jpg",
        "review": "The best service I've experienced in years. Highly recommended! HelperBuddy made it so easy to get professional help.",
        "rating": 4,
        "date": "3 days ago",
        "verified": true
    },
    {
        "id": 4,
        "name": "Neha Reddy",
        "role": "Marketing Director",
        "image": "/images/dp.jpg",
        "review": "Outstanding work ethic and results. Will definitely use HelperBuddy again for all my service needs.",
        "rating": 5,
        "date": "5 days ago",
        "verified": true
    },
    {
        "id": 5,
        "name": "Sandeep Mehta",
        "role": "Tech Consultant",
        "image": "/images/dp.jpg",
        "review": "Incredible attention to detail. They went above and beyond. Very impressed with HelperBuddy’s professional approach.",
        "rating": 5,
        "date": "1 week ago",
        "verified": true
    },
    {
        "id": 6,
        "name": "Ayesha Khan",
        "role": "Creative Director",
        "image": "/images/dp.jpg",
        "review": "Phenomenal service. They exceeded all my expectations. I’ll definitely continue to use HelperBuddy for my future needs.",
        "rating": 5,
        "date": "4 days ago",
        "verified": true
    }
];


export const Testimonials = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    What Our Clients Say
                </h2>

                <div className="relative rounded-[10px] overflow-hidden">
                    <div
                        className="flex gap-6 rounded-[10px] overflow-hidden"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div
                            className={`flex gap-6 animate-scroll ${isHovered ? 'pause-animation' : ''}`}
                        >
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="w-[300px] flex-shrink-0 rounded-xl bg-white/10 p-6 border border-white/10 hover:border-white/30 transition-all duration-300"
                                >
                                    {isLoading ? (
                                        // Skeleton Loading State
                                        <div className="animate-pulse">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white/20"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                                                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 mt-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-4 h-4 bg-white/20 rounded-full"></div>
                                                ))}
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                <div className="h-3 bg-white/20 rounded w-full"></div>
                                                <div className="h-3 bg-white/20 rounded w-2/3"></div>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="h-3 bg-white/20 rounded w-1/4"></div>
                                                <div className="h-3 bg-white/20 rounded w-1/3"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Actual Content
                                        <>
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    loading="lazy"
                                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                                                />
                                                <div>
                                                    <h3 className="text-white font-medium">{testimonial.name}</h3>
                                                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 mt-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < testimonial.rating
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-600'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="mt-4 text-white/80 text-sm line-clamp-3">
                                                "{testimonial.review}"
                                            </p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-white/40 text-xs">{testimonial.date}</span>
                                                {testimonial.verified && (
                                                    <span className="text-xs text-emerald-400/80">Verified Customer</span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[rgb(6,8,20)] to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[rgb(6,8,20)] to-transparent pointer-events-none"></div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .animate-scroll {
                    animation: scroll 30s linear infinite;
                    will-change: transform;
                }

                .pause-animation {
                    animation-play-state: paused;
                }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </div>
    );
};
