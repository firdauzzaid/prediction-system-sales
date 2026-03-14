"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

// Mapping path ke nama yang ditampilkan
const pathNames: Record<string, string> = {
  dashboard: "Dashboard",
  sales: "Sales Data",
  predictions: "Predictions",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  // Split pathname dan filter empty strings
  const paths = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const breadcrumbs = paths.map((path, index) => {
    // Build URL up to this point
    const url = "/" + paths.slice(0, index + 1).join("/");

    // Get display name (capitalize if not in mapping)
    const displayName =
      pathNames[path] || path.charAt(0).toUpperCase() + path.slice(1);

    return {
      name: displayName,
      path: path,
      url: url,
      isLast: index === paths.length - 1,
    };
  });

  // If we're at root, show just Dashboard
  if (breadcrumbs.length === 0) {
    return (
      <div className="hidden sm:flex items-center text-sm text-gray-600">
        <Home className="w-4 h-4 mr-1" />
        <span className="font-medium text-gray-900">Dashboard</span>
      </div>
    );
  }

  return (
    <nav
      className="hidden sm:flex items-center text-sm"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {/* Home icon */}
        <li>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {/* Breadcrumb items */}
        {breadcrumbs.map((item, index) => (
          <li key={item.url} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            {item.isLast ? (
              <span className="font-medium text-blue-700">{item.name}</span>
            ) : (
              <Link
                href={item.url}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
