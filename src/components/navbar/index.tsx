"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/src/components/assets/logo";
import { HamburgerMenu, UserIcon } from "@/src/components/assets/svg";
import { NavLinks } from "@/src/components/navbar/navLinks";
import  NavMobile  from "@/src/components/navbar/navMobile";
import { cn } from "@/src/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button"; // Import Button
import {
    ShoppingCart, Plus, Minus, X, User,
    Package,
    LogOut,
    ChevronDown,
    Wallet
}
    from "lucide-react";
import { useBoundStore } from "@/src/store/store";
import {useClerk, useUser} from "@clerk/nextjs";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false); // State for cart sidebar
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
    const { isSignedIn, user } = useUser(); // Clerk user authentication
    const pathname = usePathname();
    const router=useRouter();
    const { signOut } = useClerk();
    const menuItems = [
        {
            label: 'My Profile',
            icon: User,
            onClick: () => {
                router.push('/profile')
                setIsUserMenuOpen(false);
            }
        },
        {
            label: 'Orders',
            icon: Package,
            onClick: () => {
                router.push('/profile/orders')
                setIsUserMenuOpen(false);
            }
        },
        {
            label: 'Wallet',
            icon: Wallet,
            onClick: () => {
                router.push('/profile/wallet')
                setIsUserMenuOpen(false);
            }
        }
    ];
    const handleLogin = () => {
        router.push("/sign-in");
        setIsUserMenuOpen(false);
    };
  const handlesignup=() => {
    router.push("/sign-up");
    setIsUserMenuOpen(false);
  }
    const handleLogout =async () => {
        await signOut(); // Clerk Sign-Out
        router.push("/sign-in");
        setIsUserMenuOpen(false);
    };

    // Using useBoundStore for cart state
    const  cart = useBoundStore(state => state.cart);
    const removeFromCart = useBoundStore(state => state.removeFromCart);

    const totalItems=cart?cart.length:0;
    useEffect(() => {
        const handleOnScroll = () => {
            setIsScrolling(window.scrollY > 32);
        };
        window.addEventListener("scroll", handleOnScroll);
        return () => window.removeEventListener("scroll", handleOnScroll);
    }, []);

    // Determine if the current route is the main route
    const isMainRoute = pathname === "/";
    const isTransparent = isMainRoute && !isScrolling;
    const navbarBg = isTransparent ? "bg-transparent" : "bg-white";
    const textColor = isTransparent ? "text-white" : "text-black";
    const color=isTransparent ? "white" : "black";
    return (
        <>
            <div className={cn(
                "fixed top-0 z-50 w-full  border-gray-200 transition-colors duration-300",
                navbarBg
            )}>
                <nav
                    className="mx-auto flex max-w-[1440px] items-center justify-between px-4 md:px-8 py-4 lg:justify-normal">
                    {/* Logo and hamburger section */}
                    <div className="flex items-center gap-1 lg:basis-1/4">
                        <button
                            type="button"
                            className="lg:hidden"
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                        >
                            <HamburgerMenu className={`w-6 ${textColor}`}/>
                        </button>
                        <Logo textColour={color}/>
                    </div>

                    {/* Nav links section */}
                    <div className="hidden basis-2/4 lg:block">
                        <NavLinks textColor={textColor}/>
                    </div>

                    {/* User and Cart section */}
                    <div className="flex items-center gap-4 md:gap-6 lg:basis-1/4 lg:justify-end">
                        {/* User Menu */}
                        <div className="relative group">
                            <button
                                type="button"
                                className="flex items-center gap-2 py-2 hover:opacity-80 transition-opacity"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <UserIcon
                                    stroke={isScrolling ? "black" : "white"}
                                    className="w-6 h-6"
                                />
                                <span className={`hidden md:block text-md font-medium ${textColor}`}>
                  {isSignedIn ? user?.firstName : 'Login'}
                </span>
                                <ChevronDown className={`w-4 h-4 hidden md:block ${textColor}`}/>
                            </button>

                            {/* Enhanced Dropdown Menu */}
                            <div
                                className={`absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg py-2 transition-all duration-200 
                  ${isUserMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}
                  border border-gray-200`}
                            >
                                {isSignedIn? (
                                    <>
                                        {/* Header with user info */}
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                                            <p className="font-medium text-sm text-gray-900">{user?.firstName}</p>
                                        </div>

                                        {/* Menu items */}
                                        <div className="py-2">
                                            {menuItems.map((item, index) => (
                                                <button
                                                    key={index}
                                                    onClick={item.onClick}
                                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50
                            flex items-center gap-3 transition-colors duration-150"
                                                >
                                                    <item.icon className="w-4 h-4 text-gray-500"/>
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Logout button */}
                                        <div className="border-t border-gray-100 mt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50
                          flex items-center gap-3 transition-colors duration-150"
                                            >
                                                <LogOut className="w-4 h-4 text-gray-500"/>
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4">
                                        <button
                                            onClick={handleLogin}
                                            className="w-full bg-black text-white py-2.5 px-4 rounded-lg text-sm font-medium
                        hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <User className="w-4 h-4"/>
                                            Login
                                        </button>
                                        <p className="text-xs text-gray-500 mt-3 text-center">
                                            New customer?{" "}
                                            <button className="text-black font-medium hover:underline" onClick={handlesignup}>
                                                Sign Up
                                            </button>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cart Icon */}
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            className="relative hover:opacity-80 transition-opacity"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className={`w-5 h-5 ${textColor}`}/>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center
                  text-xs text-white bg-black rounded-full transform transition-transform
                  hover:scale-110">
                  {totalItems}
                </span>
                            )}
                        </button>
                    </div>
                    <NavMobile open={open} onClick={() => setOpen(false)}/>

                </nav>
            </div>
            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}>
                    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 flex flex-col"
                         onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Your Cart</h2>
                            <button type="button" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
                                <X className="w-6"/>
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto">
                            {cart.length === 0 ? (
                                <p className="text-gray-500">Your cart is empty.</p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id}
                                             className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-gray-500">₹{item.basePrice}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => removeFromCart(item.id)}
                                                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                                        aria-label={`Decrease quantity of ${item.name}`}>
                                                    <Minus className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <Button type="button"
                                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                    onClick={() => {
                                        router.push('/services/checkout');
                                        setIsCartOpen(false);
                                    }} disabled={cart.length === 0} aria-label="Checkout">
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
