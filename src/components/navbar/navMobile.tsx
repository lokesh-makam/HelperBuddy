import Link from "next/link";
import { cn } from "@/src/lib/utils";
import {Logo} from "@/src/components/assets/logo";
import {
    CloseIcon,
    FacebookIcon,
    InstagramIcon,
    SearchIcon,
    YoutubeIcon,
} from "@/src/components/assets/svg";
import {Button} from "@/src/components/ui/button";

const links = [
    {
        id: "home",
        path: "/",
        name: "Home",
    },
    {
        id: "service",
        path: "/service",
        name: "Services",
    },
    {
        id: "blog",
        path: "/blog",
        name: "Blogs",
    },
    {
        id: "contact-us",
        path: "/contact",
        name: "Contact Us",
    },
];

interface NavMobileProps {
    onClick: () => void;
    open: boolean;
    textColor: string; // Add textColor prop
}

export function NavMobile({ onClick, open, textColor }: NavMobileProps) {
    return (
        <div
            className={cn(
                "absolute left-0 top-0 z-10 grid min-h-[100dvh] w-full grid-cols-[11fr_1fr] transition-transform duration-100 ease-in md:grid-cols-[10fr_2fr] lg:hidden",
                open ? "transform-none touch-none" : "-translate-x-full"
            )}
        >
            <div className="flex h-full flex-col justify-between bg-white p-6">
                {/* top section */}
                <div className="flex flex-col gap-4">
                    {/* logo and close button */}
                    <div className="flex items-center justify-between">
                        <Logo/>
                        <button onClick={onClick} className="p-2">
                            <CloseIcon className="w-6" />
                        </button>
                    </div>

                    {/* search input */}
                    <div className="flex h-12 items-center gap-2 rounded-md border border-[#6C7275] px-4">
                        <label htmlFor="search" className="cursor-pointer">
                            <SearchIcon />
                        </label>
                        <input
                            id="search"
                            name="search"
                            className="font-inter text-sm font-normal text-[#141718] outline-none placeholder:opacity-70"
                            placeholder="Search"
                        />
                    </div>

                    {/* navbar links */}
                    <ul className="grid grid-cols-1">
                        {links.map((link) => (
                            <li
                                key={link.id}
                                className="border-b border-[#E8ECEF] first:pt-0"
                            >
                                <Link
                                    href={link.path}
                                    className={cn(
                                        "block py-4 font-inter text-sm font-medium",
                                        textColor // Apply textColor to links
                                    )}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* bottom section */}
                <div className="flex flex-col gap-5">
                    {/* cart & wishlist */}


                    {/* login button */}
                    <Button className="w-full text-lg py-2.5">
                        Sign In
                    </Button>

                    {/* social media icons */}
                    <div className="flex justify-center gap-6"> {/* Center the icons */}
                        <InstagramIcon className="w-6" />
                        <FacebookIcon className="w-6" />
                        <YoutubeIcon className="w-6" />
                    </div>
                </div>
            </div>

            <div className="h-full bg-black/30" onClick={onClick}></div>
        </div>
    );
}