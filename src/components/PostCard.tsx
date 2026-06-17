import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, Calendar } from "lucide-react";
import type { Post } from "@/types";
import { formatDate } from "@/lib/format-date";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/story/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row"
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-neutral-100 sm:h-auto sm:w-56">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 224px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 font-arabic text-3xl font-bold text-primary-300">
            حكاية
          </div>
        )}
        {post.category && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-sm backdrop-blur">
            {post.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-arabic text-xl font-bold leading-snug text-neutral-900 transition group-hover:text-primary-700">
          {post.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-7 text-neutral-600">
          {post.content.replace(/[#*_>`]/g, "").slice(0, 220)}
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {formatDate(post.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={13} />
            {post.likes}
          </span>
        </div>
      </div>
    </Link>
  );
}
