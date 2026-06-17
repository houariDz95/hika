import Link from "next/link";
import { LayoutDashboard, FileText, Inbox, PlusCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-arabic text-3xl font-bold text-neutral-900">
        لوحة التحكم
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-56">
          <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-2 lg:flex-col lg:overflow-visible">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <LayoutDashboard size={16} />
              نظرة عامة
            </Link>
            <Link
              href="/dashboard/posts/new"
              className="flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <PlusCircle size={16} />
              مقال جديد
            </Link>
            <Link
              href="/dashboard/submissions"
              className="flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <Inbox size={16} />
              القصص المرسلة
            </Link>
          </nav>
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
