import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {ClerkProvider} from "@clerk/nextjs";
import {ToastContainer} from "react-toastify";
import ProgressProvider from "@/src/components/ProgressSidebar";
import {Navbar} from "@/src/components/navbar";
import {CartProvider} from "@/src/context/CartContext";
import {Footer} from "@/src/components/other/footer";
import Providers from "../components/other/queryprovider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helper Buddy",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ClerkProvider>
          <Providers>
          <ToastContainer
              position="top-right"
              autoClose={3000} // 3 seconds
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
            <div className="flex-1">
              <Navbar />
              {children}
              <Footer/>
            </div>
          </CartProvider>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
