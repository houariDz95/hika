import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <BookOpen size={16} />
          </span>
          <span className="font-arabic text-lg font-bold">حكاية</span>
        </div>
        <p className="max-w-md text-sm leading-7 text-neutral-500">
          منصة عربية لمشاركة القصص والحكايات. اقرأ، استكشف، وشارك قصتك مع
          العالم.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-600">
          <Link href="/" className="hover:text-primary-600">
            الرئيسية
          </Link>
          <Link href="/stories" className="hover:text-primary-600">
            القصص
          </Link>
          <Link href="/submit" className="hover:text-primary-600">
            شارك قصتك
          </Link>
        </nav>
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} حكاية. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
