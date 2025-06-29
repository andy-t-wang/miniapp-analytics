export interface AppData {
  app_id: string;
  name: string;
  logo_img_url: string;
  unique_users_7d: number;
  unique_users_all_time: number;
  total_users_7d: number;
  total_users_all_time: number;
  reward: number;
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
  total_users_last_7_days: number;
  total_users: number;
}

export interface RewardsTableRow {
  app_id: string;
  name: string;
  logo_img_url: string;
  wave1: number;
  wave2: number;
  wave3: number;
  wave4: number;
  wave5: number;
  wave6: number;
  wave7: number;
  wave8: number;
  wave9: number;
  wave10: number;
}

export type SortField =
  | "unique_users_7d"
  | "unique_users_all_time"
  | "total_users_7d"
  | "total_users_all_time"
  | "reward";
export type SortDirection = "asc" | "desc";
