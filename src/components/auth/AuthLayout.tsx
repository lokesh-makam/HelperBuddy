"use client";

import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Logo} from "@/src/components/assets/logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[85vw] min-h-[650px] flex bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-in-out hover:shadow-[0_20px_80px_-10px_rgba(0,0,0,0.3)]">
          {/* Left side - Visual Section */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <div className="absolute inset-0 w-full h-full">
              {/* Using next/image for performance */}
              <div className="relative w-full h-full">
                <Image
                    src="https://scrubnbubbles.com/wp-content/uploads/2020/08/house-cleaning-services.jpg"
                    alt=""
                    fill
                    sizes="50vw"
                    priority
                    className="object-cover rounded-l-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-l-2xl" />
              </div>
            </div>

            {/* Logo & Navigation */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <div className="bg-transparent rounded-full">
                  <Image
                      src="/images/main.ico"
                      alt="Helper Buddy Icon"
                      width={40}
                      height={40}
                      className="object-contain"
                  />
                </div>
                <div className="text-white text-2xl font-semibold">
                  Helper<span className="text-indigo-400">Buddy</span>
                </div>
              </div>
              <Button
                  variant="secondary"
                  className="bg-black/50 hover:bg-black/50 text-white border border-white/30"
              >
                <Link href="/" className="flex items-center gap-2">
                  Back to website
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Motivation Text */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <h2 className="text-white text-4xl font-bold leading-tight mb-4">
                Reliable, Fast & <span className="text-indigo-300">Affordable</span>
              </h2>
              <p className="text-white/80 text-lg max-w-md">
                Your Helper Buddy is just a click away, ready to provide exceptional service whenever you need it.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs">JD</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs">MK</div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white text-xs">RB</div>
                </div>
                <p className="text-white/70 text-sm">Join 10,000+ satisfied customers</p>
              </div>
            </div>
          </div>

          {/* Right side - Form Area */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            {/* Mobile logo - visible only on mobile */}

            <div className="max-w-md mx-auto w-full">
              {children}
            </div>

            {/* Footer links - only visible on mobile and tablet */}
            <div className="mt-8 text-center lg:hidden">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Link href="/">Back to website</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}