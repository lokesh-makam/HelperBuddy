"use client";

import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-[100vh] bg-gray-100 flex items-center justify-center">
      {/* Main Container with enhanced shadow */}
      <div className="w-full min-h-full bg-black shadow-[0px_8px_100px_rgba(0,0,0,0.6)] overflow-hidden flex transition-shadow duration-300 ease-in-out hover:shadow-[0px_10px_120px_rgba(0,0,0,0.7)]">
        {/* Left side - Image Section */}
        <div className="hidden lg:flex lg:w-1/2 relative p-6">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <img
              src="https://data.mactechnews.de/534230.jpg"
              alt="Desert at night"
              className="object-cover w-full h-full rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent rounded-xl" />
          </div>
          {/* Logo and Back button */}
          <div className="absolute top-12 left-12 right-12 flex justify-between items-center">
            <div className="text-white text-2xl font-bold">
              Helper <span className="text-gray-900">Buddy</span>
            </div>
            <Button
              variant="secondary"
              className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
            >
              <Link href="/" className="text-white ">Back to website</Link>
              <ArrowRight className="ml-2 h-4 w-4 text-white font-semibold" />
            </Button>
          </div>
          {/* Motivational Text */}
          <div className="absolute bottom-24 left-12 right-12">
            <h2 className="text-white text-4xl font-semibold leading-tight">
              Reliable, Fast & Affordable Services <br /> Your Helper Buddy is Just
              a Click Away
            </h2>
          </div>
        </div>
        {/* Right side - Form Section */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 xl:p-16 flex flex-col justify-center bg-black">
          <div className="max-w-[420px] mx-auto w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
