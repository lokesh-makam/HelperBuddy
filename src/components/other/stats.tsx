"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const stats = [
    { value: 5000, label: "Revenue", prefix: "$" },
    { value: 10, label: "Products", prefix: "" },
    { value: 150, label: "Components", prefix: "$" },
    { value: 10, label: "Employees", prefix: "" },
];

const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(0)}K` : num.toString();
};

const Counter = ({ value, prefix, startCounting }: { value: number; prefix: string; startCounting: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!startCounting) return; // Start counting only when in view

        let start = 0;
        const end = value;
        const duration = 1000; // 2 seconds duration
        const intervalTime = 20;
        const increment = (end - start) / (duration / intervalTime);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                clearInterval(timer);
                start = end;
            }
            setCount(Math.round(start));
        }, intervalTime);

        return () => clearInterval(timer);
    }, [startCounting, value]);

    return (
        <motion.span
            className="text-3xl md:text-4xl font-extrabold text-blue-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            {prefix}{formatNumber(count)}+
        </motion.span>
    );
};

export const Stats = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

    return (
        <section
            ref={ref}
            className="w-full py-12 md:py-16 bg-[rgb(6,8,20)] text-white text-center px-4"
        >
            <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Over 8000+ Projects Completed
            </motion.h2>
            <motion.p
                className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto provident omnis.
            </motion.p>

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                    >
                        <Counter value={stat.value} prefix={stat.prefix} startCounting={inView} />
                        <p className="text-gray-300 text-base mt-3">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
