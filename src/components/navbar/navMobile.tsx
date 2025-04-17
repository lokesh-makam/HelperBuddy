import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { Logo } from "@/src/components/assets/logo";
import {
    CloseIcon,
} from "@/src/components/assets/svg";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

const links = [
    {
        id: "home",
        path: "/",
        name: "Home",
    },
    {
        id: "service",
        path: "/services",
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
    {
        id: "service-partner",
        path: "/provider",
        name: "Service Partner",
    },
];

interface NavMobileProps {
    onClick: () => void;
    open: boolean;
}

export default function NavMobile({ onClick, open }: NavMobileProps) {
    const { isSignedIn, user } = useUser();

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
                        <Logo />
                        <button onClick={onClick} className="p-2">
                            <CloseIcon className="w-6" />
                        </button>
                    </div>

                    {/* navbar links */}
                    <ul className="grid grid-cols-1">
                        {links.map((link) => (
                            <li
                                key={link.id}
                                className={cn(
                                    "border-b border-[#E8ECEF] first:pt-0",
                                    link.id === "become-provider" ? "bg-gray-50" : ""
                                )}
                            >
                                <Link
                                    href={link.path}
                                    onClick={onClick}
                                    className={cn(
                                        "block py-4 font-inter text-sm font-medium",
                                        link.id === "become-provider"
                                            ? "text-primary font-semibold"
                                            : "text-black"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* bottom section */}
                <div className="flex flex-col gap-5 border-t border-[#E8ECEF] pt-4">
                    {isSignedIn ? (
                        <Link href="/profile" className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback>
                                    {user?.firstName?.charAt(0)}
                                    {user?.lastName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <p className="font-medium">
                                {user?.firstName} {user?.lastName}
                            </p>
                        </Link>
                    ) : (
                        <Link href="/sign-in" className="w-full">
                            <Button className="w-full text-lg py-2.5">Log in</Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="h-full bg-black/30" onClick={onClick}></div>
        </div>
    );
}