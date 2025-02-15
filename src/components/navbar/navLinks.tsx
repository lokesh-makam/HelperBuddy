// package
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavLinkProps } from "@/src/components/navbar/defination";

// lib
import { cn } from "@/src/lib/utils";
interface NavLinksProps {
    textColor: string;
}
const links: NavLinkProps[] = [
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
        id: "about",
        path: "/about",
        name: "About",
    },
];



export function NavLinks({ textColor }: NavLinksProps) {
    const pathname = usePathname();

    return (
        <ul className="flex lg:justify-center lg:gap-10">
            {links.map((link) => (
                <li
                    key={link.id}
                    className={cn(
                        "relative font-inter text-sm font-medium hover:opacity-100",
                        pathname !== link.path && "opacity-98",
                        textColor // Apply textColor
                    )}
                >
                    <Link
                        href={link.path}
                        className={cn(
                            "relative inline-block px-1",
                            "before:absolute before:left-0 before:bottom-[-2px] before:h-[2px]",
                            "before:w-0 before:bg-current before:transition-all before:duration-300",
                            "hover:before:w-full"
                        )}
                    >
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}


