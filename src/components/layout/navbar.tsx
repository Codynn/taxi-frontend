"use client";

import { NAV_LINKS } from "@/constants/navbar.constants";
import { useAuthModal } from "@/context/Authmodalcontext";
import { useAuthStore } from "@/store/useAuthStore";
import { NavbarProps } from "@/types/navbar.types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import UserMenu from "../shared/UserMenu";

export default function Navbar({
  transparent = false,
  forceWhite = false,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openModal } = useAuthModal();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setScrolled(window.scrollY > heroHeight * 0.1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={[
          "max-w-7xl lg:mx-auto z-50 mt-2 mx-2 px-4 lg:px-8 py-3 fixed top-0 left-0 right-0 transition-all duration-300 rounded-4xl",
          forceWhite || scrolled ? "bg-white shadow-md" : "bg-transparent",
        ].join(" ")}
      >
        <div className="hidden lg:flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo/logo.svg"
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
                          : scrolled
                            ? "text-gray-800 border-transparent hover:text-[#FEA800] hover:border-[#FEA800]"
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
              {!hasHydrated ? null : isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <button
                    onClick={() => openModal("login")}
                    className="text-[16px] font-medium text-[#FEA800] border border-[#FEA800] rounded-full px-6 py-2 hover:bg-[#FEA800]/10 transition-colors font-poppins"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openModal("register")}
                    className="text-[16px] font-medium bg-[#FEA800] rounded-full px-6 py-2.5 hover:bg-[#FEA800]/90 transition-colors font-poppins text-black"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center justify-between px-2">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo/logo.svg"
              alt="Popular Rides Logo"
              width={90}
              height={78}
            />
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FEA800] shrink-0">
                <Image
                  src="/logo/logo.svg"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            )}

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

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-60 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slides down from top */}
          <div
            className="relative w-full bg-no-repeat bg-cover bg-top flex flex-col shadow-xl"
            style={{
              backgroundImage: "url('/home/mobilenav.svg')",
              animation: "slideDown 0.3s ease-out",
            }}
          >
            {/* Close button */}
            <div className="flex justify-end px-5 pt-5">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5"
                aria-label="Close menu"
              >
                <svg width="32" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 1l14 14M15 1L1 15"
                    stroke="#FEA800"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Nav links — centered */}
            <ul className="flex flex-col items-center px-5 py-6 gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href} className="w-full text-center">
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block text-[18px] font-semibold font-poppins py-3 uppercase tracking-wide transition-colors ${
                        isActive
                          ? "text-[#FEA800]"
                          : "text-gray-900 hover:text-[#FEA800]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Auth buttons */}
            <div className="flex flex-col items-center px-8 pb-10 gap-3">
              {!hasHydrated ? null : isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <button
                    onClick={() => {
                      openModal("login");
                      setMenuOpen(false);
                    }}
                    className="w-full text-center text-[16px] font-semibold text-[#FEA800] border-2 border-[#FEA800] rounded-full px-6 py-3 hover:bg-[#FEA800]/10 transition-colors font-poppins"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openModal("register");
                      setMenuOpen(false);
                    }}
                    className="w-full text-center text-[16px] font-semibold bg-[#FEA800] text-black rounded-full px-6 py-3 hover:bg-[#FEA800]/90 transition-colors font-poppins"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
