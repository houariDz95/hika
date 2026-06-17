import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format-date";
import SubmissionActions from "@/components/SubmissionActions";
import type { UserStory, SubmissionStatus } from "@/types";

export const metadata = {
  title: "القصص المرسلة",
};

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "قيد الانتظار",
  approved: "منشورة",
  rejected: "مرفوضة",
};

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = (status as SubmissionStatus) || "pending";

  const supabase = await createClient();
  const { data: stories } = await supabase
    .from("user_stories")
    .select("*")
    .eq("status", filter)
    .order("created_at", { ascending: false });

  const list = (stories as UserStory[]) || [];
  console.log(stories)
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected"] as SubmissionStatus[]).map(
          (s) => (
            <a
              key={s}
              href={`/dashboard/submissions?status=${s}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === s
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300"
              }`}
            >
              {STATUS_LABELS[s]}
            </a>
          )
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {list.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-500">
            لا توجد قصص في هذه الحالة.
          </p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {list.map((story) => (
              <div key={story.id} className="p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-arabic text-lg font-bold text-neutral-900">
                      {story.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-400">
                      بقلم: {story.name || "مجهول"} •{" "}
                      {formatDate(story.created_at)} •{" "}
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${STATUS_STYLES[story.status]}`}
                      >
                        {STATUS_LABELS[story.status]}
                      </span>
                    </p>
                  </div>
                  <SubmissionActions id={story.id} status={story.status} />
                </div>
                <p className="line-clamp-3 text-sm leading-7 text-neutral-600">
                  {story.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
