import { Metadata } from "next";
import { SortableTable } from "./components/SortableTable";
import {
  AppData,
  ApiResponse,
  MetricsResponse,
  SortField,
  SortDirection,
} from "./types";
import Image from "next/image";
import { SearchField } from "./components/SearchField";
import {
  PageViewTracker,
  AnalyticsWrapper,
} from "./components/AnalyticsWrapper";
import grantsData from "../public/grants1.json";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mini Apps Statistics",
    description: "Analytics dashboard for World App Mini Apps",
    openGraph: {
      images: [
        {
          url: "https://www.miniapps.world/api/screenshot",
          alt: "Mini Apps Stats Preview",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const extraAppsIds = [
  "app_cfd0a40d70419e3675be53a0aa9b7e10", // Magnify
  "app_97fc3debb3591a461c6ab3a16930a4e6", // VAKANOPAGA
  "app_321c526e5d6a0c623f4681f43d1d67ea", // Dantio
  "app_8e73a5bbe52ee0fa527232b8fc670b32", // Plus
  "app_219941bc349cf4454e5c0e7e2bd6e38d", // Yuplon
  "app_f73cb56512aad21cd3c294c90dd06d4f", // WLD a ARS
  "app_4fb840c976a27c63f533ed24a1b0e25f", // Bueno Cambio
  "app_e4a7e1fafd7c43097627703ffba2cddb", // Terminal
  "app_d495f6bf966aaa33ce54ebcc6d9a0162", // Loyall
  "app_5d1477356f63c8b82ea29e35a091e02f", // Coupon hub
  "app_703f53588423565c8929f3cda0c95cb0", // Money Caex
  "app_4c4610d7d45eb20f9804c9365a5a836b", // Gluers People
  "app_17add0ea360017d9ed307f8913dd4a0e", // Flights
  "app_d29cf8cfeea14e69f286af1803e296d2", // Flojo
  "app_8e5d3717d3babb59bd16948c9ff8397f", // Services
  "app_6610def1aa8897c77963bb43e747c4e2", // Phone Top ups
  "app_7308a0530a5bab5db92e19d7dd9616dc", // WLD a BRL
  "app_dc6fa1d96aba2b6ea25f81724789e0bc", // Futures
  "app_f76fd2f3959c6fe28a487914f610918b", // + Cash
  "app_133132cc57e61f3fd71351b72c35b641", // Super walk
  "app_375429e9ed395410c54243b2379c4281", // CB Wallet
  "app_ef009d364436334a4ba836d16e4f5e40", // Deals
];

async function getData(): Promise<AppData[]> {
  try {
    const [metricsRes, appsRes] = await Promise.all([
      fetch("https://metrics.worldcoin.org/miniapps/stats/data.json", {
        next: { revalidate: 3600 },
      }),
      fetch(
        "https://world-id-assets.com/api/v2/public/apps?override_country=AR",
        {
          next: { revalidate: 3600 },
        }
      ),
    ]);

    if (!metricsRes.ok || !appsRes.ok) {
      throw new Error("Failed to fetch data");
    }

    const metricsData: MetricsResponse[] = await metricsRes.json();
    const missingAppData = extraAppsIds.map(async (appId) => {
      const result = await fetch(
        `https://world-id-assets.com/api/v2/public/app/${appId}?skip_country_check=true`,
        {
          next: { revalidate: 3600 },
        }
      );
      const data = await result.json();
      return data.app_data;
    });

    const missingAppDataData = await Promise.all(missingAppData);
    const appsData: ApiResponse = {
      app_rankings: {
        top_apps: [
          ...(await appsRes.json()).app_rankings.top_apps,
          ...missingAppDataData,
        ],
      },
    };

    // Create a map of app_id to reward value
    const rewardMap = new Map(
      grantsData.map((grant: { id: string; value: number }) => [
        grant.id,
        grant.value,
      ])
    );

    // Combine the data
    const combinedData: AppData[] = [];

    // Process each app in the metrics data
    for (const metrics of metricsData) {
      const appInfo = appsData.app_rankings?.top_apps?.find(
        (app) => app.app_id === metrics.app_id
      );

      if (appInfo) {
        const reward = rewardMap.get(metrics.app_id);
        combinedData.push({
          app_id: metrics.app_id,
          name: appInfo.name,
          logo_img_url: appInfo.logo_img_url,
          unique_users_7d: metrics.unique_users_last_7_days || 0,
          unique_users_all_time: metrics.unique_users || 0,
          total_users_7d: metrics.total_users_last_7_days || 0,
          total_users_all_time: metrics.total_users || 0,
          reward: typeof reward === "number" ? reward : 0,
        });
      }
    }

    return combinedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

interface HomePageSearchParams {
  sort?: string;
  direction?: string;
  search?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomePageSearchParams>;
}) {
  const apps = await getData();

  // Sort and filter the data
  const searchParamsData = await searchParams;
  const sort = searchParamsData.sort;
  const direction = searchParamsData.direction;
  const searchTerm = searchParamsData.search?.toLowerCase();

  const sortField = (sort || "total_users_7d") as SortField;
  const sortDirection = (direction || "desc") as SortDirection;

  // Filter apps by search term
  const filteredApps = searchTerm
    ? apps.filter((app) => app.name.toLowerCase().includes(searchTerm))
    : apps;

  // Sort the filtered apps
  const sortedApps = [...filteredApps].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return ((a[sortField] || 0) - (b[sortField] || 0)) * multiplier;
  });

  // Calculate total users from filtered apps
  const totalUsers7d = sortedApps.reduce(
    (sum, app) => sum + app.total_users_7d,
    0
  );
  const totalUsersAllTime = sortedApps.reduce(
    (sum, app) => sum + app.total_users_all_time,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageViewTracker />
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
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
                className="text-xl max-sm:hidden font-medium text-gray-900"
              >
                Summary
              </Link>
              <Link
                href="/rewards"
                className="text-xl max-sm:hidden font-medium text-gray-900"
              >
                Rewards
              </Link>
            </div>
            <AnalyticsWrapper>
              <SearchField />
            </AnalyticsWrapper>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-900">
                Total Opens (7d)
              </h2>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {totalUsers7d.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Total opens across all mini apps in the last 7 days
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-900">
                Total Opens (All Time)
              </h2>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {totalUsersAllTime.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Total opens across all mini apps
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <AnalyticsWrapper>
            <SortableTable
              data={sortedApps}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          </AnalyticsWrapper>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Data updates daily • Last loaded: {new Date().toLocaleString()}
        </div>
      </main>
    </div>
  );
}
