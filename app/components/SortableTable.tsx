import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { AppData, SortField, SortDirection } from "../types";
import { InteractiveTableRow } from "./InteractiveTableRow";
import { ReactNode } from "react";

function SortHeader({
  label,
  field,
  currentSort,
  currentDirection,
  className = "",
}: {
  label: ReactNode;
  field: SortField;
  currentSort: SortField;
  currentDirection: SortDirection;
  className?: string;
}) {
  const isActive = currentSort === field;
  const nextDirection =
    isActive && currentDirection === "desc" ? "asc" : "desc";

  return (
    <th
      scope="col"
      className={`px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${className}`}
    >
      <a
        href={`?sort=${field}&direction=${nextDirection}`}
        className="flex items-center justify-end gap-1 group hover:text-gray-700"
      >
        {label}
        <div className="flex flex-col">
          {isActive && currentDirection === "desc" ? (
            <ChevronDownIcon className="h-4 w-4 text-blue-500" />
          ) : isActive && currentDirection === "asc" ? (
            <ChevronUpIcon className="h-4 w-4 text-blue-500" />
          ) : (
            <div className="opacity-0 group-hover:opacity-50">
              <ChevronUpIcon className="h-4 w-4" />
            </div>
          )}
        </div>
      </a>
    </th>
  );
}

export function SortableTable({
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
      <div className="text-center text-gray-500 p-6">No data available</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th
              scope="col"
              className="pl-3 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"
            >
              #
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              App
            </th>
            <SortHeader
              label={
                <span>
                  <span className="sm:hidden">Unique (7d)</span>
                  <span className="hidden sm:inline">Unique Users (7d)</span>
                </span>
              }
              field="unique_users_7d"
              currentSort={sortField}
              currentDirection={sortDirection}
            />
            <SortHeader
              label="Unique Users (All)"
              field="unique_users_all_time"
              currentSort={sortField}
              currentDirection={sortDirection}
              className="hidden sm:table-cell"
            />
            <SortHeader
              label="Total Opens (7d)"
              field="total_users_7d"
              currentSort={sortField}
              currentDirection={sortDirection}
              className="hidden sm:table-cell"
            />
            <SortHeader
              label="Total Opens (All)"
              field="total_users_all_time"
              currentSort={sortField}
              currentDirection={sortDirection}
              className="hidden sm:table-cell"
            />
            <SortHeader
              label="Wave 1 Reward"
              field="reward"
              currentSort={sortField}
              currentDirection={sortDirection}
              className="hidden sm:table-cell"
            />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((app, index) => (
            <InteractiveTableRow key={app.app_id} app={app} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
