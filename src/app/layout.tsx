"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import ProgressProvider from "@/src/components/ProgressSidebar";
import { Navbar } from "@/src/components/navbar";
import { CartProvider } from "@/src/context/CartContext";
import Providers from "../components/other/queryprovider";
import NavbarWrapper from "@/src/components/NavbarWrapper";
import { getuser } from "@/src/actions/user";
import { useRouter } from "next/navigation";
import Loading from "@/src/app/loading";
import { Analytics } from "@vercel/analytics/next";

// Correctly import Footer
const Footer = dynamic(
  () => import("@/src/components/other/footer").then((mod) => mod.Footer),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Helper Buddy",
//   description: "",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showFooter, setShowFooter] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFooter(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ClerkProvider>
          <Providers>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <CartProvider>
              <ProgressProvider />
              <div className="flex-1 flex flex-col">
                <NavbarWrapper />
                <main className="flex-1">
                  {children}
                  <Analytics />
                </main>
              </div>
              {showFooter && (
                <div className="transition-opacity duration-500 ease-in-out opacity-100">
                  <Footer />
                </div>
              )}
            </CartProvider>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
