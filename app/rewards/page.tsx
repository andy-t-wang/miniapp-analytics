import { Suspense } from "react";
import RewardsPage from "../components/Rewards";

export default async function RewardsPageWrapper() {
  const fetchAppsMetadata = async () => {
    const appsMetadata = await fetch(
      "https://world-id-assets.com/api/v2/public/apps?override_country=AR",
      {
        next: { revalidate: 3600 },
      }
    );
    return appsMetadata.json();
  };
  const metadata = await fetchAppsMetadata();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RewardsPage metadata={metadata.app_rankings.top_apps} />
    </Suspense>
  );
}
