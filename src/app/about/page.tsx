"use client";
import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { motion } from "framer-motion";

const AboutUsPage = () => {
  // Team members data (with placeholder images)
  const teamMembers = [
    {
      name: "Jessica Chen",
      role: "CEO & Founder",
      image: "/images/dp.jpg",
    },
    {
      name: "David Wilson",
      role: "Chief Technology Officer",
      image: "/images/dp.jpg",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image: "/images/dp.jpg",
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Marketing Officer",
      image: "/images/dp.jpg",
    },
    {
      name: "Aisha Johnson",
      role: "Customer Experience Director",
      image: "/images/dp.jpg",
    },
    {
      name: "James Lee",
      role: "Partner Relations Manager",
      image: "/images/dp.jpg",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Background"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="relative container mx-auto px-6 md:px-8 py-20 md:py-32 max-w-6xl">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About Helper Buddy
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 mb-8">
              Transforming the way you experience home services.
            </p>
            <Button
              onClick={() => (window.location.href = "tel:9510514387")}
              className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 text-base rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Learn More About Our Services{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 md:py-20 container mx-auto px-6 md:px-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5">
              Who We Are
            </h2>
            <p className="text-gray-700 text-base md:text-lg mb-5">
              Helper Buddy is a technology platform offering a variety of
              services at home. Customers use our platform to book services such
              as beauty treatments, haircuts, massage therapy, cleaning,
              plumbing, carpentry, appliance repair, painting etc. These
              services are delivered in the comfort of their home and at a time
              of their choosing.
            </p>
            <p className="text-gray-700 text-base md:text-lg mb-6">
              We promise our customers a high quality, standardised and reliable
              service experience. To fulfill this promise, we work closely with
              our hand-picked service partners, enabling them with technology,
              training, products, tools, financing, insurance and brand, helping
              them succeed and deliver on this promise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => (window.location.href = "/provider")}
                className="bg-black hover:bg-gray-800 text-white px-5 py-2 text-sm md:text-base rounded-full transition-all duration-300 hover:shadow-md"
              >
                Join as a Partner
              </Button>
              <Button
                onClick={() => (window.location.href = "/services")}
                variant="outline"
                className="border-black text-black hover:bg-gray-100 px-5 py-2 text-sm md:text-base rounded-full transition-all duration-300"
              >
                Find Services
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-full z-0"></div>
            <img
              src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Team working together"
              className="rounded-lg shadow-xl relative z-10 w-full"
            />
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full z-0"></div>
          </motion.div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-8 max-w-6xl">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5">
              Our Vision
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl font-light italic mb-8">
              "Deliver home services and solutions like never experienced
              before."
            </p>
            <motion.div
              className="grid sm:grid-cols-3 gap-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants}>
                <Card className="text-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="pt-5 px-4 py-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-black" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg mb-2">
                      Quality Assurance
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Rigorous vetting and training ensures top-tier service
                      every time.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="text-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="pt-5 px-4 py-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-black" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg mb-2">
                      Convenience First
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Services delivered at your preferred time and location.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="text-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="pt-5 px-4 py-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-black" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg mb-2">
                      Partner Growth
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      We empower our partners with tools and training for
                      success.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
