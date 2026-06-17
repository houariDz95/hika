"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { createPost, updatePost } from "@/actions/posts";
import { FormField, inputClass, textareaClass } from "@/components/Form";
import { CATEGORIES } from "@/types";
import { Loader2, Save, ImagePlus } from "lucide-react";
import type { Post } from "@/types";

export default function PostForm({ post }: { post?: Post }) {
  const isEdit = !!post;
  const action = isEdit ? updatePost : createPost;
  const [state, formAction, pending] = useActionState(action, null);
  const [preview, setPreview] = useState<string | null>(post?.image_url ?? null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form action={formAction} className="space-y-5">
      {isEdit && <input type="hidden" name="id" value={post.id} />}

      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <FormField label="عنوان المقال" required>
        <input
          type="text"
          name="title"
          required
          defaultValue={post?.title}
          placeholder="عنوان القصة بالعربية"
          className={inputClass}
          maxLength={200}
        />
      </FormField>

      <FormField label="التصنيف">
        <select
          name="category"
          defaultValue={post?.category ?? ""}
          className={inputClass}
        >
          <option value="">بدون تصنيف</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="صورة الغلاف">
        <div className="flex items-center gap-4">
          {preview && (
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              <Image src={preview} alt="معاينة" fill className="object-cover" />
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-500 transition hover:border-primary-300 hover:text-primary-600">
            <ImagePlus size={16} />
            {preview ? "تغيير الصورة" : "اختر صورة"}
            <input
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </FormField>

      <FormField label="محتوى المقال" required>
        <textarea
          name="content"
          required
          defaultValue={post?.content}
          placeholder="اكتب محتوى القصة هنا (يدعم Markdown البسيط)"
          className={textareaClass + " min-h-[320px]"}
          minLength={20}
        />
      </FormField>

      <FormField label="حالة النشر" required>
        <select
          name="status"
          defaultValue={post?.status ?? "draft"}
          className={inputClass}
        >
          <option value="draft">مسودة</option>
          <option value="published">منشور</option>
        </select>
      </FormField>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:opacity-60"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {isEdit ? "حفظ التعديلات" : "نشر المقال"}
      </button>
    </form>
  );
}
