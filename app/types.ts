export interface AppData {
  app_id: string;
  name: string;
  logo_img_url: string;
  unique_users_7d: number;
  unique_users_all_time: number;
  total_users_7d: number;
  total_users_all_time: number;
  reward: number;
  rank: number;
}

export interface TopApp {
  app_id: string;
  name: string;
  logo_img_url: string;
}

export type AppCategory = "Airdrop" | "New Non Airdrop" | "Non Airdrop";

export interface ApiResponse {
  app_rankings: {
    top_apps: TopApp[];
  };
}

export interface MetricsResponse {
  app_id: string;
  unique_users_last_7_days: CountryData[];
  unique_users: number;
  new_users_last_7_days: CountryData[];
  total_users_last_7_days: CountryData[];
  total_users: number;
}

export type CountryData = {
  country: string;
  value: number;
};

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
  wave11: number;
}

export type SortField =
  | "unique_users_7d"
  | "unique_users_all_time"
  | "total_users_7d"
  | "total_users_all_time"
  | "reward"
  | "rank";
export type SortDirection = "asc" | "desc";

// Season 2 weekly rewards JSON from
// https://metrics.worldcoin.org/weekly_dev_rewards.json
export interface WeeklyDevRewardsJson {
  rewards: {
    app_rewards: {
      app_id: string;
      app_name: string;
      rewards_usd: number;
      reward_wld: number;
      app_category?: AppCategory;
    }[];
    week: string; // e.g. "2025-08-18"
  }[];
  snapshot_timestamp: string;
}

// Internal shape for Season 2 table rows
export interface Season2Row {
  app_id: string;
  name: string;
  logo_img_url: string;
  rewardsByWeek: Record<string, number>;
  total: number;
  categoriesByWeek: Record<string, AppCategory | undefined>;
  latestCategory?: AppCategory;
  categoryHistory: AppCategory[];
}
