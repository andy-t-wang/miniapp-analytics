"use client";

import { useState } from "react";
import { QRCodePopup } from "./QRCodePopup";
import { AppData } from "../types";
import Image from "next/image";

interface InteractiveTableRowProps {
  app: AppData;
  index: number;
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
        className="hover:bg-gray-50 transition-colors cursor-pointer group"
      >
        <td className="px-6 py-4 text-sm text-gray-500 align-middle">
          {index + 1}
        </td>
        <td className="px-6 py-4 align-middle">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-10 w-10">
              <Image
                className="h-10 w-10 rounded-full object-cover bg-gray-100"
                src={app.logo_img_url}
                alt={app.name}
                width={40}
                height={40}
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 max-w-[300px]">
                {app.name}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap align-middle">
          {app.unique_users_7d.toLocaleString()}
        </td>
        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap align-middle">
          {app.unique_users_all_time.toLocaleString()}
        </td>
        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap align-middle">
          {app.total_users_7d.toLocaleString()}
        </td>
        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap align-middle">
          {app.total_users_all_time.toLocaleString()}
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
