export interface AppData {
  app_id: string;
  name: string;
  logo_img_url: string;
  unique_users_7d: number;
  unique_users_all_time: number;
}

export interface TopApp {
  app_id: string;
  name: string;
  logo_img_url: string;
}

export interface ApiResponse {
  app_rankings: {
    top_apps: TopApp[];
  };
}

export interface MetricsResponse {
  app_id: string;
  unique_users_last_7_days: number;
  unique_users: number;
}

export type SortField = "unique_users_7d" | "unique_users_all_time";
export type SortDirection = "asc" | "desc";
