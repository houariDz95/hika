import PostForm from "@/components/PostForm";

export const metadata = {
  title: "مقال جديد",
};

export default function NewPostPage() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <h2 className="mb-6 font-arabic text-xl font-bold text-neutral-900">
        إنشاء مقال جديد
      </h2>
      <PostForm />
    </div>
  );
}
