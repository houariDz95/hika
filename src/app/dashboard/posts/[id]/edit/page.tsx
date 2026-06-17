import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostForm from "@/components/PostForm";
import type { Post } from "@/types";

export const metadata = {
  title: "تعديل المقال",
};

export default async function EditPostPage({
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
    .single();

  if (!post) notFound();

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <h2 className="mb-6 font-arabic text-xl font-bold text-neutral-900">
        تعديل المقال
      </h2>
      <PostForm post={post as Post} />
    </div>
  );
}
