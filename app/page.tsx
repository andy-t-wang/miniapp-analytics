import { Metadata } from "next";
import { SortableTable } from "./components/SortableTable";
import { AppData, ApiResponse, MetricsResponse } from "./types";

export const metadata: Metadata = {
  title: "WorldID Mini Apps Analytics",
  description: "Analytics dashboard for WorldID Mini Apps",
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

export default async function Home({
  searchParams,
}: {
  searchParams: { sort?: string; direction?: string };
}) {
  const apps = await getData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          WorldID Mini Apps Analytics
        </h1>

        <SortableTable data={apps} searchParams={searchParams} />

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Data updates hourly • Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
