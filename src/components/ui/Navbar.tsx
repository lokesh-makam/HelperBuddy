"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CartSidebar from "@/src/components/CartSidebar";
import { useCart } from "@/src/context/CartContext";
import {UserButton, useUser} from "@clerk/nextjs"; // Importing cart context
const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart(); // Getting cart items from context

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  const { isSignedIn } = useUser();
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="sticky top-0 h-[10vh] w-full bg-black bg-opacity-90 backdrop-blur-lg shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="cursor-pointer">
            <Image
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=320,fit=crop,q=95/AzGeNv8QxRTqXJan/20241226_222044-AwvDvRazrEUZ8ZMp.png"
              alt="logo-helper-buddy"
              width={120}
              height={50}
              className="object-contain"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              key="Home"
              href="/"
              className="text-white font-medium hover:text-gray-400 transition-colors duration-300 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {["Blog"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-white font-medium hover:text-gray-400 transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            <button
              onClick={() => scrollToSection("about")}
              className="text-white font-medium hover:text-gray-400 transition-colors duration-300 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-white font-medium hover:text-gray-400 transition-colors duration-300 relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>

            {/* Services Button with Smooth Scroll */}
            <button
              onClick={() => scrollToSection("services")}
              className="text-white font-medium hover:text-gray-400 transition-colors duration-300 relative group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>

            {/* Login Button */}
            {isSignedIn ? (
        <button
          onClick={() => signOut()}
          className="text-white font-medium hover:text-gray-400 transition-colors duration-300 relative group"
        >
          Logout
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
        </button>
      ) : (
        <Link
          href="/login"
          className="text-white font-medium hover:text-gray-400 transition-colors duration-300 relative group"
        >
          Login
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
        </Link>
      )}
          </div>
          <UserButton afterSignOutUrl="/sign-in" />
          {/* Cart and Login Buttons */}
          <div className="flex items-center space-x-6">
            {/* Cart Button with Badge */}
            <div className="relative">
              <button
                onClick={toggleCart}
                className="text-white hover:text-gray-400 transition-colors duration-300 relative"
              >
                <ShoppingCart size={28} />
                {/* Cart Badge */}
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
