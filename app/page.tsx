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

export const metadata: Metadata = {
  title: "World App: Mini Apps Statistics",
  description: "Analytics dashboard for World App Mini Apps",
  openGraph: {
    images: [
      {
        url: "/preview.png",
        alt: "Mini Apps Stats Preview",
      },
    ],
  },
};

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
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomePageSearchParams>;
}) {
  const apps = await getData();

  // Sort the data
  const searchParamsData = await searchParams;
  const sort = searchParamsData.sort;
  const direction = searchParamsData.direction;

  const sortField = (sort || "unique_users_7d") as SortField;
  const sortDirection = (direction || "desc") as SortDirection;

  const sortedApps = [...apps].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a
            href="https://world.org/ecosystem"
            className="flex-shrink-0 max-sm:hidden"
          >
            <Image
              src="/world_logo.svg"
              alt="World Logo"
              width={120}
              height={28}
              className="h-6 w-auto"
              priority
            />
          </a>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Mini Apps Stats
          </h1>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SortableTable
          data={sortedApps}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        <div className="mt-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Data updates daily • Last loaded: {new Date().toLocaleString()}
        </div>
      </main>
    </div>
  );
}
