"use client"
import React from 'react';
import { ArrowRight, CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { motion } from 'framer-motion';

const AboutUsPage = () => {
    // Team members data (with placeholder images)
    const teamMembers = [
        {
            name: "Jessica Chen",
            role: "CEO & Founder",
            image: "https://randomuser.me/api/portraits/women/32.jpg",
        },
        {
            name: "David Wilson",
            role: "Chief Technology Officer",
            image: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        {
            name: "Priya Sharma",
            role: "Head of Operations",
            image: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        {
            name: "Michael Rodriguez",
            role: "Chief Marketing Officer",
            image: "https://randomuser.me/api/portraits/men/36.jpg",
        },
        {
            name: "Aisha Johnson",
            role: "Customer Experience Director",
            image: "https://randomuser.me/api/portraits/women/46.jpg",
        },
        {
            name: "James Lee",
            role: "Partner Relations Manager",
            image: "https://randomuser.me/api/portraits/men/22.jpg",
        },
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
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
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Helper Buddy</h1>
                        <p className="text-lg md:text-xl lg:text-2xl opacity-90 mb-8">Transforming the way you experience home services.</p>
                        <Button className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 text-base rounded-full transition-all duration-300 hover:shadow-lg">
                            Learn More About Our Services <ArrowRight className="ml-2 h-4 w-4" />
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
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5">Who We Are</h2>
                        <p className="text-gray-700 text-base md:text-lg mb-5">
                            Helper Buddy is a technology platform offering a variety of services at home. Customers use our platform to book services such as beauty treatments, haircuts, massage therapy, cleaning, plumbing, carpentry, appliance repair, painting etc. These services are delivered in the comfort of their home and at a time of their choosing.
                        </p>
                        <p className="text-gray-700 text-base md:text-lg mb-6">
                            We promise our customers a high quality, standardised and reliable service experience. To fulfill this promise, we work closely with our hand-picked service partners, enabling them with technology, training, products, tools, financing, insurance and brand, helping them succeed and deliver on this promise.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button className="bg-black hover:bg-gray-800 text-white px-5 py-2 text-sm md:text-base rounded-full transition-all duration-300 hover:shadow-md">
                                Join as a Partner
                            </Button>
                            <Button variant="outline" className="border-black text-black hover:bg-gray-100 px-5 py-2 text-sm md:text-base rounded-full transition-all duration-300">
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
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5">Our Vision</h2>
                        <p className="text-lg md:text-xl lg:text-2xl font-light italic mb-8">
                            "Deliver home services and solutions like never experienced before."
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
                                        <h3 className="font-semibold text-base md:text-lg mb-2">Quality Assurance</h3>
                                        <p className="text-gray-600 text-sm md:text-base">Rigorous vetting and training ensures top-tier service every time.</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Card className="text-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                                    <CardContent className="pt-5 px-4 py-4">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-black" />
                                        </div>
                                        <h3 className="font-semibold text-base md:text-lg mb-2">Convenience First</h3>
                                        <p className="text-gray-600 text-sm md:text-base">Services delivered at your preferred time and location.</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Card className="text-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                                    <CardContent className="pt-5 px-4 py-4">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-black" />
                                        </div>
                                        <h3 className="font-semibold text-base md:text-lg mb-2">Partner Growth</h3>
                                        <p className="text-gray-600 text-sm md:text-base">We empower our partners with tools and training for success.</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Our Team Section */}
            <section className="py-16 md:py-20 container mx-auto px-6 md:px-8 max-w-6xl">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Our Team</h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                        Meet the passionate individuals behind Helper Buddy who work tirelessly to revolutionize the home service experience.
                    </p>
                </motion.div>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 px-12 lg:grid-cols-3 gap-5 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {teamMembers.map((member, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                                <div className="h-48 md:h-56 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <CardContent className="p-4 md:p-5">
                                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                                    <p className="text-gray-500 font-medium text-sm mb-2">{member.role}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Contact Section */}
            <section className="py-16 md:py-20 bg-black text-white">
                <div className="container mx-auto px-6 md:px-8 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5">Get in Touch</h2>
                            <p className="text-gray-300 text-base md:text-lg mb-6">
                                Have questions about our services or interested in becoming a service partner? Reach out to us - we'd love to hear from you.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                                    <span className="text-sm md:text-base">Amroli Cross Rd, near Santosh Electronics,Bhagu Nagar-1, Amroli, Surat, Gujarat 394107</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                                    <span className="text-sm md:text-base">+91 63593 98479</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                                    <span className="text-sm md:text-base">hello@helperbuddy.in</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="bg-white text-black p-6 md:p-7 rounded-lg shadow-xl"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <h3 className="text-xl md:text-2xl font-bold mb-4">Send Us a Message</h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Your message here..."
                                    ></textarea>
                                </div>
                                <Button className="w-full bg-black hover:bg-gray-800 text-white py-2.5 text-sm rounded-md transition-all duration-300 hover:shadow-md">
                                    Send Message
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;