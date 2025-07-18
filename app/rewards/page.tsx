import { Suspense } from "react";
import RewardsPage from "../components/Rewards";
import { Metadata } from "next";

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
        next: { revalidate: 86400 }, // Every 24 hours
      }
    );
    return appsMetadata.json();
  };
  const metadata = await fetchAppsMetadata();

  return (
    <Suspense fallback={<div></div>}>
      <RewardsPage metadata={metadata.app_rankings.top_apps} />
    </Suspense>
);
}
