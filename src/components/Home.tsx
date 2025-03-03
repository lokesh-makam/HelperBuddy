"use client";

// import { useCart } from "@/src/context/CartContext";
import {MotionWrapper} from "@/src/components/other/MotionWrapper";
import {SectionLayout} from "@/src/components/layout/sectionLayout";
import {Text} from "@/src/components/other/text";
import {Heading} from "@/src/components/other/head";
import {Testimonials} from "@/src/components/other/testimonials";
import {Stats} from "@/src/components/other/stats";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import FAQ from "@/src/components/other/FAQ";
import ApplianceRepair from "@/src/components/other/OurServices";
export default function Home() {
    // const { addToCart } = useCart(); // Use the useCart hook
    // const spaData = [
    //     {
    //         title: "Stress Relief",
    //         image: "https://via.placeholder.com/400x300?text=Stress+Relief",
    //         link: "#stress-relief",
    //     },
    //     {
    //         title: "Pain Relief",
    //         image: "https://via.placeholder.com/400x300?text=Pain+Relief",
    //         link: "#pain-relief",
    //     },
    //     {
    //         title: "Natural Skincare",
    //         image: "https://via.placeholder.com/400x300?text=Natural+Skincare",
    //         link: "#natural-skincare",
    //     },
    // ];
    // const services = [
    //     {
    //         id: 1,
    //         name: "AC Service and Repair",
    //         image: "/images/mai.png",
    //     },
    //     {
    //         id: 2,
    //         name: "Washing Machine Repair",
    //         image: "/images/mai.png",
    //     },
    //     {
    //         id: 3,
    //         name: "Water Purifier Repair",
    //         image: "/images/mai.png",
    //     },
    //     {
    //         id: 4,
    //         name: "Refrigerator Repair",
    //         image: "/images/mai.png",
    //     },
    //     {
    //         id: 5,
    //         name: "Microwave Repair",
    //         image: "/images/mai.png",
    //     },
    //     {
    //         id: 6,
    //         name: "TV Repair",
    //         image: "/images/mai.png",
    //     },  ];

    // Scroll animations for cards
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
                    <button
                        className="mt-6 px-8 md:px-12 py-3 text-base md:text-lg bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 ease-in-out"
                    >
                        Book Now
                    </button>
                </div>
            </SectionLayout>

            {/* Stats Section */}
            <section className="w-full bg-[rgb(6,8,20)] overflow-hidden" id="stats">
                <Stats />
            </section>

            {/* Services Section */}
            <section className="px-4 md:px-10 py-12 md:py-16 bg-gray-50" id="services">
                <ApplianceRepair/>
            </section>

            {/* Testimonials Section */}
            <section className="px-0 md:px-10 py-0 bg-[rgb(6,8,20)] text-white md:py-16 overflow-hidden" id="about">
                <div className="max-w-7xl  text-white mx-auto">
                    <Testimonials />
                </div>
            </section>

            <section className="w-full overflow-hidden" id="stats">
                <FAQ/>
            </section>

        </MotionWrapper>
    );
}