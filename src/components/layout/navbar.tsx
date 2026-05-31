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
    <>
      <nav className="w-full z-50 px-6 lg:px-12 py-4 bg-white lg:bg-transparent lg:absolute lg:top-0 lg:left-0 lg:right-0">
        <div className="hidden lg:flex items-center justify-between max-w-7xl mx-auto">
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
                className="text-[16px] font-medium text-[#FEA800] border border-[#FEA800] rounded-full px-6 py-2 hover:bg-[#FEA800]/10 transition-colors font-poppins"
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                className="text-[16px] font-medium bg-[#FEA800] rounded-full px-6 py-2.5 hover:bg-[#FEA800]/90 transition-colors font-poppins text-black"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="flex lg:hidden items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo/taxi.svg"
              alt="Popular Rides Logo"
              width={90}
              height={78}
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-[16px] font-medium text-[#FEA800] border border-[#FEA800] rounded-full px-6 py-2 hover:bg-[#FEA800]/10 transition-colors font-poppins"
            >
              Sign In
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex flex-col justify-center gap-[7px] w-9 h-9 p-1"
            >
              <span className="block h-[3px] w-full bg-[#FEA800] rounded-full" />
              <span className="block h-[3px] w-full bg-[#FEA800] rounded-full" />
            </button>
          </div>
        </div>
      </nav>

      {/* {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          <div className="relative ml-auto w-[75%] max-w-xs bg-white h-full flex flex-col shadow-xl animate-slide-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Image
                src="/logo/taxi.svg"
                alt="Popular Rides Logo"
                width={70}
                height={60}
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 1l14 14M15 1L1 15"
                    stroke="#111"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <ul className="flex flex-col px-5 py-6 gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block text-[15px] font-medium font-poppins py-3 px-3 rounded-lg transition-colors ${
                        isActive
                          ? "text-[#FEA800] bg-[#FEA800]/10"
                          : "text-gray-800 hover:text-[#FEA800] hover:bg-[#FEA800]/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto px-5 py-6 border-t border-gray-100 flex flex-col gap-3">
              <Link
                href="/signin"
                onClick={() => setMenuOpen(false)}
                className="text-center text-[15px] font-medium text-[#FEA800] border border-[#FEA800] rounded-full px-6 py-2.5 hover:bg-[#FEA800]/10 transition-colors font-poppins"
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                onClick={() => setMenuOpen(false)}
                className="text-center text-[15px] font-medium bg-[#FEA800] text-black rounded-full px-6 py-2.5 hover:bg-[#FEA800]/90 transition-colors font-poppins"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
