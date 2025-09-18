"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";

const DISMISS_KEY = "world-build-banner-dismissed";

const EventBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedValue = window.localStorage.getItem(DISMISS_KEY);
    if (storedValue !== "true") {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsVisible(false);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, "true");
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:right-8 sm:max-w-md">
      <div className="pointer-events-auto relative overflow-hidden rounded-2xl border border-blue-200 bg-white/95 shadow-xl backdrop-blur-sm">
        <Link
          href="https://worldbuild.fwb.help/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[5rem] items-center gap-4 px-4 py-3 pr-10"
        >
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl ">
            <video
              className="h-full w-full object-cover object-center"
              autoPlay
              loop
              muted
              playsInline
              poster="/world-build.png"
            >
              <source src="/world-build.webm" type="video/webm" />
            </video>
          </div>
          <div className="flex min-w-[14rem] flex-1 flex-col justify-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              Apply to World Build 2!
            </span>
            <span className="text-xs leading-relaxed text-gray-600">
              Apply to join the second batch of World Build. A two month
              accelerator for mini apps. Notable mini apps from the first batch
              include ORO, Credit, Humans vs AI, Squadletics, Superhero, and
              more.
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-full border border-gray-200 bg-white/90 p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Dismiss World Build announcement"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5l10 10M15 5L5 15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EventBanner;
