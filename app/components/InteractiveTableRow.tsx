"use client";

import { useState } from "react";
import { QRCodePopup } from "./QRCodePopup";
import { AppData } from "../types";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import posthog from "posthog-js";

interface InteractiveTableRowProps {
  app: AppData;
  index: number;
}

export function InteractiveTableRow({ app, index }: InteractiveTableRowProps) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    // On mobile, expand the row
    if (window.innerWidth < 640) {
      setIsExpanded(!isExpanded);
    } else {
      // On desktop, show the QR code popup
      setShowQRCode(true);

      // Track QR code view event
      posthog.capture("mini_app_qr_viewed", {
        app_id: app.app_id,
        app_name: app.name,
      });
    }
  };

  const handleTryItOut = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row from collapsing

    // Track the event
    posthog.capture("mini_app_opened", {
      app_id: app.app_id,
      app_name: app.name,
      source: "mobile_expanded",
    });

    window.location.href = `https://worldcoin.org/mini-app?app_id=${app.app_id}`;
  };

  return (
    <>
      <tr
        onClick={handleClick}
        className={`hover:bg-gray-50 transition-colors cursor-pointer group ${
          isExpanded ? "bg-gray-50" : ""
        }`}
      >
        <td className="pl-3 sm:pl-6 pr-2 sm:pr-4 py-3 sm:py-4 text-sm text-gray-500 align-middle">
          {index + 1}
        </td>
        <td className="px-3 sm:px-6 py-3 sm:py-4 align-middle">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
              <Image
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover bg-gray-100"
                src={app.logo_img_url}
                alt={app.name}
                width={40}
                height={40}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-blue-600">
                {app.name}
              </div>
            </div>
          </div>
        </td>
        <td className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-20 sm:w-auto">
          <div className="flex items-center justify-end gap-1">
            <span>{app.unique_users_7d.toLocaleString()}</span>
            <ChevronDownIcon
              className={`h-4 w-4 text-gray-400 transition-transform sm:hidden ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </td>
        {/* Desktop only columns */}
        <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base font-medium text-gray-900 whitespace-nowrap align-middle">
          {app.unique_users_all_time.toLocaleString()}
        </td>
        <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base font-medium text-gray-900 whitespace-nowrap align-middle">
          {app.total_users_7d.toLocaleString()}
        </td>
        <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base font-medium text-gray-900 whitespace-nowrap align-middle">
          {app.total_users_all_time.toLocaleString()}
        </td>
        <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base font-medium text-gray-900 whitespace-nowrap align-middle">
          {app.reward.toLocaleString()}
        </td>
      </tr>

      {/* Mobile expanded details */}
      {isExpanded && (
        <tr className="sm:hidden">
          <td
            colSpan={4}
            className="px-3 py-3 bg-gray-50 border-t border-gray-100"
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Unique Users (7d)</span>
                <span className="text-sm font-medium text-gray-900">
                  {app.unique_users_7d.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Unique Users (All)
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {app.unique_users_all_time.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Opens (7d)</span>
                <span className="text-sm font-medium text-gray-900">
                  {app.total_users_7d.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Opens (All)</span>
                <span className="text-sm font-medium text-gray-900">
                  {app.total_users_all_time.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Reward</span>
                <span className="text-sm font-medium text-gray-900">
                  {app.reward.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleTryItOut}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Open in World App
              </button>
            </div>
          </td>
        </tr>
      )}

      <QRCodePopup
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        appId={app.app_id}
      />
    </>
  );
}
