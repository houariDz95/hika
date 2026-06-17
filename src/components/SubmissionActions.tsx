"use client";

import { useState } from "react";
import { Check, X, Trash2, Loader2 } from "lucide-react";
import {
  approveUserStory,
  rejectUserStory,
  deleteUserStory,
} from "@/actions/user-stories";

export default function SubmissionActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, setPending] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setPending(key);
    await fn();
    setPending(null);
  };

  if (status === "pending") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => run("approve", () => approveUserStory(id))}
          disabled={!!pending}
          className="flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {pending === "approve" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} />
          )}
          نشر
        </button>
        <button
          onClick={() => run("reject", () => rejectUserStory(id))}
          disabled={!!pending}
          className="flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
        >
          {pending === "reject" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <X size={14} />
          )}
          رفض
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => run("delete", () => deleteUserStory(id))}
      disabled={!!pending}
      title="حذف"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      {pending === "delete" ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Trash2 size={15} />
      )}
    </button>
  );
}
