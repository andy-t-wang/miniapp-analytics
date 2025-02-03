import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { AppData, SortField, SortDirection } from "../types";

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
      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
    >
      <a
        href={`?sort=${field}&direction=${nextDirection}`}
        className="flex items-center justify-end gap-1 group hover:text-gray-700 dark:hover:text-gray-100"
      >
        {label}
        <div className="flex flex-col">
          {isActive && currentDirection === "desc" ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : isActive && currentDirection === "asc" ? (
            <ChevronUpIcon className="h-4 w-4" />
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
  searchParams,
}: {
  data: AppData[];
  searchParams: { sort?: string; direction?: string };
}) {
  const sortField = (searchParams.sort || "unique_users_7d") as SortField;
  const sortDirection = (searchParams.direction || "desc") as SortDirection;

  // Sort the data
  const sortedApps = [...data].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  if (sortedApps.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Rank
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                App
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
            {sortedApps.map((app, index) => (
              <tr
                key={app.app_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={app.logo_img_url}
                        alt={app.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {app.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                  {app.unique_users_7d.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                  {app.unique_users_all_time.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
