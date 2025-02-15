"use client";

import { useCart } from "@/src/context/CartContext";
import {MotionWrapper} from "@/src/components/other/MotionWrapper";
import {SectionLayout} from "@/src/components/layout/sectionLayout";
import {Button} from "@/src/components/ui/button";
import {Text} from "@/src/components/other/text";
import {Heading} from "@/src/components/other/head";
import {Testimonials} from "@/src/components/other/testimonials";
import {Stats} from "@/src/components/other/stats";
import { FaPaintBrush, FaTools, FaCouch, FaWrench, FaPlug, FaPalette } from "react-icons/fa";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function Home() {
    const { addToCart } = useCart();

    const services = [
        { id: "1", name: "Interior Design", price: 100, image: "https://picsum.photos/600/400?random=1", icon: <FaPaintBrush className="text-2xl text-blue-500" /> },
        { id: "2", name: "Home Renovation", price: 250, image: "https://picsum.photos/600/400?random=2", icon: <FaTools className="text-2xl text-blue-500" /> },
        { id: "3", name: "Custom Furniture", price: 150, image: "https://picsum.photos/600/400?random=3", icon: <FaCouch className="text-2xl text-blue-500" /> },
        { id: "4", name: "Plumbing Services", price: 80, image: "https://picsum.photos/600/400?random=4", icon: <FaWrench className="text-2xl text-blue-500" /> },
        { id: "5", name: "Electrical Repairs", price: 120, image: "https://picsum.photos/600/400?random=5", icon: <FaPlug className="text-2xl text-blue-500" /> },
        { id: "6", name: "Painting & Wall Decor", price: 200, image: "https://picsum.photos/600/400?random=6", icon: <FaPalette className="text-2xl text-blue-500" /> },
    ];

    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <MotionWrapper>
            {/* Hero Section */}
            <SectionLayout
                bg="url('/images/mai.png')"
                className="relative flex items-center justify-center min-h-screen"
            >
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10 flex flex-col items-center text-center text-white p-4 md:p-8 max-w-6xl mx-auto">
                    <Heading
                        as="h1"
                        intent="hero-section"
                        className="text-lg md:text-2xl text-white lg:text-4xl xl:text-5xl font-semibold"
                    >
                        Reliable, Fast & Affordable Services –{" "}
                        <span className="text-[#377DFF]">Helper Buddy</span> is Just a Click Away
                    </Heading>
                    <Text className="mt-4 md:text-lg lg:text-xl text-white">
                        Expert Help, Right at Your Doorstep
                    </Text>
                    <Button className="mt-6 px-8 md:px-12 py-3 text-base md:text-lg bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 ease-in-out">
                        Book Now
                    </Button>
                </div>
            </SectionLayout>

            {/* Stats Section */}
            <section className="w-full overflow-hidden" id="stats">
                <Stats />
            </section>

            {/* Services Section */}
            <section className="px-4 md:px-10 py-12 md:py-16 bg-gray-50" id="services">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-4xl font-bold text-gray-900 mb-10 text-center">
                        Our Services
                    </h3>
                    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                className="bg-white/20 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 border border-white/10"
                                variants={cardVariants}
                                initial="hidden"
                                animate={controls}
                                custom={index}
                            >
                                {/* Service Image */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                                </div>

                                {/* Service Details */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        {service.icon}
                                        <h4 className="text-2xl font-semibold text-gray-900">
                                            {service.name}
                                        </h4>
                                    </div>
                                    <p className="text-gray-700 text-lg mb-4">
                                        ₹{service.price}
                                    </p>
                                    <button
                                        onClick={() => addToCart(service)} // Add to cart
                                        className="w-full bg-black text-white px-6 py-3 rounded-md transition-all duration-300 ease-in-out hover:bg-gray-800 hover:scale-105"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* View More Button */}
                    <motion.div
                        className="flex justify-center mt-12"
                        variants={cardVariants}
                        initial="hidden"
                        animate={controls}
                    >
                        <Link
                            href="/services" // Redirect to /services
                            className="px-8 py-3 bg-blue-500 text-white rounded-md transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 backdrop-blur-lg bg-white/20 border border-white/10"
                        >
                            View More
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="px-4 md:px-10 py-12 md:py-16 overflow-hidden" id="about">
                <div className="max-w-7xl mx-auto">
                    <Testimonials />
                </div>
            </section>
        </MotionWrapper>
    );
}