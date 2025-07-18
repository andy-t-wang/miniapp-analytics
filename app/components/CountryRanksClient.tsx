"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-2xl">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface CountryRankData {
  country: string;
  topAppsByUniqueUsers: AppRankData[];
  topAppsByNewUsers: AppRankData[];
  topAppsByTotalUsers: AppRankData[];
}

interface AppRankData {
  app_id: string;
  name: string;
  logo_img_url: string;
  value: number;
}

interface CountryRanksClientProps {
  countryData: Record<string, CountryRankData>;
  countryMetrics: Record<
    string,
    { unique: number; new: number; total: number; name: string }
  >;
}

export default function CountryRanksClient({
  countryData,
  countryMetrics,
}: CountryRanksClientProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Auto-select user's country based on IP
  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        // Use a simple IP geolocation service
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const userCountryCode = data.country_code;
        
        // Check if the user's country has data
        if (countryMetrics[userCountryCode]) {
          setSelectedCountry(userCountryCode);
        }
      } catch (error) {
        console.log('Could not detect user country:', error);
        // Fallback to US if available
        if (countryMetrics['US']) {
          setSelectedCountry('US');
        }
      }
    };

    detectUserCountry();
  }, [countryMetrics]);

  const selectedCountryData = selectedCountry
    ? countryData[selectedCountry]
    : null;
  const selectedCountryMetrics = selectedCountry
    ? countryMetrics[selectedCountry]
    : null;

  // Convert to Map for WorldMap component
  const countryMetricsMap = new Map(Object.entries(countryMetrics));


  return (
    <>
      <div className="bg-white rounded-3xl p-8 mb-8">
        <div className="min-h-[400px]">
          <WorldMap
            countryData={countryMetricsMap}
            onCountryClick={setSelectedCountry}
            selectedCountry={selectedCountry}
          />
        </div>

        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <div>{Object.keys(countryData).length} regions with activity</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#dbeafe" }}
              ></div>
              <span className="text-xs">&lt;50K</span>
              <div
                className="w-3 h-3 rounded-full ml-3"
                style={{ backgroundColor: "#3b82f6" }}
              ></div>
              <span className="text-xs">50-100K</span>
              <div
                className="w-3 h-3 rounded-full ml-3"
                style={{ backgroundColor: "#2563eb" }}
              ></div>
              <span className="text-xs">100-500K</span>
              <div
                className="w-3 h-3 rounded-full ml-3"
                style={{ backgroundColor: "#1e40af" }}
              ></div>
              <span className="text-xs">500K-1M</span>
              <div
                className="w-3 h-3 rounded-full ml-3"
                style={{ backgroundColor: "#1e3a8a" }}
              ></div>
              <span className="text-xs">&gt;1M</span>
            </div>
          </div>
        </div>
      </div>

      {selectedCountry && selectedCountryData && selectedCountryMetrics && (
        <div className="bg-white rounded-3xl p-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 mb-8">
              {selectedCountryMetrics.name}
            </h2>
            <div className="flex justify-center divide-x divide-gray-200">
              <div className="px-8 text-center">
                <div className="text-3xl font-semibold text-gray-900 mb-1">
                  {selectedCountryMetrics.new.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">New Users</div>
              </div>
              <div className="px-8 text-center">
                <div className="text-3xl font-semibold text-gray-900 mb-1">
                  {selectedCountryMetrics.unique.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Unique Users</div>
              </div>
              <div className="px-8 text-center">
                <div className="text-3xl font-semibold text-gray-900 mb-1">
                  {selectedCountryMetrics.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Opens</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* New Users Ranking */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                New Users
              </h3>
              <div className="space-y-1">
                {selectedCountryData.topAppsByNewUsers.map((app, index) => (
                  <div
                    key={app.app_id}
                    className="flex items-center gap-3 py-2 px-1 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 w-5 text-right text-sm font-medium text-gray-400">
                      {index + 1}
                    </div>
                    <Image
                      src={app.logo_img_url}
                      alt={`${app.name} logo`}
                      width={44}
                      height={44}
                      className="rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {app.name}
                      </div>
                    </div>
                    <div className="text-gray-500 font-medium text-sm">
                      {app.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unique Users Ranking */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Unique Users
              </h3>
              <div className="space-y-1">
                {selectedCountryData.topAppsByUniqueUsers.map((app, index) => (
                  <div
                    key={app.app_id}
                    className="flex items-center gap-3 py-2 px-1 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 w-5 text-right text-sm font-medium text-gray-400">
                      {index + 1}
                    </div>
                    <Image
                      src={app.logo_img_url}
                      alt={`${app.name} logo`}
                      width={44}
                      height={44}
                      className="rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {app.name}
                      </div>
                    </div>
                    <div className="text-gray-500 font-medium text-sm">
                      {app.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Users Ranking */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Total Opens
              </h3>
              <div className="space-y-1">
                {selectedCountryData.topAppsByTotalUsers.map((app, index) => (
                  <div
                    key={app.app_id}
                    className="flex items-center gap-3 py-2 px-1 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 w-5 text-right text-sm font-medium text-gray-400">
                      {index + 1}
                    </div>
                    <Image
                      src={app.logo_img_url}
                      alt={`${app.name} logo`}
                      width={44}
                      height={44}
                      className="rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {app.name}
                      </div>
                    </div>
                    <div className="text-gray-500 font-medium text-sm">
                      {app.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-blue-600 hover:text-blue-700 font-medium text-lg"
            >
              View all regions
            </button>
          </div>
        </div>
      )}

    </>
  );
}
