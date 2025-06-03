"use client";
import Image from "next/image";
import { AnalyticsWrapper } from "../components/AnalyticsWrapper";
import { SearchField } from "../components/SearchField";
import { PageViewTracker } from "../components/AnalyticsWrapper";
import { AppData, RewardsTableRow } from "../types";
import grants1 from "../../public/grants1.json";
import grants2 from "../../public/grants2.json";
import grants3 from "../../public/grants3.json";
import grants4 from "../../public/grants4.json";
import grants5 from "../../public/grants5.json";
import grants6 from "../../public/grants6.json";
import grants7 from "../../public/grants7.json";
import grants8 from "../../public/grants8.json";
import grants9 from "../../public/grants9.json";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

function getRewardsTableData(appsMetadataData?: AppData[]): RewardsTableRow[] {
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
          logo_img_url: "",
        });
      }
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
    | "wave9";
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
  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer group"
        onClick={onToggle}
      >
        <td className="pl-3 pr-2 py-3 sm:py-4 text-sm text-gray-500 align-middle hidden sm:table-cell sm:w-12 sticky left-0 z-10 bg-white hover:bg-gray-50">
          {index + 1}
        </td>
        <td className="sm:pl-6 pr-2 sm:px-6 py-3 sm:py-4 align-middle sticky sm:left-12 left-0 z-10 bg-white hover:bg-gray-50">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
              <Image
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover bg-gray-100"
                src={row.logo_img_url}
                alt={row.name}
                width={40}
                height={40}
              />
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
          {row.wave1.toLocaleString()}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {row.wave2.toLocaleString()}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {row.wave3.toLocaleString()}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {row.wave4.toLocaleString()}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {row.wave5.toLocaleString()}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {row.wave6.toLocaleString()}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {row.wave7.toLocaleString()}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {row.wave8.toLocaleString()}
        </td>
        {/* Hidden on mobile, shown sm and up */}
        <td className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm md:text-base font-medium text-gray-900 whitespace-nowrap align-middle w-16 sm:w-auto hidden sm:table-cell">
          {row.wave9.toLocaleString()}
        </td>
        {/* Shown only on mobile */}
        <td className="px-3 py-3 sm:py-4 text-right text-xs font-medium text-gray-900 whitespace-nowrap align-middle table-cell sm:hidden">
          {(
            row.wave1 +
            row.wave2 +
            row.wave3 +
            row.wave4 +
            row.wave5 +
            row.wave6 +
            row.wave7 +
            row.wave8 +
            row.wave9
          ).toLocaleString()}
        </td>
      </tr>
      {/* Conditionally rendered details row for mobile */}
      {isExpanded && (
        <tr className="sm:hidden bg-gray-50">
          {/* Detail row only on mobile */}
          {/* Span 2 columns: App + Total Rewards column */}
          <td
            colSpan={2}
            className="px-3 py-3 text-xs text-gray-700 border-t border-gray-200"
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
                  {row.wave1.toLocaleString()} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 2 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 2:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {row.wave2.toLocaleString()} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 3 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 3:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {row.wave3.toLocaleString()} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 4 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 4:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {row.wave4.toLocaleString()} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 5 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 5:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {row.wave5.toLocaleString()} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 6 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 6:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {row.wave6.toLocaleString()} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 7 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 7:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {row.wave7.toLocaleString()} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 8 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 8:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {row.wave8.toLocaleString()} WLD
                </span>
              </div>
              <div className="flex justify-between items-center">
                {/* Flex layout for Week 9 */}
                <span className="font-medium text-gray-600 text-sm">
                  Week 9:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {row.wave9.toLocaleString()} WLD
                </span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function RewardsPage({ metadata }: { metadata: AppData[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const sort = searchParams.get("sort") || "wave9";
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
  const weekTotal = data.reduce((sum, app) => sum + app.wave9, 0);
  const totalAllTime = data.reduce(
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
      app.wave9,
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pl-3 pr-2 py-3 sm:py-4 text-sm text-gray-500 align-middle hidden sm:table-cell sm:w-12 sticky left-0 z-10 bg-white">
                  #
                </th>
                <th className="sm:pl-6 pr-2 sm:px-6 py-3 sm:py-4 align-middle sticky text-left text-xs font-medium text-gray-500 uppercase sm:left-8 left-0 z-10 bg-white">
                  App
                </th>
                {/* Hidden on mobile, shown sm and up */}
                <SortHeader
                  label="Week 1 Reward"
                  field="wave1"
                  currentSort={sort}
                  currentDirection={direction}
                  onClick={() => handleSort("wave1")}
                  className="px-2 sm:px-3 hidden sm:table-cell"
                />
                {/* Hidden on mobile, shown sm and up */}
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
                {/* Shown only on mobile */}
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
        <div className="mt-4 text-center text-sm text-gray-500">
          Data from World Foundation • Last loaded:
          {(() => {
            const now = new Date();
            now.setMinutes(0, 0, 0); // round to nearest hour (down)
            return now.toLocaleString();
          })()}
        </div>
      </main>
    </div>
  );
}
