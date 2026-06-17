"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { likePost } from "@/actions/posts";
import { cn } from "@/lib/utils";

export default function LikeButton({
  postId,
  initialLikes,
}: {
  postId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleClick = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((prev) => prev + 1);
    await likePost(postId);
  };

  return (
    <button
      onClick={handleClick}
      disabled={liked}
      className={cn(
        "flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition",
        liked
          ? "border-primary-200 bg-primary-50 text-primary-600"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:text-primary-600"
      )}
    >
      <Heart size={16} className={cn(liked && "fill-primary-600")} />
      {likes} إعجاب
    </button>
  );
}
