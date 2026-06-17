import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format-date";
import DeletePostButton from "@/components/DeletePostButton";
import { Pencil, Eye, Heart, FileText, Inbox, BookOpen } from "lucide-react";
import type { Post } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const { count: pendingCount } = await supabase
    .from("user_stories")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const list = (posts as Post[]) || [];
  const publishedCount = list.filter((p) => p.status === "published").length;
  const draftCount = list.filter((p) => p.status === "draft").length;
  const totalViews = list.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<BookOpen size={18} />} label="إجمالي المقالات" value={list.length} />
        <StatCard icon={<FileText size={18} />} label="منشورة" value={publishedCount} />
        <StatCard icon={<Eye size={18} />} label="إجمالي المشاهدات" value={totalViews} />
        <StatCard
          icon={<Inbox size={18} />}
          label="قصص بانتظار المراجعة"
          value={pendingCount || 0}
          highlight={!!pendingCount}
          href="/dashboard/submissions"
        />
      </div>

      {/* Posts table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="font-arabic text-lg font-bold text-neutral-900">
            جميع المقالات ({list.length})
          </h2>
          <Link
            href="/dashboard/posts/new"
            className="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            + مقال جديد
          </Link>
        </div>

        {list.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-500">
            لا توجد مقالات حتى الآن.
          </p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {list.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-primary-300">
                      حكاية
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-arabic text-base font-semibold text-neutral-900">
                    {post.title}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                    <span>{formatDate(post.created_at)}</span>
                    <span
                      className={
                        post.status === "published"
                          ? "rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-700"
                          : "rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-500"
                      }
                    >
                      {post.status === "published" ? "منشور" : "مسودة"}
                    </span>
                    {post.category && <span>{post.category}</span>}
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} /> {post.likes}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/dashboard/posts/${post.id}/edit`}
                    title="تعديل"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-primary-50 hover:text-primary-600"
                  >
                    <Pencil size={15} />
                  </Link>
                  <DeletePostButton id={post.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
  href?: string;
}) {
  const content = (
    <div
      className={`flex flex-col gap-2 rounded-2xl border p-4 ${
        highlight
          ? "border-primary-200 bg-primary-50"
          : "border-neutral-200 bg-white"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          highlight ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
