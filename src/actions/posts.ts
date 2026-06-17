"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { postSchema } from "@/lib/validation";

export type ActionResult = {
  success: boolean;
  error?: string;
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/login");
  }
  return { supabase, user: data.user };
}

async function uploadCoverImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `covers/${fileName}`;

  const { error } = await supabase.storage
    .from("hikaya")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      
    });

  if (error) {
    throw new Error("فشل رفع الصورة: " + error.message);
  }

  const { data } = supabase.storage.from("hikaya").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createPost(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin();

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category: (formData.get("category") as string) || "",
    status: (formData.get("status") as string) || "draft",
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  let imageUrl: string | null = null;
  const imageFile = formData.get("image") as File | null;

  try {
    if (imageFile) {
      imageUrl = await uploadCoverImage(supabase, imageFile);
    }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "خطأ غير معروف" };
  }

  const { error } = await supabase.from("posts").insert({
    title: parsed.data.title,
    content: parsed.data.content,
    category: parsed.data.category || null,
    status: parsed.data.status,
    image_url: imageUrl,
    user_id: user.id,
  });

  if (error) {
    return { success: false, error: "فشل إنشاء المقال: " + error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/stories");
  revalidatePath("/");
  redirect("/dashboard");
}

export async function updatePost(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "معرف المقال مفقود" };

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category: (formData.get("category") as string) || "",
    status: (formData.get("status") as string) || "draft",
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const updateData: Record<string, unknown> = {
    title: parsed.data.title,
    content: parsed.data.content,
    category: parsed.data.category || null,
    status: parsed.data.status,
  };

  const imageFile = formData.get("image") as File | null;
  try {
    if (imageFile && imageFile.size > 0) {
      updateData.image_url = await uploadCoverImage(supabase, imageFile);
    }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "خطأ غير معروف" };
  }

  const { error } = await supabase.from("posts").update(updateData).eq("id", id);

  if (error) {
    return { success: false, error: "فشل تحديث المقال: " + error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/stories");
  revalidatePath(`/story/${id}`);
  revalidatePath("/");
  redirect("/dashboard");
}

export async function deletePost(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return { success: false, error: "فشل حذف المقال: " + error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/stories");
  revalidatePath("/");
  return { success: true };
}

export async function incrementViews(id: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_post_views", { post_id: id });
}

export async function likePost(id: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_post_likes", { post_id: id });
  revalidatePath(`/story/${id}`);
}
