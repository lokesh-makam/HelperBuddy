"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Handshake, Smile, ListChecks, Truck } from "lucide-react";
import { getStats } from "@/src/actions/user";
import Loading from "@/src/app/loading";
const iconMap = {
  handshake: <Handshake className="w-6 h-6 text-blue-600" />,
  smile: <Smile className="w-6 h-6 text-emerald-600" />,
  listChecks: <ListChecks className="w-6 h-6 text-purple-600" />,
  truck: <Truck className="w-6 h-6 text-amber-600" />,
};

const Counter = ({
  value,
  label,
  description,
  icon,
  color,
  startCounting,
}: {
  value: number;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  startCounting: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let start = 0;
    const end = value;
    const duration = 1500;
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
    <motion.div
      className="flex flex-col items-center p-8 bg-white/70 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${color} mb-4`}
      >
        {icon}
      </div>
      <motion.span
        className="text-4xl font-bold text-gray-900 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {count}+
      </motion.span>
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{label}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

export const Stats = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [loading, setloading] = useState(true);
  const [stats, setstats] = useState([]);
  useEffect(() => {
    const fun = async () => {
      const data = await getStats();
      setstats(data);
      setloading(false);
    };
    fun();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <section
      ref={ref}
      className="w-full py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trust in Numbers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Become part of our growing community of happy customers who trust us
            time and again
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Counter
              key={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              icon={iconMap[stat.icon as keyof typeof iconMap]}
              color={stat.color}
              startCounting={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
