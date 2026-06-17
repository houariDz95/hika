"use client";

import { useActionState, useState } from "react";
import { login, signup } from "@/actions/auth";
import { FormField, inputClass } from "@/components/Form";
import { Loader2, LogIn, UserPlus } from "lucide-react";

export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState(login, null);
  const [signupState, signupAction, signupPending] = useActionState(
    signup,
    null
  );

  const isSignup = mode === "signup";
  const state = isSignup ? signupState : loginState;
  const pending = isSignup ? signupPending : loginPending;
  const action = isSignup ? signupAction : loginAction;

  return (
    <div className="space-y-6">
      <div className="flex rounded-xl bg-neutral-100 p-1">
        <button
          onClick={() => setMode("login") }
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-white text-primary-700 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          تسجيل الدخول
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-white text-primary-700 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          إنشاء حساب
        </button>
      </div>

      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {isSignup && signupState?.success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول.
        </div>
      )}

      <form action={action} className="space-y-4">
        <FormField label="البريد الإلكتروني" required>
          <input
            type="email"
            name="email"
            required
            placeholder="example@email.com"
            className={inputClass}
            dir="ltr"
          />
        </FormField>

        <FormField label="كلمة المرور" required>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="••••••••"
            className={inputClass}
            dir="ltr"
          />
        </FormField>

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isSignup ? (
            <UserPlus size={16} />
          ) : (
            <LogIn size={16} />
          )}
          {isSignup ? "إنشاء حساب" : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}
