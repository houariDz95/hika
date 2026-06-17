import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { incrementViews } from "@/actions/posts";
import { formatDate } from "@/lib/format-date";
import LikeButton from "@/components/LikeButton";
import PostCard from "@/components/PostCard";
import { Eye, Calendar, ArrowRight } from "lucide-react";
import type { Post } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("title, content")
    .eq("id", id)
    .single();

  if (!data) return { title: "القصة غير موجودة" };

  return {
    title: data.title,
    description: data.content.slice(0, 160),
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  console.log("Post data:", post.image_url);
  // Fire-and-forget view increment
  incrementViews(id);

  const typedPost = post as Post;

  const { data: related } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/stories"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-primary-600"
      >
        <ArrowRight size={14} />
        رجوع إلى القصص
      </Link>

      {typedPost.category && (
        <span className="mb-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          {typedPost.category}
        </span>
      )}

      <h1 className="font-arabic text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl">
        {typedPost.title}
      </h1>

      <div className="mt-4 flex items-center gap-4 text-sm text-neutral-400">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {formatDate(typedPost.created_at)}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye size={14} />
          {typedPost.views} مشاهدة
        </span>
      </div>

      {typedPost.image_url && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={typedPost.image_url}
            alt={typedPost.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap font-arabic text-lg leading-9 text-neutral-800">
        {typedPost.content}
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6">
        <LikeButton postId={typedPost.id} initialLikes={typedPost.likes} />
      </div>

      {related && related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-arabic text-2xl font-bold text-neutral-900">
            قصص أخرى قد تهمك
          </h2>
          <div className="grid gap-4">
            {(related as Post[]).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
