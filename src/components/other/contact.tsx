'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import {contactUs} from "@/src/actions/contact";
import {toast} from "react-toastify";

export const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        const res=await contactUs({ fullName: formData.name, email: formData.email, message: formData.message });
        if(res.success) toast.success(res.success);
        else toast.error(res.error);
        console.log('Form Submitted:', formData);
    };

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 pt-24">
            {/* Added pt-24 to push content below navbar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring', damping: 10, stiffness: 100 }}
                className="w-full max-w-6xl bg-gray-100 rounded-lg shadow-lg p-6 md:p-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-center">Contact Us</h2>
                <p className="text-center text-gray-600 mt-2">We’d love to hear from you! Drop us a message.</p>

                {/* Responsive Layout */}
                <div className="flex flex-col md:flex-row gap-8 mt-8">
                    {/* Contact Form */}
                    <motion.form
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        onSubmit={handleSubmit}
                        className="flex-1 space-y-4"
                    >
                        <div>
                            <label className="text-gray-700 font-semibold">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            />
                        </div>
                        <div>
                            <label className="text-gray-700 font-semibold">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            />
                        </div>
                        <div>
                            <label className="text-gray-700 font-semibold">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Enter your message"
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-gray-800 transition duration-300"
                        >
                            Send Message
                        </button>
                    </motion.form>

                    {/* Contact Details */}
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.3}}
                        className="flex-1 space-y-6"
                    >
                        <div className="flex items-center space-x-4">
                            <FaMapMarkerAlt className="text-black text-2xl"/>
                            <div>
                                <p className="text-gray-800 font-semibold">Address</p>
                                <p className="text-gray-600">Amroli Cross Rd, near Santosh Electronics,</p>
                                <p className="text-gray-600">Bhagu Nagar-1, Amroli, Surat, Gujarat 394107</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaPhone className="text-black text-2xl"/>
                            <div>
                                <p className="text-gray-800 font-semibold">Phone</p>
                                <p className="text-gray-600">+91 63593 98479</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaEnvelope className="text-black text-2xl"/>
                            <div>
                                <p className="text-gray-800 font-semibold">Email</p>
                                <p className="text-gray-600">hello@helperbuddy.in</p>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex space-x-6">
                            <a href="https://www.facebook.com/people/Helper-Buddy/"
                               className="text-gray-600 hover:text-black transition duration-300">
                                <FaFacebook size={24}/>
                            </a>
                            <a href="https://x.com/helperbuddyin"
                               className="text-gray-600 hover:text-black transition duration-300">
                                <FaTwitter size={24}/>
                            </a>
                            <a href="https://www.instagram.com/helperbuddy.in/"
                               className="text-gray-600 hover:text-black transition duration-300">
                                <FaInstagram size={24}/>
                            </a>
                            <a href="https://www.linkedin.com/company/helperbuddy/"
                               className="text-gray-600 hover:text-black transition duration-300">
                                <FaLinkedin size={24}/>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};
