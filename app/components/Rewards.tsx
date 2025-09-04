"use client";
import Image from "next/image";
import { AnalyticsWrapper } from "../components/AnalyticsWrapper";
import { SearchField } from "../components/SearchField";
import { PageViewTracker } from "../components/AnalyticsWrapper";
import {
  TopApp,
  RewardsTableRow,
  WeeklyDevRewardsJson,
  Season2Row,
} from "../types";
import grants1 from "../../public/grants1.json";
import grants2 from "../../public/grants2.json";
import grants3 from "../../public/grants3.json";
import grants4 from "../../public/grants4.json";
import grants5 from "../../public/grants5.json";
import grants6 from "../../public/grants6.json";
import grants7 from "../../public/grants7.json";
import grants8 from "../../public/grants8.json";
import grants9 from "../../public/grants9.json";
import grants10 from "../../public/grants10.json";
import grants11 from "../../public/grants11.json";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import MobileNav from "./MobileNav";
import ScrollToTop from "./ScrollToTop";
import { Suspense } from "react";

function formatNumberSafe(value: unknown): string {
  const num = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(num) ? num.toLocaleString() : "0";
}

function categoryBadgeClass(category?: string): string {
  switch (category) {
    case "Airdrop":
      return "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200";
    case "New Non Airdrop":
      return "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200";
    case "Non Airdrop":
      return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200";
    default:
      return "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200";
  }
}

function getRewardsTableData(appsMetadataData?: TopApp[]): RewardsTableRow[] {
  const allApps = new Map<string, RewardsTableRow>();

  // Process grants1
  for (const g1 of grants1) {
    allApps.set(g1.id, {
      app_id: g1.id,
      name: g1.name,
      wave1: g1.value,
      wave2: 0,
      wave3: 0,
      wave4: 0,
      wave5: 0,
      wave6: 0,
      wave7: 0,
      wave8: 0,
      wave9: 0,
      wave10: 0,
      wave11: 0,
      logo_img_url: "", // Will be populated later
    });
  }

  // Process grants2
  for (const g2 of grants2) {
    const existingApp = allApps.get(g2.id);
    if (existingApp) {
      existingApp.wave2 = g2.value;
      // Update name if necessary, though grants should be consistent
      // existingApp.name = g2.name;
    } else {
      // Add app if it only exists in wave 2 onwards
      allApps.set(g2.id, {
        app_id: g2.id,
        name: g2.name,
        wave1: 0,
        wave2: g2.value,
        wave3: 0,
        wave4: 0,
        wave5: 0,
        wave6: 0,
        wave7: 0,
        wave8: 0,
        wave9: 0,
        wave10: 0,
        wave11: 0,
        logo_img_url: "",
      });
    }
  }

  // Process grants3
  for (const g3 of grants3) {
    const existingApp = allApps.get(g3.id);
    if (existingApp) {
      existingApp.wave3 = g3.value;
      // Update name if necessary
      // existingApp.name = g3.name;
    } else {
      // Add app if it only exists in wave 3
      allApps.set(g3.id, {
        app_id: g3.id,
        name: g3.name,
        wave1: 0,
        wave2: 0, // Initialize wave 2 correctly
        wave3: g3.value,
        wave4: 0,
        wave5: 0,
        wave6: 0,
        wave7: 0,
        wave8: 0,
        wave9: 0,
        wave10: 0,
        wave11: 0,
        logo_img_url: "",
      });
    }

    // Process grants4
    for (const g4 of grants4) {
      const existingApp = allApps.get(g4.id);
      if (existingApp) {
        existingApp.wave4 = g4.value;
      } else {
        // Add app if it only exists in wave 4
        allApps.set(g4.id, {
          app_id: g4.id,
          name: g4.name,
          wave1: 0,
          wave2: 0,
          wave3: 0,
          wave4: g4.value,
          wave5: 0,
          wave6: 0,
          wave7: 0,
          wave8: 0,
          wave9: 0,
          wave10: 0,
          wave11: 0,
          logo_img_url: "",
        });
      }
    }

    // Process grants5
    for (const g5 of grants5) {
      const existingApp = allApps.get(g5.id);
      if (existingApp) {
        existingApp.wave5 = g5.value;
      } else {
        // Add app if it only exists in wave 5
        allApps.set(g5.id, {
          app_id: g5.id,
          name: g5.name,
          wave1: 0,
          wave2: 0,
          wave3: 0,
          wave4: 0,
          wave5: g5.value,
          wave6: 0,
          wave7: 0,
          wave8: 0,
          wave9: 0,
          wave10: 0,
          wave11: 0,
          logo_img_url: "",
        });
      }
    }

    // Process grants6
    for (const g6 of grants6) {
      const existingApp = allApps.get(g6.id);
      if (existingApp) {
        existingApp.wave6 = g6.value;
      } else {
        // Add app if it only exists in wave 6
        allApps.set(g6.id, {
          app_id: g6.id,
          name: g6.name,
          wave1: 0,
          wave2: 0,
          wave3: 0,
          wave4: 0,
          wave5: 0,
          wave6: g6.value,
          wave7: 0,
          wave8: 0,
          wave9: 0,
          wave10: 0,
          wave11: 0,
          logo_img_url: "",
        });
      }
    }

    // Process grants7
    for (const g7 of grants7) {
      const existingApp = allApps.get(g7.id);
      if (existingApp) {
        existingApp.wave7 = g7.value;
      } else {
        // Add app if it only exists in wave 7
        allApps.set(g7.id, {
          app_id: g7.id,
          name: g7.name,
          wave1: 0,
          wave2: 0,
          wave3: 0,
          wave4: 0,
          wave5: 0,
          wave6: 0,
          wave7: g7.value,
          wave8: 0,
          wave9: 0,
          wave10: 0,
          wave11: 0,
          logo_img_url: "",
        });
      }
    }

    // Process grants8
    for (const g8 of grants8) {
      const existingApp = allApps.get(g8.id);
      if (existingApp) {
        existingApp.wave8 = g8.value;
      } else {
        // Add app if it only exists in wave 8
        allApps.set(g8.id, {
          app_id: g8.id,
          name: g8.name,
          wave1: 0,
          wave2: 0,
          wave3: 0,
          wave4: 0,
          wave5: 0,
          wave6: 0,
          wave7: 0,
          wave8: g8.value,
          wave9: 0,
          wave10: 0,
          wave11: 0,
          logo_img_url: "",
        });
      }
    }

    // Process grants9
    for (const g9 of grants9) {
      const existingApp = allApps.get(g9.id);
      if (existingApp) {
        existingApp.wave9 = g9.value;
      } else {
        // Add app if it only exists in wave 9
        allApps.set(g9.id, {
          app_id: g9.id,
          name: g9.name,
          wave1: 0,
          wave2: 0,
          wave3: 0,
          wave4: 0,
          wave5: 0,
          wave6: 0,
          wave7: 0,
          wave8: 0,
          wave9: g9.value,
          wave10: 0,
          wave11: 0,
          logo_img_url: "",
        });
      }
    }

    // Process grants10
    for (const g10 of grants10) {
      const existingApp = allApps.get(g10.id);
      if (existingApp) {
        existingApp.wave10 = g10.value;
      } else {
        // Add app if it only exists in wave 10
        allApps.set(g10.id, {
          app_id: g10.id,
          name: g10.name,
          wave1: 0,
          wave2: 0,
          wave3: 0,
          wave4: 0,
          wave5: 0,
          wave6: 0,
          wave7: 0,
          wave8: 0,
          wave9: 0,
          wave10: g10.value,
          wave11: 0,
          logo_img_url: "",
        });
      }
    }
  }

  // Process grants11
  for (const g11 of grants11) {
    const existingApp = allApps.get(g11.id);
    if (existingApp) {
      existingApp.wave11 = g11.value;
    } else {
      // Add app if it only exists in wave 11
      allApps.set(g11.id, {
        app_id: g11.id,
        name: g11.name,
        wave1: 0,
        wave2: 0,
        wave3: 0,
        wave4: 0,
        wave5: 0,
        wave6: 0,
        wave7: 0,
        wave8: 0,
        wave9: 0,
        wave10: 0,
        wave11: g11.value,
        logo_img_url: "",
      });
    }
  }

  // Populate logo URLs from metadata
  if (appsMetadataData) {
    for (const appMeta of appsMetadataData) {
      const appData = allApps.get(appMeta.app_id);
      if (appData) {
        appData.logo_img_url = appMeta.logo_img_url || "";
      }
    }
  }

  // Convert map values to the final array
  const rows = Array.from(allApps.values());

  return rows;
}

function SortHeader({
  label,
  field,
  currentSort,
  currentDirection,
  className = "",
  onClick,
}: {
  label: React.ReactNode;
  field:
    | "wave1"
    | "wave2"
    | "wave3"
    | "wave4"
    | "wave5"
    | "wave6"
    | "wave7"
    | "wave8"
    | "wave9"
    | "wave10"
    | "wave11";
  currentSort: string;
  currentDirection: string;
  className?: string;
  onClick: () => void;
}) {
  const isActive = currentSort === field;
  return (
    <th
      scope="col"
      className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none group ${className}`}
      onClick={onClick}
    >
      <span className="flex items-center gap-1 justify-end group-hover:text-gray-700">
        {label}
        <span className="flex flex-col">
          {isActive && currentDirection === "desc" ? (
            <ChevronDownIcon className="h-4 w-4 text-blue-500" />
          ) : isActive && currentDirection === "asc" ? (
            <ChevronUpIcon className="h-4 w-4 text-blue-500" />
          ) : (
            <div className="opacity-0 group-hover:opacity-50">
              <ChevronUpIcon className="h-4 w-4" />
            </div>
          )}
        </span>
      </span>
    </th>
  );
}

function RewardsTableRowComponent({
  row,
  index,
  isExpanded,
  onToggle,
}: {
  row: RewardsTableRow;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      console.error(`Failed to load image for ${row.name}:`, {
        app_id: row.app_id,
        url: row.logo_img_url,
        error: e,
        note: "Image loads directly but fails through Next.js Image optimization. Falling back to unoptimized img tag.",
      });
      setImageError(true);
    },
    [row.app_id, row.logo_img_url, row.name]
  );
  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer group"
        onClick={onToggle}
      >
        <td className="px-3 py-3 sm:py-4 text-sm text-gray-500 align-middle hidden sm:table-cell w-[48px] min-w-[48px] max-w-[48px] sticky left-0 z-30 bg-white group-hover:bg-gray-50">
          {index + 1}
        </td>
        <td className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-3 sm:py-4 align-middle sticky left-0 sm:left-[48px] z-25 bg-white group-hover:bg-gray-50 min-w-0 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[52px] before:bg-white before:group-hover:bg-gray-50 before:-z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
              {row.logo_img_url ? (
                imageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover bg-gray-100"
                    src={row.logo_img_url}
                    alt={row.name}
                    onError={() => {
                      console.error(
                        `Even unoptimized image failed for ${row.name}:`,
                        row.logo_img_url
                      );
                    }}
                  />
                ) : (
                  <Image
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover bg-gray-100"
                    src={row.logo_img_url}
                    alt={row.name}
                    width={40}
                    height={40}
                    onError={handleImageError}
                    unoptimized={
                      row.logo_img_url.includes("githubusercontent") ||
                      row.logo_img_url.includes("github")
                    }
                  />
                )
              ) : (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs font-medium">
                    {row.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm md:text-base font-medium text-gray-900 group-hover:text-blue-600">
                {row.name}
              </div>
            </div>
          </div>
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave1)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave2)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave3)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave4)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave5)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave6)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave7)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave8)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave9)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave10)}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {formatNumberSafe(row.wave11)}
        </td>
        {/* Shown only on mobile */}
        <td className="px-3 py-3 sm:py-4 text-right text-xs font-medium text-gray-900 whitespace-nowrap align-middle table-cell sm:hidden">
          {formatNumberSafe(
            row.wave1 +
              row.wave2 +
              row.wave3 +
              row.wave4 +
              row.wave5 +
              row.wave6 +
              row.wave7 +
              row.wave8 +
              row.wave9 +
              row.wave10 +
              row.wave11
          )}
        </td>
      </tr>
      {/* Conditionally rendered details row for mobile */}
      {isExpanded && (
        <tr className="sm:hidden bg-gray-50">
          {/* Detail row only on mobile */}
          {/* Span 2 columns: App + Total Rewards column */}
          <td
            colSpan={2}
            className="pl-3 pr-3 py-3 text-xs text-gray-700 border-t border-gray-200 relative z-10 bg-gray-50"
          >
            {/* Increased py */}
            {/* Adjust indentation based on App column: pl-3 (12px) + w-8 (32px) + gap-3 (12px) = 56px */}
            <div className="sm:pl-[56px] space-y-1">
              {/* Add space between lines */}
              <div className="flex justify-between items-center w-full">
                {/* Flex layout for Week 1 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 1:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave1)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 2 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 2:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave2)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 3 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 3:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave3)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 4 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 4:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave4)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 5 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 5:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave5)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 6 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 6:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave6)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 7 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 7:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave7)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 8 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 8:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave8)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 9 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 9:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave9)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 10 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 10:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave10)} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 11 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 11:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumberSafe(row.wave11)} WLD
                </span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function RewardsPage({
  metadata,
  weeklyRewards,
}: {
  metadata: TopApp[];
  weeklyRewards: WeeklyDevRewardsJson;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const season = searchParams.get("season") || "2";

  // Season 2 dataset (from weekly rewards endpoint)
  const logoByAppId = useMemo(() => {
    const m = new Map<string, string>();
    for (const app of metadata) {
      if (app.logo_img_url) m.set(app.app_id, app.logo_img_url);
    }
    return m;
  }, [metadata]);

  const { s2Weeks, s2Rows } = useMemo(() => {
    const weeks = weeklyRewards.rewards
      .map((r) => (r.week || "").toString().split("T")[0])
      .sort();
    const appMap = new Map<string, Season2Row>();
    for (const w of weeklyRewards.rewards) {
      const weekKey = (w.week || "").toString().split("T")[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const ar of w.app_rewards as any[]) {
        const raw = ar.rewards_usd;
        const cleaned =
          typeof raw === "string" ? raw.replace(/[,_\s]/g, "") : raw;
        const parsed = typeof cleaned === "number" ? cleaned : Number(cleaned);
        const reward = Number.isFinite(parsed) ? parsed : 0;
        const existing = appMap.get(ar.app_id);
        if (!existing) {
          appMap.set(ar.app_id, {
            app_id: ar.app_id,
            name: ar.app_name,
            logo_img_url: logoByAppId.get(ar.app_id) || "",
            rewardsByWeek: { [weekKey]: reward },
            total: reward,
            category: ar.app_category,
          });
        } else {
          existing.rewardsByWeek[weekKey] = reward;
          existing.total = (existing.total || 0) + reward;
          if (!existing.category && ar.app_category)
            existing.category = ar.app_category;
        }
      }
    }
    return { s2Weeks: weeks, s2Rows: Array.from(appMap.values()) };
  }, [weeklyRewards, logoByAppId]);

  const weekIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    s2Weeks.forEach((w, i) => map.set(w, i + 1));
    return map;
  }, [s2Weeks]);

  const latestWeek = s2Weeks.length ? s2Weeks[s2Weeks.length - 1] : "total";
  const s2SortField = searchParams.get("s2sort") || latestWeek;
  const s2Direction = searchParams.get("s2dir") || "desc";
  const s2Category = (searchParams.get("s2cat") || "all") as
    | "all"
    | "Airdrop"
    | "New Non Airdrop"
    | "Non Airdrop";

  const s2RowsFiltered = useMemo(() => {
    if (s2Category === "all") return s2Rows;
    return s2Rows.filter((r) => r.category === s2Category);
  }, [s2Rows, s2Category]);

  const sortedS2 = useMemo(() => {
    const multiplier = s2Direction === "asc" ? 1 : -1;
    return [...s2RowsFiltered].sort((a, b) => {
      const aVal =
        s2SortField === "total" ? a.total : a.rewardsByWeek[s2SortField] || 0;
      const bVal =
        s2SortField === "total" ? b.total : b.rewardsByWeek[s2SortField] || 0;
      return (aVal - bVal) * multiplier;
    });
  }, [s2RowsFiltered, s2SortField, s2Direction]);

  function handleS2Sort(field: string) {
    const params = new URLSearchParams(searchParams.toString());
    const nextDir =
      s2SortField === field && s2Direction === "desc" ? "asc" : "desc";
    params.set("season", "2");
    params.set("s2sort", field);
    params.set("s2dir", nextDir);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function setSeason(nextSeason: "1" | "2") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", nextSeason);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function setS2Category(
    cat: "all" | "Airdrop" | "New Non Airdrop" | "Non Airdrop"
  ) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", "2");
    params.set("s2cat", cat);
    router.replace(`${pathname}?${params.toString()}`);
  }

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const sort = searchParams.get("sort") || "wave11";
  const direction = searchParams.get("direction") || "desc";

  const data = useMemo(() => {
    const base = getRewardsTableData(metadata);
    const sorted = [...base].sort((a, b) => {
      const multiplier = direction === "asc" ? 1 : -1;
      return (
        ((a[
          sort as
            | "wave1"
            | "wave2"
            | "wave3"
            | "wave4"
            | "wave5"
            | "wave6"
            | "wave7"
            | "wave8"
            | "wave9"
            | "wave10"
        ] || 0) -
          (b[
            sort as
              | "wave1"
              | "wave2"
              | "wave3"
              | "wave4"
              | "wave5"
              | "wave6"
              | "wave7"
              | "wave8"
              | "wave9"
              | "wave10"
          ] || 0)) *
        multiplier
      );
    });
    return sorted;
  }, [sort, direction, metadata]);

  function handleSort(
    field:
      | "wave1"
      | "wave2"
      | "wave3"
      | "wave4"
      | "wave5"
      | "wave6"
      | "wave7"
      | "wave8"
      | "wave9"
      | "wave10"
      | "wave11"
  ) {
    let nextDirection = "desc";
    if (sort === field) {
      nextDirection = direction === "desc" ? "asc" : "desc";
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", field);
    params.set("direction", nextDirection);
    router.replace(`${pathname}?${params.toString()}`);
  }

  // Function to toggle row expansion
  const toggleRowExpansion = (app_id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(app_id)) {
        next.delete(app_id);
      } else {
        next.add(app_id);
      }
      return next;
    });
  };

  // Calculate rewards summary
  const weekTotal =
    season === "1"
      ? data.reduce((sum, app) => sum + app.wave11, 0)
      : sortedS2.reduce(
          (sum, app) => sum + (app.rewardsByWeek[latestWeek] || 0),
          0
        );
  const totalAllTime =
    season === "1"
      ? data.reduce(
          (sum, app) =>
            sum +
            app.wave1 +
            app.wave2 +
            app.wave3 +
            app.wave4 +
            app.wave5 +
            app.wave6 +
            app.wave7 +
            app.wave8 +
            app.wave9 +
            app.wave10 +
            app.wave11,
          0
        )
      : sortedS2.reduce((sum, app) => sum + app.total, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <header className="border-b border-gray-200 bg-white">
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
              <Link href="/" className="text-xl font-medium text-gray-900">
                Summary
              </Link>
              <Link
                href="/rewards"
                className="text-xl font-medium text-gray-900 underline"
              >
                Rewards
              </Link>
              <Link
                href="/country-ranks"
                className="text-xl font-medium text-gray-900"
              >
                Country Rankings
              </Link>
            </div>
            <AnalyticsWrapper>
              <SearchField />
            </AnalyticsWrapper>
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
            <MobileNav currentPage="Rewards" />
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden px-4 pb-4">
            <div className="w-full">
              <AnalyticsWrapper>
                <SearchField />
              </AnalyticsWrapper>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-900">
                Rewards (7d)
              </h2>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              <span className="inline-flex items-center gap-2">
                <Image
                  src="/wld-token.png"
                  alt="WLD"
                  width={28}
                  height={28}
                  className="inline-block"
                />
                {weekTotal.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Total rewards distributed in the most recent wave
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-900">
                Rewards (All Time)
              </h2>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              <span className="inline-flex items-center gap-2">
                <Image
                  src="/wld-token.png"
                  alt="WLD"
                  width={28}
                  height={28}
                  className="inline-block"
                />
                {totalAllTime.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Total rewards distributed across all weeks
            </div>
          </div>
        </div>
        {/* Season Toggle */}
        <div className="mb-4 flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg border ${
              season === "2"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setSeason("2")}
          >
            Season 2
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${
              season === "1"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setSeason("1")}
          >
            Season 1
          </button>
        </div>

        {season === "2" ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-3 sm:py-4 text-sm text-gray-500 align-middle hidden sm:table-cell w-[48px] min-w-[48px] max-w-[48px] sticky left-0 z-30 bg-white">
                    #
                  </th>
                  <th className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-3 sm:py-4 align-middle sticky left-0 sm:left-[48px] z-25 bg-white text-left text-xs font-medium text-gray-500 uppercase before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[52px] before:bg-white before:-z-10">
                    App
                  </th>
                  <th className="px-3 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                    Category
                  </th>
                  {s2Weeks.map((w, idx) => {
                    const isActive = s2SortField === w;
                    return (
                      <th
                        key={w}
                        onClick={() => handleS2Sort(w)}
                        className="px-2 sm:px-3 py-3 sm:py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell cursor-pointer select-none"
                        title={w}
                      >
                        <span className="inline-flex items-center gap-1">
                          {`Week ${idx + 1}`}
                          {isActive ? (
                            s2Direction === "desc" ? (
                              <ChevronDownIcon className="h-4 w-4 text-blue-500" />
                            ) : (
                              <ChevronUpIcon className="h-4 w-4 text-blue-500" />
                            )
                          ) : (
                            <ChevronUpIcon className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                          )}
                        </span>
                      </th>
                    );
                  })}
                  <th
                    onClick={() => handleS2Sort("total")}
                    className="px-2 sm:px-3 py-3 sm:py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell cursor-pointer select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      Total
                      {s2SortField === "total" ? (
                        s2Direction === "desc" ? (
                          <ChevronDownIcon className="h-4 w-4 text-blue-500" />
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 text-blue-500" />
                        )
                      ) : null}
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap table-cell sm:hidden"
                    title={s2SortField === "total" ? undefined : s2SortField}
                  >
                    {s2SortField === "total"
                      ? "Total"
                      : `Week ${weekIndexMap.get(s2SortField) ?? ""}`}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Category filter row */}
                <tr>
                  <td className="px-3 py-2" colSpan={2}>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Filter:</span>
                      <button
                        className={`px-2 py-1 rounded border ${
                          s2Category === "all"
                            ? "bg-blue-100 border-blue-300 text-blue-800"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                        onClick={() => setS2Category("all")}
                      >
                        All
                      </button>
                      <button
                        className={`px-2 py-1 rounded border ${
                          s2Category === "Airdrop"
                            ? "bg-blue-100 border-blue-300 text-blue-800"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                        onClick={() => setS2Category("Airdrop")}
                      >
                        Airdrop
                      </button>
                      <button
                        className={`px-2 py-1 rounded border ${
                          s2Category === "New Non Airdrop"
                            ? "bg-blue-100 border-blue-300 text-blue-800"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                        onClick={() => setS2Category("New Non Airdrop")}
                      >
                        New Non Airdrop
                      </button>
                      <button
                        className={`px-2 py-1 rounded border ${
                          s2Category === "Non Airdrop"
                            ? "bg-blue-100 border-blue-300 text-blue-800"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                        onClick={() => setS2Category("Non Airdrop")}
                      >
                        Non Airdrop
                      </button>
                    </div>
                  </td>
                  <td
                    className="hidden sm:table-cell"
                    colSpan={s2Weeks.length + 2}
                  ></td>
                </tr>
                {sortedS2.map((row, i) => (
                  <tr
                    key={row.app_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-3 sm:py-4 text-sm text-gray-500 align-middle hidden sm:table-cell w-[48px] min-w-[48px] max-w-[48px] sticky left-0 z-30 bg-white">
                      {i + 1}
                    </td>
                    <td className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-3 sm:py-4 align-middle sticky left-0 sm:left-[48px] z-25 bg-white min-w-0 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[52px] before:bg-white before:-z-10">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          {row.logo_img_url ? (
                            <Image
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover bg-gray-100"
                              src={row.logo_img_url}
                              alt={row.name}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs font-medium">
                                {row.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm md:text-base font-medium text-gray-900">
                            {row.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell text-xs text-gray-700 font-medium">
                      <span
                        className={`px-2 py-1 rounded-full ${categoryBadgeClass(
                          row.category
                        )}`}
                      >
                        {row.category || "—"}
                      </span>
                    </td>
                    {s2Weeks.map((w) => (
                      <td
                        key={w}
                        className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle hidden sm:table-cell"
                      >
                        {formatNumberSafe(row.rewardsByWeek[w] || 0)}
                      </td>
                    ))}
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle hidden sm:table-cell">
                      {formatNumberSafe(row.total ?? 0)}
                    </td>
                    {/* Mobile single value */}
                    <td className="px-3 py-3 sm:py-4 text-right text-xs font-medium text-gray-900 whitespace-nowrap align-middle table-cell sm:hidden">
                      {formatNumberSafe(
                        s2SortField === "total"
                          ? row.total
                          : row.rewardsByWeek[s2SortField] || 0
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-3 sm:py-4 text-sm text-gray-500 align-middle hidden sm:table-cell w-[48px] min-w-[48px] max-w-[48px] sticky left-0 z-30 bg-white">
                    #
                  </th>
                  <th className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-3 sm:py-4 align-middle sticky left-0 sm:left-[48px] z-25 bg-white text-left text-xs font-medium text-gray-500 uppercase before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[52px] before:bg-white before:-z-10">
                    App
                  </th>
                  <SortHeader
                    label="Week 1 Reward"
                    field="wave1"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave1")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 2 Reward"
                    field="wave2"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave2")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 3 Reward"
                    field="wave3"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave3")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 4 Reward"
                    field="wave4"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave4")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 5 Reward"
                    field="wave5"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave5")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 6 Reward"
                    field="wave6"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave6")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 7 Reward"
                    field="wave7"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave7")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 8 Reward"
                    field="wave8"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave8")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 9 Reward"
                    field="wave9"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave9")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 10 Reward"
                    field="wave10"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave10")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Week 11 Reward"
                    field="wave11"
                    currentSort={sort}
                    currentDirection={direction}
                    onClick={() => handleSort("wave11")}
                    className="px-2 sm:px-3 hidden sm:table-cell"
                  />
                  <th
                    scope="col"
                    className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap table-cell sm:hidden"
                  >
                    Total Rewards
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row, i) => (
                  <RewardsTableRowComponent
                    key={row.app_id}
                    row={row}
                    index={i}
                    isExpanded={expandedRows.has(row.app_id)}
                    onToggle={() => toggleRowExpansion(row.app_id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 text-center text-sm text-gray-500">
          Data from World Foundation • Last loaded:
          {(() => {
            const now = new Date();
            now.setMinutes(0, 0, 0); // round to nearest hour (down)
            return now.toLocaleString();
          })()}
        </div>
      </main>

      <ScrollToTop />
    </div>
  );
}
