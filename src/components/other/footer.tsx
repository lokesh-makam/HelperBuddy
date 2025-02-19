'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Section 1: Get in Touch */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-blue-500">Get in</span> Touch
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <FaMapMarkerAlt className="text-blue-500 text-xl mt-1 flex-shrink-0" />
                            <p className="text-gray-300">
                                Amroli Cross Rd, near Santosh Electronics,<br />
                                Bhagu Nagar-1, Amroli,<br />
                                Surat, Gujarat 394107
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaPhoneAlt className="text-blue-500 text-xl flex-shrink-0" />
                            <p className="text-gray-300">+91 6359398479</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaEnvelope className="text-blue-500 text-xl flex-shrink-0" />
                            <p className="text-gray-300">hello@helperbuddy.in</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Quick Links */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Quick Links</h2>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/services" className="text-gray-300 hover:text-blue-500 transition duration-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="text-gray-300 hover:text-blue-500 transition duration-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="text-gray-300 hover:text-blue-500 transition duration-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/provider" className="text-gray-300 hover:text-blue-500 transition duration-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Register as a Provider
                            </Link>
                        </li>
                    </ul>

                    {/* Follow Us section moved here and centered */}

                </div>

                {/* Section 3: Map (horizontal layout with consistent height) */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Location</h2>
                    <div className="relative h-56 w-full rounded-lg overflow-hidden shadow-lg border-2 border-gray-700">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.727889356322!2d72.84831267604505!3d21.239818980676194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f19b1cbca6f%3A0x7b5cd817dc032251!2sAmroli%20Cross%20Rd%2C%20Bhagu%20Nagar-1%2C%20Amroli%2C%20Surat%2C%20Gujarat%20394107!5e0!3m2!1sen!2sin!4v1708416452987!5m2!1sen!2sin"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <div className="flex justify-start items-center">
                        <Link href="https://www.google.com/maps/search/Amroli+Cross+Rd,+near+Santosh+Electronics,+Bhagu+Nagar-1,+Amroli,+Surat,+Gujarat+394107/@21.239819,72.85002,13z?hl=en-GB&entry=ttu"
                              className="text-blue-500 hover:text-blue-400 transition duration-300 underline"
                              target="_blank" rel="noopener noreferrer">
                            View larger map
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-800 mt-8  text-center">
                <div className="space-y-4 mt-4">
                    <h3 className="text-lg font-semibold text-white">Follow Us</h3>
                    <div className="flex justify-center gap-6">
                        <Link href="https://www.facebook.com/people/Helper-Buddy/" className="text-gray-300 hover:text-blue-500 transition-all duration-300 transform hover:scale-110">
                            <FaFacebookF className="text-xl" />
                        </Link>
                        <Link href="https://www.instagram.com/helperbuddy.in/" className="text-gray-300 hover:text-pink-500 transition-all duration-300 transform hover:scale-110">
                            <FaInstagram className="text-xl" />
                        </Link>
                        <Link href="https://www.linkedin.com/company/helperbuddy/" className="text-gray-300 hover:text-blue-700 transition-all duration-300 transform hover:scale-110">
                            <FaLinkedinIn className="text-xl" />
                        </Link>
                        <Link href="https://x.com/helperbuddyin" className="text-gray-300 hover:text-blue-400 transition-all duration-300 transform hover:scale-110">
                            <FaTwitter className="text-xl" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};