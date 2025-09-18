"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface MobileNavProps {
  currentPage?: string;
}

export default function MobileNav({}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pathname, setPathname] = useState("");

  // Safe pathname detection
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const navItems = [
    { href: "/", label: "Summary", icon: "📊" },
    { href: "/rewards", label: "Rewards", icon: "🎁" },
    { href: "/country-ranks", label: "Country Rankings", icon: "🌍" },
    {
      href: "https://worldbuild.fwb.help/",
      label: "Apply to World Build",
      icon: "🏗️",
    },
  ];

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none touch-manipulation"
        aria-label="Open navigation menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src="/world_logo.svg"
              alt="World Logo"
              width={120}
              height={28}
              className="h-6 w-auto"
              priority
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 touch-manipulation"
            aria-label="Close navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-6 py-4 text-lg font-medium transition-colors touch-manipulation ${
                  isActive
                    ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-4 text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <div className="text-sm text-gray-500">Mini Apps Analytics</div>
          <div className="text-xs text-gray-400 mt-1">v1.0.0</div>
        </div>
      </div>
    </>
  );
}
