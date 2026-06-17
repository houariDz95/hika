import Link from "next/link";
import { CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";

export default function CategoryFilter({
  active,
  basePath = "/stories",
  query,
}: {
  active?: string;
  basePath?: string;
  query?: string;
}) {
  const buildHref = (category?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildHref(undefined)}
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition",
          !active
            ? "border-primary-600 bg-primary-600 text-white"
            : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300"
        )}
      >
        الكل
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={buildHref(cat)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition",
            active === cat
              ? "border-primary-600 bg-primary-600 text-white"
              : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300"
          )}
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
