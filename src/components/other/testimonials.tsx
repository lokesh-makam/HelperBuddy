'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
    {
        id: 1,
        name: "Alex Morrison",
        role: "Software Engineer",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
        review: "Exceptional service quality. The attention to detail was impressive.",
        rating: 5,
        date: "2 days ago",
        verified: true
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Product Designer",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        review: "Fast, efficient, and very professional. Exactly what I needed.",
        rating: 5,
        date: "1 week ago",
        verified: true
    },
    {
        id: 3,
        name: "James Wilson",
        role: "Business Owner",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        review: "The best service I've experienced in years. Highly recommended!",
        rating: 4,
        date: "3 days ago",
        verified: true
    },
    {
        id: 4,
        name: "Emily Rodriguez",
        role: "Marketing Director",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        review: "Outstanding work ethic and results. Will definitely use again.",
        rating: 5,
        date: "5 days ago",
        verified: true
    },
    {
        id: 5,
        name: "David Kim",
        role: "Tech Consultant",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        review: "Incredible attention to detail. They went above and beyond.",
        rating: 5,
        date: "1 week ago",
        verified: true
    },
    {
        id: 6,
        name: "Lisa Thompson",
        role: "Creative Director",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        review: "Phenomenal service. They exceeded all my expectations.",
        rating: 5,
        date: "4 days ago",
        verified: true
    }
];

export const Testimonials = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="w-full  py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    What Our Clients Say
                </h2>

                <div className="relative rounded-[10px] overflow-hidden">
                    <div
                        className="flex gap-6  rounded-[10px] overflow-hidden"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div
                            className={`flex gap-6 animate-scroll ${isHovered ? 'pause-animation' : ''}`}
                        >
                            {[...testimonials, ...testimonials].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="w-[300px] flex-shrink-0 rounded-xl  bg-white/10 p-6 border border-white/10 hover:border-white/30 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
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
        }

        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};
