"use client";

import { useActionState, useEffect, useState } from "react";
import { submitUserStory } from "@/actions/user-stories";
import { FormField, inputClass, textareaClass } from "@/components/Form";
import { CheckCircle2, Loader2, PenLine } from "lucide-react";

export default function SubmitForm() {
  const [state, formAction, pending] = useActionState(submitUserStory, null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (state?.success) {
      setResetKey((k) => k + 1);
    }
  }, [state]);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 className="text-green-600" size={48} />
        <h2 className="font-arabic text-2xl font-bold text-green-800">
          تم إرسال قصتك بنجاح!
        </h2>
        <p className="max-w-md text-sm leading-7 text-green-700">
          شكرًا لمشاركتك. سيتم مراجعة قصتك من قبل فريق الإدارة، وستظهر في
          الموقع بعد الموافقة عليها.
        </p>
        <button
          onClick={() => setResetKey((k) => k + 1)}
          className="rounded-full bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          إرسال قصة أخرى
        </button>
      </div>
    );
  }

  return (
    <form key={resetKey} action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <FormField label="اسمك (اختياري)">
        <input
          type="text"
          name="name"
          placeholder="يمكنك الكتابة بدون اسم"
          className={inputClass}
          maxLength={100}
        />
      </FormField>

      <FormField label="عنوان القصة" required>
        <input
          type="text"
          name="title"
          required
          placeholder="اكتب عنوانًا مناسبًا لقصتك"
          className={inputClass}
          maxLength={200}
        />
      </FormField>

      <FormField label="محتوى القصة" required>
        <textarea
          name="content"
          required
          placeholder="اكتب قصتك هنا... (يجب أن تكون 50 حرفًا على الأقل)"
          className={textareaClass}
          minLength={50}
          maxLength={20000}
        />
      </FormField>

      <p className="text-xs leading-6 text-neutral-400">
        ملاحظة: القصص المرسلة من المستخدمين تكون نصية فقط بدون صور، وتخضع
        لمراجعة الإدارة قبل النشر.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
      >
        {pending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <PenLine size={16} />
        )}
        إرسال القصة
      </button>
    </form>
  );
}
