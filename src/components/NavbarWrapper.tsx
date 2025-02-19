'use client';

import { usePathname } from 'next/navigation';
import {Navbar} from "@/src/components/navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  const hideNavbar = ["/sign-in", "/sign-up", "/admin"].some((path) =>
    pathname.startsWith(path)
  );

  if (hideNavbar) {
    return null;
  }

  return <Navbar />;
}