"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/context/CartContext";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";
import {useUser} from "@clerk/nextjs";
import {useEffect} from "react";
import {saveUserToDatabase} from "@/src/actions/user";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Home() {
  const { user, isLoaded } = useUser();
  useEffect(() => {
    const handleUserCheck = async () => {
      if (!isLoaded||!user) return;
      await saveUserToDatabase({
        password: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstname: user.firstName || "",
        lastname: user.lastName || "",
      });
    };
    handleUserCheck();
  }, [isLoaded, user]);
  const { addToCart } = useCart();

  const services = [
    { id: "1", name: "Interior Design", price: 100 },
    { id: "2", name: "Home Renovation", price: 250 },
    { id: "3", name: "Custom Furniture", price: 150 },
    { id: "4", name: "Plumbing Services", price: 80 },
    { id: "5", name: "Electrical Repairs", price: 120 },
    { id: "6", name: "Painting & Wall Decor", price: 200 },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-300 via-white to-gray-500 text-black">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center px-10 py-24 gap-10 max-w-7xl mx-auto">
        <div className="relative z-10 w-full">
          <h2
            className={`text-7xl md:text-7xl pt-10 font-bold leading-tight text-gray-900 ${playfair.className}`}
          >
            Expert Cleaning & Repairs
            <span className="text-blue-600"> just a click away!</span>
          </h2>
          <p className={`mt-4 text-gray-700 text-lg ${dmSans.className}`}>
            Reliable, affordable, and hassle-free home services.
          </p>
          <div className="mt-6 flex space-x-4">
            <Button
              className="bg-black text-white px-6 py-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-800 hover:scale-105"
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Our Services
            </Button>
           
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full md:w-1/2 flex justify-end">
          <Image
            src="https://images.squarespace-cdn.com/content/v1/576994f5c534a5457e4c0e9b/1602133687259-SMK5R6CDQC5BQO9A82WJ/Anahita+Shishir-0089.jpg?format=1000w"
            alt="Interior Design"
            width={500}
            height={500}
            className="rounded-lg shadow-2xl bg-black opacity-90 transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      </section>

      {/* About Us Section */}
      <section className="px-10 py-16" id="about">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-2xl"
        >
          <h3
            className={`text-3xl font-bold text-gray-900 ${playfair.className}`}
          >
            About Helper Buddy
          </h3>
          <p className={`text-gray-700 mt-4 text-lg ${dmSans.className}`}>
            At Helper Buddy, we are committed to making home maintenance easier
            for you. Whether it's cleaning, repairs, or home improvement, our
            team of skilled professionals ensures top-notch service with just a
            click. Your comfort is our priority.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-700 hover:scale-105"
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-10 py-20">
        <h3
          className={`text-4xl font-bold text-gray-900 mb-10 text-center ${playfair.className}`}
        >
          Our Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }} // Alternating direction
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-gray-100 shadow-lg p-6 rounded-lg text-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
            >
              <h4
                className={`text-2xl font-semibold text-gray-900 ${playfair.className}`}
              >
                {service.name}
              </h4>
              <p className={`text-gray-700 mt-2 text-lg ${dmSans.className}`}>
              ₹{service.price}
              </p>
              <button
                onClick={() => addToCart(service)}
                className="mt-6 bg-black text-white px-6 py-3 rounded transition-all duration-300 ease-in-out hover:bg-gray-800 hover:scale-105"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>

        {/* More Services Button */}
        <div className="flex justify-center mt-12">
          <Link
            href="/services"
            className="bg-white border-2 border-black text-black px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-105"
          >
            More Services
          </Link>
        </div>
      </section>

      <section id="contact" className="px-10 py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className={`text-4xl font-bold ${playfair.className}`}>
            Contact Us
          </h3>
          <p className={`mt-4 text-lg text-gray-300 ${dmSans.className}`}>
            Have any questions or need assistance? Reach out to us!
          </p>
          <form className="mt-8 space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:border-white transition-all duration-300 ease-in-out"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:border-white transition-all duration-300 ease-in-out"
            />
            <textarea
              placeholder="Your Message"
              className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:border-white transition-all duration-300 ease-in-out"
              rows={4}
            ></textarea>
            <button
              type="submit"
              className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-gray-300 hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
