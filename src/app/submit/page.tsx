import SubmitForm from "@/components/SubmitForm";

export const metadata = {
  title: "شارك قصتك",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-arabic text-3xl font-bold text-neutral-900">
          شارك قصتك معنا
        </h1>
        <p className="mt-2 text-sm leading-7 text-neutral-500">
          لديك قصة تستحق أن تُروى؟ شاركها معنا وسيتم نشرها بعد مراجعتها من
          فريق الإدارة.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <SubmitForm />
      </div>
    </div>
  );
}
