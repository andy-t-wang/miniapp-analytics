"use client";

import { useEffect, createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { posthog } from "../lib/posthog";

// Component for tracking page views without wrapping content
export function PageViewTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    posthog.capture("page_view", {
      page: "mini_apps_stats",
      search_term: searchParams.get("search") || undefined,
      sort_field: searchParams.get("sort") || "total_users_7d",
      sort_direction: searchParams.get("direction") || "desc",
    });
  }, [searchParams]);

  return null;
}

// Analytics context and hook
type AnalyticsContextType = {
  trackSearch: (term: string) => void;
  trackMiniAppOpen: (
    appId: string,
    appName: string,
    source: "mobile" | "desktop"
  ) => void;
  trackSort: (field: string, direction: string) => void;
};

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsWrapper");
  }
  return context;
}

// Wrapper that provides analytics tracking functions
export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const analytics: AnalyticsContextType = {
    trackSearch: (term) => {
      posthog.capture("search_performed", {
        search_term: term,
      });
    },
    trackMiniAppOpen: (appId, appName, source) => {
      posthog.capture("mini_app_opened", {
        app_id: appId,
        app_name: appName,
        source: source,
      });
    },
    trackSort: (field, direction) => {
      posthog.capture("table_sorted", {
        sort_field: field,
        sort_direction: direction,
      });
    },
  };

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}
