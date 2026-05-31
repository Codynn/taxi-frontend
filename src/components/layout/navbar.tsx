"use client";

import { NAV_LINKS } from "@/constants/navbar.constants";
import { NavbarProps } from "@/types/navbar.types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar({ transparent = false }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className={`w-full z-50 px-6 md:px-12 py-4 bg-white ${transparent ? "absolute top-0 left-0 right-0" : "shadow-sm"}`}
    >
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo/taxi.svg"
            alt="Popular Rides Logo"
            width={76}
            height={66}
          />
        </Link>

        <div className="flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-[16px] font-medium font-poppins transition-colors pb-1 border-b-2 ${
                      isActive
                        ? "text-[#FEA800] border-[#FEA800]"
                        : "text-gray-800 border-transparent hover:text-[#FEA800] hover:border-[#FEA800]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-[16px] font-medium text-[#FEA800] border border-[#FEA800] rounded-full px-6 py-2 transition-colors font-poppins"
            >
              Sign In
            </Link>
            <Link
              href="/get-started"
              className="text-[16px] font-medium bg-[#FEA800] rounded-full px-6 py-2.5 hover:bg-[#FEA800]/90 transition-colors font-poppins text-[#000000]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="flex md:hidden items-center justify-between">
        <Link href="/">
          <Image
            src="/logo/taxi.svg"
            alt="Popular Rides Logo"
            width={60}
            height={52}
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="text-[16px] font-medium text-amber-500 border border-amber-400 rounded-full px-4 py-1.5 transition-colors font-poppins"
          >
            Sign In
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex flex-col justify-center gap-[6px] w-8 h-8 p-1"
          >
            <span className="block h-[2px] w-full bg-gray-800 rounded-full" />
            <span className="block h-[2px] w-full bg-gray-800 rounded-full" />
          </button>
        </div>
      </div>
    </nav>
  );
}
