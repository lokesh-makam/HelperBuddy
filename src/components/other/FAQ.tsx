"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is HelperBuddy?",
      answer:
          "HelperBuddy is a cleaning service that helps keep your home and office clean. We also clean air conditioning units. Our goal is to make your spaces fresh and healthy.",
    },
    {
      question: "What cleaning services do you offer?",
      answer:
          "We offer a variety of cleaning services, including home cleaning, office cleaning, and AC cleaning. Whether you need a deep clean or regular maintenance, we’ve got you covered.",
    },
    {
      question: "How do I book a cleaning service?",
      answer:
          "Booking is easy! Just give us a call or fill out our online form. We’ll set up a time that works best for you.",
    },
    {
      question: "How much does your service cost?",
      answer:
          "The cost depends on the size of your home or office and the type of cleaning you need. We have options for every budget. For exact prices, check our pricing page or contact us.",
    },
    {
      question: "Is HelperBuddy the best cleaning service in India?",
      answer:
          "Many of our customers think so! We pride ourselves on quality service and customer satisfaction. Check our reviews to see what others are saying.",
    },
    {
      question: "How can I find good cleaning services near me?",
      answer:
          "If you're looking for reliable cleaning services nearby, HelperBuddy is the answer. We connect you with experienced cleaners who can handle everything from regular home cleaning to deep cleaning. Simply book through our platform, and we’ll send a trusted professional to your home.",
    },
  ];

  // Animation variants for framer-motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
      <div className="min-h-screen bg-[rgb(185_185_185_/_15%)] dark:bg-gray-900 text-gray-900 dark:text-white pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto"> {/* Reduced container width */}
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
                <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                  <div className="bg-black/10 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300">
                    <button
                        className="w-full flex justify-between items-center p-4 focus:outline-none"
                        onClick={() => toggleFAQ(index)}
                    >
                  <span className="text-lg font-semibold text-black dark:text-white text-center w-full"> {/* Centered question */}
                    {faq.question}
                  </span>
                      <span
                          className={`text-2xl transform transition-transform duration-300 ${
                              activeIndex === index ? "rotate-180" : "rotate-0"
                          }`}
                      >
                    {activeIndex === index ? "−" : "+"}
                  </span>
                    </button>
                    <div
                        className={`px-6 overflow-hidden transition-all duration-300 ${
                            activeIndex === index ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
                        }`}
                    >
                      <p className="text-gray-900 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default FAQ;