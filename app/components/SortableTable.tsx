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
      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
    >
      <a
        href={`?sort=${field}&direction=${nextDirection}`}
        className="flex items-center justify-end gap-1 group hover:text-gray-700"
      >
        <span>{label}</span>
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
              className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
            >
              #
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
              label="Unique Users (All)"
              field="unique_users_all_time"
              currentSort={sortField}
              currentDirection={sortDirection}
            />
            <SortHeader
              label="Total Users (7d)"
              field="total_users_7d"
              currentSort={sortField}
              currentDirection={sortDirection}
            />
            <SortHeader
              label="Total Users (All)"
              field="total_users_all_time"
              currentSort={sortField}
              currentDirection={sortDirection}
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
