"use client";

import { motion } from "framer-motion";

export function MotionWrapper({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full"
        >
        {children}
        </motion.div>
);
}
