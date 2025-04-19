'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import {getHomepageReviews, getReviews} from "@/src/actions/review";
import Loading from "@/src/app/loading";

export const Testimonials = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [testimonials,setReviews] = useState([]);
    useEffect(() => {
        const fun = async () => {
            const data=await getHomepageReviews();
            if(data?.success){
                console.log(data.data)
                setReviews(data.data);
                setIsLoading(false)
            }
        }
        fun()
    }, []);
    if(isLoading){
        return <Loading/>
    }
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
                            {testimonials.map((testimonial:any, index) => (
                                <motion.div
                                    key={testimonial.reviewId}
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
                                                    src={"/images/dp.jpg"}
                                                    alt={testimonial.name}
                                                    loading="lazy"
                                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                                                />
                                                <div>
                                                    <h3 className="text-white font-medium">{testimonial.review.serviceRequest.firstName.charAt(0).toUpperCase() + testimonial.review.serviceRequest.firstName.slice(1).toLowerCase()} {testimonial.review.serviceRequest.lastName.charAt(0).toUpperCase() + testimonial.review.serviceRequest.lastName.slice(1).toLowerCase()}</h3>
                                                    <p className="text-white/60 text-sm">{testimonial.review.serviceRequest.service.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 mt-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < testimonial.review.rating
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-600'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="mt-4 text-white/80 text-sm line-clamp-3">
                                                "{testimonial.review.review}"
                                            </p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-white/40 text-xs">{testimonial.date}</span>
                                                <span className="text-xs text-emerald-400/80">Verified Customer</span>
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