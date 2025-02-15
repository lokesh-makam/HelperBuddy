"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/src/components/assets/logo";
import { HamburgerMenu, UserIcon } from "@/src/components/assets/svg";
import { NavLinks } from "@/src/components/navbar/navLinks";
import { NavMobile } from "@/src/components/navbar/navMobile";
import { cn } from "@/src/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button"; // Import Button
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs"; // Import icons
import { useBoundStore } from "@/src/store/store"; // Import useBoundStore

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false); // State for cart sidebar
    const pathname = usePathname();

    // Using useBoundStore for cart state
    const { cart, removeFromCart } = useBoundStore();

    const totalItems=cart.length;
    useEffect(() => {
        const handleOnScroll = () => {
            setIsScrolling(window.scrollY > 32);
        };
        window.addEventListener("scroll", handleOnScroll);
        return () => window.removeEventListener("scroll", handleOnScroll);
    }, []);

    // Determine if the current route is the main route
    const isMainRoute = pathname === "/";

    // Determine the navbar background and text colors
    const isTransparent = isMainRoute && !isScrolling;
    const navbarBg = isTransparent ? "bg-transparent" : "bg-white";
    const textColor = isTransparent ? "text-white" : "text-black"; // Text and icons are always white
    const strokeColor = isTransparent ? "white" : "black"; // Stroke color for icons

    return (
        <>
            <div className={cn("fixed top-0 z-50 w-full border-0 transition-colors duration-300", navbarBg)}>
                <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4 lg:justify-normal">
                    <div className="flex items-center gap-1 lg:basis-1/4">
                        <button type="button" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
                            <HamburgerMenu className={`w-6 ${textColor}`} />
                        </button>
                        <Logo color={textColor} />
                    </div>
                    <div className="hidden basis-2/4 lg:block">
                        <NavLinks textColor={textColor} />
                    </div>
                    <div className="flex items-center gap-1 lg:basis-1/4 lg:justify-end lg:gap-4">
                        <UserButton afterSignOutUrl="/sign-in" />
                        <UserIcon stroke={strokeColor} className={textColor} />
                        <div className="relative">
                            <button type="button" onClick={() => setIsCartOpen(!isCartOpen)} aria-label="Open cart">
                                <ShoppingCart className={`w-6 ${textColor}`} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs text-white bg-black rounded-full">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                    <NavMobile open={open} onClick={() => setOpen(false)} textColor={"black"} />
                </nav>
            </div>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}>
                    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Your Cart</h2>
                            <button type="button" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
                                <X className="w-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto">
                            {cart.length === 0 ? (
                                <p className="text-gray-500">Your cart is empty.</p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-gray-500">₹{item.basePrice}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => removeFromCart(item.id)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200" aria-label={`Decrease quantity of ${item.name}`}>
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <Button type="button" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={() => { setIsCartOpen(false); }} disabled={cart.length === 0} aria-label="Checkout">
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
