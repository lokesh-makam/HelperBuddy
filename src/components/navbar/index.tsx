"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/src/components/assets/logo";
import { HamburgerMenu, UserIcon } from "@/src/components/assets/svg";
import { NavLinks } from "@/src/components/navbar/navLinks";
import  NavMobile  from "@/src/components/navbar/navMobile";
import { cn } from "@/src/lib/utils";
import Image from 'next/image';

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button"; // Import Button
import {
    ShoppingCart, Plus, Minus, X, User,
    Package,
    LogOut,
    ChevronDown,
    Wallet, ShoppingBag, Trash2,Handshake
}
    from "lucide-react";
import { useBoundStore } from "@/src/store/store";
import {useClerk, useUser} from "@clerk/nextjs";

interface NavbarProps {}
interface Service {
    id: string;                    // Prisma uses `String` for id
    name: string;
    description?: string;
    category: string;
    basePrice: number;
    estimatedTime?: string;
    rating: number;
    includes?: string;
    imageUrl?: string;
}
interface CartItem {
    service: Service;
    quantity: number;
}

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
                router.push('/profile');
                setIsUserMenuOpen(false);
            }
        },
        {
            label: 'Orders',
            icon: Package,
            onClick: () => {
                router.push('/profile/orders');
                setIsUserMenuOpen(false);
            }
        },
        {
            label: 'Wallet',
            icon: Wallet,
            onClick: () => {
                router.push('/profile/wallet');
                setIsUserMenuOpen(false);
            }
        },
        {
            label: 'Careers',
            icon: Handshake, 
            onClick: () => {
                router.push('/provider');  
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
        setIsUserMenuOpen(false);
    };

    // Using useBoundStore for cart state
    const cart = useBoundStore((state) => state.cart);
    const addToCart = useBoundStore((state) => state.addToCart);
    const removeFromCart = useBoundStore((state) => state.removeFromCart);
    const deleteFromCart = useBoundStore((state) => state.deleteFromCart);

    const increaseQuantity = (service: Service) => {
        addToCart(service); // This will increase the quantity if the service already exists in the cart
    };

// Function to decrease the quantity or remove the service from the cart
    const decreaseQuantity = (serviceId: string) => {
        removeFromCart(serviceId); // This will either decrease the quantity or remove the item
    };

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
                                    stroke={color}
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
            {isCartOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsCartOpen(false)}
                >
                    <div
                        id="cart-sidebar"
                        className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl flex flex-col animate-slide-in-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                            <h2 className="text-xl sm:text-2xl font-bold">Your Cart ({cart.length})</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-100 transition"
                                aria-label="Close cart"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 py-10 text-center">
                                    <div className="bg-gray-50 rounded-full p-6">
                                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <p className="text-gray-500 max-w-xs">
                                        Explore our services and add some items to your cart
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            router.push('/services');
                                        }}
                                        className="mt-4 bg-black hover:bg-gray-800 text-white px-8"
                                    >
                                        Browse Services
                                    </Button>
                                </div>
                            ) : (
                                <ul className="divide-y">
                                    {cart.map((item) => (
                                        <li key={item.id} className="py-4 sm:py-6">
                                            <div className="flex gap-3 sm:gap-4">
                                                {/* Product Image */}
                                                <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-md overflow-hidden border">
                                                    {item.imageUrl ? (
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 640px) 80px, 96px"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                                                            <Package className="w-8 h-8 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex justify-between">
                                                        <h3 className="font-medium text-sm sm:text-base line-clamp-2">{item.name}</h3>
                                                        <p className="font-medium ml-2 whitespace-nowrap">
                                                            ₹{(item.basePrice * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                        ₹{item.basePrice.toLocaleString()} per unit
                                                    </p>

                                                    <div className="mt-auto flex items-center justify-between pt-2 sm:pt-3">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-2 border rounded-md">
                                                            <button
                                                                onClick={() => decreaseQuantity(item.id)}
                                                                className="p-1 w-7 h-7 flex items-center justify-center hover:bg-gray-50 border-r"
                                                                aria-label="Decrease quantity"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                            <button
                                                                onClick={() => increaseQuantity(item)}
                                                                className="p-1 w-7 h-7 flex items-center justify-center hover:bg-gray-50 border-l"
                                                                aria-label="Increase quantity"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => deleteFromCart(item.id)}
                                                            className="text-xs sm:text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                                                            aria-label="Remove item"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Checkout Button */}
                        {cart.length > 0 && (
                            <div className="border-t p-4 sm:p-6">
                                <Button
                                    onClick={() => {
                                        router.push("/services/checkout");
                                        setIsCartOpen(false);
                                    }}
                                    className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-md text-base"
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}



        </>
    );
};