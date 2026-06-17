import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, PenLine, LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";

export default async function Navbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <BookOpen size={18} />
          </span>
          <span className="font-arabic text-xl font-bold text-neutral-900">
            حكاية
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/stories"
            className="rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 sm:px-4"
          >
            القصص
          </Link>
          <Link
            href="/submit"
            className="flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700 sm:px-4"
          >
            <PenLine size={15} />
            <span className="hidden sm:inline">شارك قصتك</span>
            <span className="sm:hidden">شارك</span>
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 sm:px-4"
              >
                <LayoutDashboard size={15} />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  title="تسجيل الخروج"
                  className="flex items-center justify-center rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-red-600"
                >
                  <LogOut size={17} />
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 sm:px-4"
            >
              تسجيل الدخول
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
