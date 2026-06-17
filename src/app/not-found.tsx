import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-400">
        <BookOpen size={28} />
      </span>
      <h1 className="font-arabic text-3xl font-bold text-neutral-900">
        404 — القصة غير موجودة
      </h1>
      <p className="mt-2 text-sm leading-7 text-neutral-500">
        عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
