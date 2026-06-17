"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deletePost } from "@/actions/posts";

export default function DeletePostButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    setPending(true);
    await deletePost(id);
    setPending(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      title="حذف"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}
