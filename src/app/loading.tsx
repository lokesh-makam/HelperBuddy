"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
          className="relative w-20 h-20 md:w-24 md:h-24 mb-4"
        >
          <Image
            src="/images/main.ico"
            alt="Helper Buddy"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.3, duration: 0.5 },
          }}
          className="text-xl md:text-2xl font-semibold text-center mb-4"
        >
          Helper Buddy
        </motion.h1>

        <div className="flex space-x-2">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
