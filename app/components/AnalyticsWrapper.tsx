"use client";

import { useEffect, createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { analytics } from "../lib/posthog";

// Component for tracking page views without wrapping content
export function PageViewTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    analytics.capture("page_view", {
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
  const analyticsContext: AnalyticsContextType = {
    trackSearch: (term) => {
      analytics.capture("search_performed", {
        search_term: term,
      });
    },
    trackMiniAppOpen: (appId, appName, source) => {
      analytics.capture("mini_app_opened", {
        app_id: appId,
        app_name: appName,
        source: source,
      });
    },
    trackSort: (field, direction) => {
      analytics.capture("table_sorted", {
        sort_field: field,
        sort_direction: direction,
      });
    },
  };

  return (
    <AnalyticsContext.Provider value={analyticsContext}>
      {children}
    </AnalyticsContext.Provider>
  );
}
