import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { MetricsResponse, ApiResponse } from "../types";
import { PageViewTracker } from "../components/AnalyticsWrapper";
import CountryRanksClient from "../components/CountryRanksClient";
import ScrollToTop from "../components/ScrollToTop";
import MobileNav from "../components/MobileNav";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Country Rankings - Mini Apps Statistics",
    description: "Country-based rankings for World App Mini Apps",
    openGraph: {
      images: [
        {
          url: "https://www.miniapps.world/api/screenshot?pathname=country-ranks",
          alt: "Country Rankings Preview",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

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

function getCountryName(code: string): string {
  const countryNames: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    IT: "Italy",
    ES: "Spain",
    NL: "Netherlands",
    BE: "Belgium",
    CH: "Switzerland",
    AT: "Austria",
    SE: "Sweden",
    NO: "Norway",
    DK: "Denmark",
    FI: "Finland",
    IE: "Ireland",
    PT: "Portugal",
    GR: "Greece",
    PL: "Poland",
    CZ: "Czech Republic",
    HU: "Hungary",
    SK: "Slovakia",
    SI: "Slovenia",
    HR: "Croatia",
    BG: "Bulgaria",
    RO: "Romania",
    LT: "Lithuania",
    LV: "Latvia",
    EE: "Estonia",
    MT: "Malta",
    CY: "Cyprus",
    LU: "Luxembourg",
    JP: "Japan",
    KR: "South Korea",
    IN: "India",
    SG: "Singapore",
    MY: "Malaysia",
    TH: "Thailand",
    PH: "Philippines",
    ID: "Indonesia",
    VN: "Vietnam",
    BR: "Brazil",
    MX: "Mexico",
    AR: "Argentina",
    CL: "Chile",
    CO: "Colombia",
    PE: "Peru",
    UY: "Uruguay",
    EC: "Ecuador",
    BO: "Bolivia",
    PY: "Paraguay",
    VE: "Venezuela",
    GY: "Guyana",
    SR: "Suriname",
    ZA: "South Africa",
    NG: "Nigeria",
    KE: "Kenya",
    GH: "Ghana",
    EG: "Egypt",
    MA: "Morocco",
    TN: "Tunisia",
    DZ: "Algeria",
    LY: "Libya",
    ET: "Ethiopia",
    UG: "Uganda",
    TZ: "Tanzania",
    ZW: "Zimbabwe",
    ZM: "Zambia",
    MW: "Malawi",
    MZ: "Mozambique",
    BW: "Botswana",
    NA: "Namibia",
    SZ: "Eswatini",
    LS: "Lesotho",
    MG: "Madagascar",
    MU: "Mauritius",
    SC: "Seychelles",
    CV: "Cape Verde",
    ST: "São Tomé and Príncipe",
    GQ: "Equatorial Guinea",
    GA: "Gabon",
    CF: "Central African Republic",
    TD: "Chad",
    CM: "Cameroon",
    CG: "Congo",
    CD: "Democratic Republic of the Congo",
    AO: "Angola",
    BJ: "Benin",
    BF: "Burkina Faso",
    CI: "Côte d'Ivoire",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    LR: "Liberia",
    ML: "Mali",
    MR: "Mauritania",
    NE: "Niger",
    SN: "Senegal",
    SL: "Sierra Leone",
    TG: "Togo",
    GM: "Gambia",
    DJ: "Djibouti",
    ER: "Eritrea",
    SO: "Somalia",
    SS: "South Sudan",
    SD: "Sudan",
    IL: "Israel",
    JO: "Jordan",
    LB: "Lebanon",
    SY: "Syria",
    TR: "Turkey",
    SA: "Saudi Arabia",
    AE: "United Arab Emirates",
    QA: "Qatar",
    KW: "Kuwait",
    BH: "Bahrain",
    OM: "Oman",
    YE: "Yemen",
    IQ: "Iraq",
    IR: "Iran",
    AF: "Afghanistan",
    PK: "Pakistan",
    BD: "Bangladesh",
    LK: "Sri Lanka",
    NP: "Nepal",
    BT: "Bhutan",
    MV: "Maldives",
    TW: "Taiwan",
    HK: "Hong Kong",
    MO: "Macao",
    MN: "Mongolia",
    KZ: "Kazakhstan",
    UZ: "Uzbekistan",
    TM: "Turkmenistan",
    TJ: "Tajikistan",
    KG: "Kyrgyzstan",
    AM: "Armenia",
    AZ: "Azerbaijan",
    GE: "Georgia",
    MD: "Moldova",
    UA: "Ukraine",
    BY: "Belarus",
    BA: "Bosnia and Herzegovina",
    RS: "Serbia",
    ME: "Montenegro",
    MK: "North Macedonia",
    AL: "Albania",
    XK: "Kosovo",
    IS: "Iceland",
    FO: "Faroe Islands",
    GL: "Greenland",
    VA: "Vatican City",
    SM: "San Marino",
    AD: "Andorra",
    MC: "Monaco",
    LI: "Liechtenstein",
    NZ: "New Zealand",
    FJ: "Fiji",
    PG: "Papua New Guinea",
    VU: "Vanuatu",
    NC: "New Caledonia",
    PF: "French Polynesia",
    WS: "Samoa",
    TO: "Tonga",
    KI: "Kiribati",
    TV: "Tuvalu",
    NR: "Nauru",
    FM: "Micronesia",
    MH: "Marshall Islands",
    PW: "Palau",
    SB: "Solomon Islands",
    CK: "Cook Islands",
    NU: "Niue",
    TK: "Tokelau",
    WF: "Wallis and Futuna",
  };
  return countryNames[code] || code;
}

async function getData(): Promise<{
  countryData: Record<string, CountryRankData>;
  countryMetrics: Record<
    string,
    { unique: number; new: number; total: number; name: string }
  >;
}> {
  try {
    const [metricsRes, appsRes] = await Promise.all([
      fetch("https://metrics.worldcoin.org/miniapps/stats/data.json", {}),
      fetch(
        "https://world-id-assets.com/api/v2/public/apps?skip_country_check=true",
        {
          next: { revalidate: 86400 },
        }
      ),
    ]);

    if (!metricsRes.ok || !appsRes.ok) {
      throw new Error("Failed to fetch data");
    }

    const metricsData: MetricsResponse[] = await metricsRes.json();
    const appsData: ApiResponse = await appsRes.json();

    // Create a map of app_id to app info
    const appMap = new Map(
      appsData.app_rankings.top_apps.map((app) => [app.app_id, app])
    );

    // Process data by country
    const countryDataMap = new Map<string, CountryRankData>();
    const countryMetricsMap = new Map<
      string,
      { unique: number; new: number; total: number; name: string }
    >();

    // Sanctioned countries to exclude
    const sanctionedCountries = [
      "CN", // China
      "RU", // Russia
      "CU", // Cuba
      "IR", // Iran
      "KP", // North Korea
      "SY", // Syria
      "VE", // Venezuela
      "BY", // Belarus
    ];

    metricsData.forEach((metric) => {
      const appInfo = appMap.get(metric.app_id);
      if (!appInfo) return;

      // Process unique users by country
      if (Array.isArray(metric.unique_users_last_7_days)) {
        metric.unique_users_last_7_days.forEach((countryData) => {
          // Skip sanctioned countries
          if (sanctionedCountries.includes(countryData.country)) return;

          if (!countryDataMap.has(countryData.country)) {
            countryDataMap.set(countryData.country, {
              country: countryData.country,
              topAppsByUniqueUsers: [],
              topAppsByNewUsers: [],
              topAppsByTotalUsers: [],
            });
            countryMetricsMap.set(countryData.country, {
              unique: 0,
              new: 0,
              total: 0,
              name: getCountryName(countryData.country),
            });
          }

          const countryRank = countryDataMap.get(countryData.country)!;
          countryRank.topAppsByUniqueUsers.push({
            app_id: metric.app_id,
            name: appInfo.name,
            logo_img_url: appInfo.logo_img_url,
            value: countryData.value,
          });

          const metrics = countryMetricsMap.get(countryData.country)!;
          metrics.unique += countryData.value;
        });
      }

      // Process new users by country
      if (Array.isArray(metric.new_users_last_7_days)) {
        metric.new_users_last_7_days.forEach((countryData) => {
          // Skip sanctioned countries
          if (sanctionedCountries.includes(countryData.country)) return;

          if (!countryDataMap.has(countryData.country)) {
            countryDataMap.set(countryData.country, {
              country: countryData.country,
              topAppsByUniqueUsers: [],
              topAppsByNewUsers: [],
              topAppsByTotalUsers: [],
            });
            countryMetricsMap.set(countryData.country, {
              unique: 0,
              new: 0,
              total: 0,
              name: getCountryName(countryData.country),
            });
          }

          const countryRank = countryDataMap.get(countryData.country)!;
          countryRank.topAppsByNewUsers.push({
            app_id: metric.app_id,
            name: appInfo.name,
            logo_img_url: appInfo.logo_img_url,
            value: countryData.value,
          });

          const metrics = countryMetricsMap.get(countryData.country)!;
          metrics.new += countryData.value;
        });
      }

      // Process total users by country
      if (Array.isArray(metric.total_users_last_7_days)) {
        metric.total_users_last_7_days.forEach((countryData) => {
          // Skip sanctioned countries
          if (sanctionedCountries.includes(countryData.country)) return;

          if (!countryDataMap.has(countryData.country)) {
            countryDataMap.set(countryData.country, {
              country: countryData.country,
              topAppsByUniqueUsers: [],
              topAppsByNewUsers: [],
              topAppsByTotalUsers: [],
            });
            countryMetricsMap.set(countryData.country, {
              unique: 0,
              new: 0,
              total: 0,
              name: getCountryName(countryData.country),
            });
          }

          const countryRank = countryDataMap.get(countryData.country)!;
          countryRank.topAppsByTotalUsers.push({
            app_id: metric.app_id,
            name: appInfo.name,
            logo_img_url: appInfo.logo_img_url,
            value: countryData.value,
          });

          const metrics = countryMetricsMap.get(countryData.country)!;
          metrics.total += countryData.value;
        });
      }
    });

    // Sort apps within each country (show all apps, not just top 5)
    countryDataMap.forEach((country) => {
      country.topAppsByUniqueUsers = country.topAppsByUniqueUsers.sort(
        (a, b) => b.value - a.value
      );
      country.topAppsByNewUsers = country.topAppsByNewUsers.sort(
        (a, b) => b.value - a.value
      );
      country.topAppsByTotalUsers = country.topAppsByTotalUsers.sort(
        (a, b) => b.value - a.value
      );
    });

    // Convert Maps to plain objects for serialization
    const countryDataObj = Object.fromEntries(countryDataMap);
    const countryMetricsObj = Object.fromEntries(countryMetricsMap);

    return { countryData: countryDataObj, countryMetrics: countryMetricsObj };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default async function CountryRanks() {
  const { countryData, countryMetrics } = await getData();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden sm:flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/world_logo.svg"
                  alt="World Logo"
                  width={120}
                  height={28}
                  className="h-6 w-auto"
                  priority
                />
              </Link>
              <Link
                href="/"
                className="text-xl font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Summary
              </Link>
              <Link
                href="/rewards"
                className="text-xl font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Rewards
              </Link>
              <Link
                href="/country-ranks"
                className="text-xl font-medium text-gray-900 relative"
              >
                Country Rankings
                <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-blue-600"></div>
              </Link>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="sm:hidden flex items-center justify-between h-16 px-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/world_logo.svg"
                alt="World Logo"
                width={100}
                height={24}
                className="h-5 w-auto"
                priority
              />
            </Link>
            <MobileNav currentPage="Country Rankings" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:w-[1200px] lg:max-w-[1200px]">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
            Weekly Mini App Activity by Country
          </h1>
        </div>

        <CountryRanksClient
          countryData={countryData}
          countryMetrics={countryMetrics}
        />

        <div className="mt-12 sm:mt-16 text-center text-sm text-gray-500">
          Data updates daily • Last loaded: {new Date().toLocaleString()}
        </div>
      </main>

      <ScrollToTop />
    </div>
  );
}
