import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { AdBanner728, AdBannerMobile } from "@/components/AdBanners";
import type { Post } from "@/types";

const PAGE_SIZE = 6;

export const metadata = {
  title: "القصص",
};

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const query = params.q?.trim();
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const supabase = await createClient();

  let dbQuery = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("status", "published");

  if (category) {
    dbQuery = dbQuery.eq("category", category);
  }

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: posts, count } = await dbQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
  const list = (posts as Post[]) || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 space-y-4">
        <h1 className="font-arabic text-3xl font-bold text-neutral-900">
          القصص
        </h1>
        <SearchBar defaultValue={query} />
        <CategoryFilter active={category} query={query} />
      </div>

      <div className="mb-8 hidden lg:block">
        <AdBanner728 />
        <div id="container-515cdc36e4304b0c9d8a061b8f64cad8"></div>
      </div>

      {query && (
        <p className="mb-4 text-sm text-neutral-500">
          نتائج البحث عن: <span className="font-semibold">{query}</span>
          {count !== null && <> — {count} نتيجة</>}
        </p>
      )}

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center text-neutral-500">
          لا توجد قصص مطابقة.
        </div>
      ) : (
        <div className="grid gap-4">
          {list.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/stories"
        searchParams={{ category, q: query }}
      />

      <div className="mt-8 block lg:hidden">
        <AdBannerMobile />
      </div>
    </div>
  );
}
