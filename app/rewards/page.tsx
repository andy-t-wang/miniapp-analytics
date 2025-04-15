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
  return <RewardsPage metadata={metadata.app_rankings.top_apps} />;
}
