import { Metadata } from "next";
import { headers } from "next/headers";
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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const baseUrl = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const screenshotUrl = `${protocol}://${baseUrl}/api/screenshot`;

  return {
    title: "Mini Apps Statistics",
    description: "Analytics dashboard for World App Mini Apps",
    openGraph: {
      images: [
        {
          url: screenshotUrl,
          alt: "Mini Apps Stats Preview",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

async function getData(): Promise<AppData[]> {
  try {
    const [metricsRes, appsRes] = await Promise.all([
      fetch("https://metrics.worldcoin.org/miniapps/stats/data.json", {
        next: { revalidate: 3600 },
      }),
      fetch("https://world-id-assets.com/api/v2/public/apps", {
        next: { revalidate: 3600 },
      }),
    ]);

    if (!metricsRes.ok || !appsRes.ok) {
      throw new Error("Failed to fetch data");
    }

    const metricsData: MetricsResponse[] = await metricsRes.json();
    const appsData: ApiResponse = await appsRes.json();

    // Combine the data
    const combinedData: AppData[] = [];

    // Process each app in the metrics data
    for (const metrics of metricsData) {
      const appInfo = appsData.app_rankings?.top_apps?.find(
        (app) => app.app_id === metrics.app_id
      );

      if (appInfo) {
        combinedData.push({
          app_id: metrics.app_id,
          name: appInfo.name,
          logo_img_url: appInfo.logo_img_url,
          unique_users_7d: metrics.unique_users_last_7_days || 0,
          unique_users_all_time: metrics.unique_users || 0,
          total_users_7d: metrics.total_users_last_7_days || 0,
          total_users_all_time: metrics.total_users || 0,
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
    return (a[sortField] - b[sortField]) * multiplier;
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
              <a href="https://world.org/ecosystem" className="flex-shrink-0">
                <Image
                  src="/world_logo.svg"
                  alt="World Logo"
                  width={120}
                  height={28}
                  className="h-6 w-auto"
                  priority
                />
              </a>
              <h1 className="text-xl max-sm:hidden font-medium text-gray-900">
                Summary
              </h1>
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
