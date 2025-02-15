"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/src/components/ui/Navbar";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { DM_Sans, Playfair_Display } from "next/font/google";

// Fonts
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Sample Team Data
const teamMembers = [
  { name: "Amit Sharma", role: "Founder & CEO", img: "/team1.jpg" },
  { name: "Neha Verma", role: "Head of Operations", img: "/team2.jpg" },
  { name: "Rahul Mehta", role: "Lead Technician", img: "/team3.jpg" },
  { name: "Pooja Singh", role: "Customer Relations", img: "/team4.jpg" },
];

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-white to-gray-500 text-black">
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="container mx-auto px-6 py-24"
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className={`text-6xl font-bold text-gray-900 ${playfair.className}`}>
              Cleaner Spaces, Happier Places
            </h1>
            <h2 className={`text-3xl font-semibold text-gray-700 mt-4 ${dmSans.className}`}>
              Eco-Friendly Solutions, Expertly Delivered
            </h2>
            <p className={`text-gray-600 mt-6 text-lg ${dmSans.className}`}>
              HelperBuddy offers professional house, office, and AC cleaning services across India.
              Our expert team ensures your spaces are spotless, fresh, and well-maintained.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="inline-block mt-6"
            >
              <Link
                href="/"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg inline-block hover:bg-gray-700 transition-colors duration-300"
              >
                Explore Our Services
              </Link>
            </motion.div>
          </div>

          {/* Images Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-2 gap-4"
          >
            {["/img1.jpg", "/img2.jpg"].map((src, index) => (
              <Image
                key={index}
                src={src}
                alt="Service Image"
                width={400}
                height={300}
                className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="container mx-auto px-6 py-16 bg-black shadow-lg rounded-lg text-center"
      >
        <h2 className={`text-4xl font-bold text-gray-400 mb-6 ${playfair.className}`}>
          Why Choose Us?
        </h2>
        <p className={`text-gray-300 text-lg ${dmSans.className}`}>
          We prioritize quality, affordability, and eco-friendly solutions.
          Whether it’s deep cleaning, repairs, or maintenance, we’ve got you covered.
        </p>
      </motion.div>

      {/* Meet Our Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="container mx-auto px-6 py-16 text-center "
      >
        <h2 className={`text-4xl font-bold text-gray-900 mb-6 ${playfair.className}`}>
          Meet Our Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-full shadow-lg p-6 flex flex-col items-center text-center w-[220px] h-[220px] mx-auto"
            >
              <Image
                src={member.img}
                alt={member.name}
                width={120}
                height={120}
                className="rounded-full border-4 border-gray-300"
              />
              <h3 className={`text-lg font-semibold mt-3 ${playfair.className}`}>{member.name}</h3>
              <p className={`text-gray-600 text-sm ${dmSans.className}`}>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Follow Us Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
        className="container mx-auto px-6 py-16 text-center"
      >
        <h2 className={`text-3xl font-bold text-gray-800 mb-6 ${playfair.className}`}>
          Follow Us
        </h2>
        <motion.div
          className="flex justify-center space-x-6"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {[
            ["Facebook", "https://www.facebook.com"],
            ["Instagram", "https://www.instagram.com"],
            ["LinkedIn", "https://www.linkedin.com"],
            ["Twitter", "https://x.com"],
          ].map(([name, url], index) => {
            const Icon =
              name === "Facebook" ? Facebook : name === "Instagram" ? Instagram : name === "LinkedIn" ? Linkedin : Twitter;
            return (
              <motion.a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
                className="hover:scale-110 transition-transform duration-300"
              >
                <Icon className="text-gray-800 hover:text-gray-600 transition-colors duration-300" size={40} />
              </motion.a>
            );
          })}
        </motion.div>
        </motion.div>
    </div>
  );
};

export default AboutUsPage;
