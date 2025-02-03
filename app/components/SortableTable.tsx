"use server";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { AppData, SortField, SortDirection } from "../types";
import { InteractiveTableRow } from "./InteractiveTableRow";

function SortHeader({
  label,
  field,
  currentSort,
  currentDirection,
}: {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentDirection: SortDirection;
}) {
  const isActive = currentSort === field;
  const nextDirection =
    isActive && currentDirection === "desc" ? "asc" : "desc";

  return (
    <th
      scope="col"
      className="w-[60px] sm:w-auto px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
    >
      <a
        href={`?sort=${field}&direction=${nextDirection}`}
        className="flex items-center justify-end gap-1 group hover:text-gray-700 dark:hover:text-gray-100"
      >
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">
          {label === "Unique Users (7d)" ? "7d" : "All"}
        </span>
        <div className="flex flex-col">
          {isActive && currentDirection === "desc" ? (
            <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : isActive && currentDirection === "asc" ? (
            <ChevronUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <div className="opacity-0 group-hover:opacity-50">
              <ChevronUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          )}
        </div>
      </a>
    </th>
  );
}

export async function SortableTable({
  data,
  sortField,
  sortDirection,
}: {
  data: AppData[];
  sortField: SortField;
  sortDirection: SortDirection;
}) {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="w-8 sm:w-12 px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              #
            </th>
            <th
              scope="col"
              className="w-auto px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              App (Click to Open)
            </th>
            <SortHeader
              label="Unique Users (7d)"
              field="unique_users_7d"
              currentSort={sortField}
              currentDirection={sortDirection}
            />
            <SortHeader
              label="Unique Users (All Time)"
              field="unique_users_all_time"
              currentSort={sortField}
              currentDirection={sortDirection}
            />
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((app, index) => (
            <InteractiveTableRow key={app.app_id} app={app} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
