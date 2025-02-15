'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gray-900 text-white py-12 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* Section 1: Get in Touch */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-blue-500">Get in</span> Touch
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <FaMapMarkerAlt className="text-blue-500 text-xl" />
                            <p className="text-gray-300">
                                SVNIT, Ichchhanath,<br />
                                Surat, Gujarat 395007
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaPhoneAlt className="text-blue-500 text-xl" />
                            <p className="text-gray-300">+91 6359398479</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaEnvelope className="text-blue-500 text-xl" />
                            <p className="text-gray-300">hello@svnit.ac.in</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Quick Links */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Quick Links</h2>
                    <ul className="space-y-4">
                        <li>
                            <Link href="#" className="text-gray-300 hover:text-blue-500 transition duration-300">
                                Support Office
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="text-gray-300 hover:text-blue-500 transition duration-300">
                                Install Value
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="text-gray-300 hover:text-blue-500 transition duration-300">
                                Voyaways
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="text-gray-300 hover:text-blue-500 transition duration-300">
                                Sendring Support
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Section 3: Map */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Location</h2>
                    <iframe
                        className="w-full h-48 rounded-lg shadow-lg border-2 border-gray-700"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.304077025078!2d72.78198817506232!3d21.16708068050214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f13ed7e6b77%3A0x8bca226ed4a13b0e!2sSardar%20Vallabhbhai%20National%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1710209387326"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <Link href="#" className="text-blue-500 hover:text-blue-400 transition duration-300">
                        View larger map
                    </Link>
                </div>

                {/* Section 4: Social Media */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Follow Us</h2>
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-300 hover:text-blue-500 transition duration-300 text-2xl">
                            <FaFacebookF />
                        </Link>
                        <Link href="#" className="text-gray-300 hover:text-pink-500 transition duration-300 text-2xl">
                            <FaInstagram />
                        </Link>
                        <Link href="#" className="text-gray-300 hover:text-blue-700 transition duration-300 text-2xl">
                            <FaLinkedinIn />
                        </Link>
                        <Link href="#" className="text-gray-300 hover:text-gray-400 transition duration-300 text-2xl">
                            <FaTwitter />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                <p className="text-gray-400">
                    &copy; {new Date().getFullYear()} SVNIT. All rights reserved.
                </p>
                <p className="text-gray-400 mt-2">
                    Designed with ❤️ by Your Name
                </p>
            </div>
        </footer>
    );
};
