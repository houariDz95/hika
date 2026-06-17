import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import { ArrowLeft, PenLine } from "lucide-react";
import type { Post } from "@/types";
import { CATEGORIES } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: featured } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("views", { ascending: false })
    .limit(1);

  const latest = (posts as Post[]) || [];
  const featuredPost = featured?.[0] as Post | undefined;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <h1 className="font-arabic text-3xl font-bold leading-tight text-neutral-900 sm:text-5xl">
            حكاية تستحق أن تُروى
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-neutral-600 sm:text-lg">
            منصة عربية لمشاركة القصص: رومانسية، رعب، غموض، خيانة وانتقام.
            اقرأ قصصًا مميزة أو شارك قصتك الخاصة مع العالم.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/stories"
              className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              تصفح القصص
            </Link>
            <Link
              href="/submit"
              className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-primary-300"
            >
              <PenLine size={15} />
              شارك قصتك
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/stories?category=${encodeURIComponent(cat)}`}
              className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-primary-300 hover:text-primary-700"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featuredPost && (
        <section className="mx-auto max-w-5xl px-4 pb-4 sm:px-6">
          <h2 className="mb-4 font-arabic text-2xl font-bold text-neutral-900">
            القصة الأكثر قراءة
          </h2>
          <PostCard post={featuredPost} />
        </section>
      )}

      {/* Latest */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-arabic text-2xl font-bold text-neutral-900">
            أحدث القصص
          </h2>
          <Link
            href="/stories"
            className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            عرض الكل
            <ArrowLeft size={14} />
          </Link>
        </div>

        {latest.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center text-neutral-500">
            لا توجد قصص منشورة حتى الآن.
          </div>
        ) : (
          <div className="grid gap-4">
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
