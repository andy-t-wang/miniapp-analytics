import { Suspense } from "react";
import RewardsPage from "../components/Rewards";
import { Metadata } from "next";
import { WeeklyDevRewardsJson } from "../types";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mini Apps Rewards",
    description: "Rewards for World App Mini Apps",
    openGraph: {
      images: [
        {
          url: "https://www.miniapps.world/api/screenshot?pathname=rewards",
          alt: "Mini Apps Rewards Preview",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function RewardsPageWrapper() {
  const fetchAppsMetadata = async () => {
    const appsMetadata = await fetch(
      "https://world-id-assets.com/api/v2/public/apps?skip_country_check=true",
      {
        next: { revalidate: 1800 }, // Every 24 hours
      }
    );
    return appsMetadata.json();
  };
  const metadata = await fetchAppsMetadata();

  const fetchWeeklyRewards = async (): Promise<WeeklyDevRewardsJson> => {
    const res = await fetch(
      "https://metrics.worldcoin.org/weekly_dev_rewards.json",
      // nocache
      {
        next: { revalidate: 0 },
        cache: "no-store",
      }
    );
    return res.json();
  };

  const weeklyRewards = await fetchWeeklyRewards();

  return (
    <Suspense fallback={<div></div>}>
      <RewardsPage
        metadata={metadata.app_rankings.top_apps}
        weeklyRewards={weeklyRewards}
      />
    </Suspense>
  );
}
