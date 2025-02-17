"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const reviews = [
    { author: "Alice Johnson", text: "Absolutely amazing! Highly recommended.", rating: 5, image: "/profile-placeholder.png" },
    { author: "Mark Smith", text: "Great experience, will definitely come back!", rating: 4, image: "/profile-placeholder.png" },
    { author: "Emily Davis", text: "A must-visit! Everything was top-notch.", rating: 5, image: "/profile-placeholder.png" },
    { author: "John Doe", text: "Incredible service and fantastic atmosphere.", rating: 5, image: "/profile-placeholder.png" },
    { author: "Sophia Lee", text: "Loved every moment! 10/10.", rating: 4.5, image: "/profile-placeholder.png" },
];

export const Testimonials = () => {
    const [isMounted, setIsMounted] = useState(false);
    const scrollerRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden bg-white py-10 px-4 md:px-8">
            <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                What Our Customers Say
            </h2>

            <div className="relative w-full overflow-hidden">
                <ul
                    ref={scrollerRef}
                    className={`flex flex-nowrap gap-4 whitespace-nowrap ${
                        isMounted ? "animate-marquee" : "invisible"
                    }`}
                >
                    {[...reviews, ...reviews].map((review, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: (idx % reviews.length) * 0.2, type: "spring", damping: 10, stiffness: 100 }}
                            className="relative w-[80%] sm:w-[60%] md:w-[45%] lg:w-[30%] flex-shrink-0 rounded-2xl bg-white p-6 shadow-xl border border-gray-300"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={review.image}
                                    alt={review.author}
                                    className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                                />
                                <div>
                                    <span className="text-lg font-bold text-gray-900">{review.author}</span>
                                    <p className="text-yellow-500 text-sm">⭐ {review.rating}/5</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
                                "{review.text}"
                            </p>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Gradient Fade Effect */}
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent"></div>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }
      `}</style>
        </div>
    );
};