"use client";

import { useState } from "react";
import { QRCodePopup } from "./QRCodePopup";
import { AppData } from "../types";
import Image from "next/image";

interface InteractiveTableRowProps {
  app: AppData;
  index: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function InteractiveTableRow({ app, index }: InteractiveTableRowProps) {
  const [showQRCode, setShowQRCode] = useState(false);

  const handleClick = () => {
    // Check if the device is mobile
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      // On mobile, directly navigate to the URL
      window.location.href = `http://worldcoin.org/mini-app?app_id=${app.app_id}`;
    } else {
      // On desktop, show the QR code popup
      setShowQRCode(true);
    }
  };

  return (
    <>
      <tr
        onClick={handleClick}
        className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group"
      >
        <td className="w-8 sm:w-12 px-2 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 dark:text-gray-400">
          {index + 1}
        </td>
        <td className="w-auto px-2 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
              <Image
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                src={app.logo_img_url}
                alt={app.name}
                width={40}
                height={40}
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline max-w-[200px] sm:max-w-[300px]">
                {app.name}
              </div>
            </div>
          </div>
        </td>
        <td className="w-[60px] sm:w-auto px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
          <span className="hidden sm:inline">
            {app.unique_users_7d.toLocaleString()}
          </span>
          <span className="sm:hidden">{formatNumber(app.unique_users_7d)}</span>
        </td>
        <td className="w-[60px] sm:w-auto px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
          <span className="hidden sm:inline">
            {app.unique_users_all_time.toLocaleString()}
          </span>
          <span className="sm:hidden">
            {formatNumber(app.unique_users_all_time)}
          </span>
        </td>
      </tr>

      <QRCodePopup
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        appId={app.app_id}
      />
    </>
  );
}
