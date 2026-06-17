import { BookOpen } from "lucide-react";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "تسجيل الدخول",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
          <BookOpen size={20} />
        </span>
        <span className="font-arabic text-2xl font-bold">حكاية</span>
      </div>

      <div className="w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <LoginForm />
      </div>
    </div>
  );
}
