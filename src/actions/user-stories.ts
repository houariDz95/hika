"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userStorySchema } from "@/lib/validation";
import type { ActionResult } from "./posts";

export async function submitUserStory(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: (formData.get("name") as string) || "",
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  const parsed = userStorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { error } = await supabase.from("user_stories").insert({
    name: parsed.data.name || null,
    title: parsed.data.title,
    content: parsed.data.content,
    status: "pending",
    user_id: authData.user?.id ?? null,
  });

  if (error) {
    return { success: false, error: "فشل إرسال القصة: " + error.message };
  }

  return { success: true };
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/login");
  }
  return { supabase, user: data.user };
}

export async function approveUserStory(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  // Fetch the submission
  const { data: story, error: fetchError } = await supabase
    .from("user_stories")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !story) {
    return { success: false, error: "لم يتم العثور على القصة" };
  }

  // Mark as approved
  const { error: updateError } = await supabase
    .from("user_stories")
    .update({ status: "approved" })
    .eq("id", id);

  if (updateError) {
    return { success: false, error: "فشل تحديث الحالة: " + updateError.message };
  }

  // Publish as a post (text-only, no image)
  const { error: insertError } = await supabase.from("posts").insert({
    title: story.title,
    content: story.content,
    image_url: null,
    category: null,
    status: "published",
    user_id: null,
  });

  if (insertError) {
    return { success: false, error: "فشل نشر القصة: " + insertError.message };
  }

  revalidatePath("/dashboard/submissions");
  revalidatePath("/stories");
  revalidatePath("/");
  return { success: true };
}

export async function rejectUserStory(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("user_stories")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    return { success: false, error: "فشل تحديث الحالة: " + error.message };
  }

  revalidatePath("/dashboard/submissions");
  return { success: true };
}

export async function deleteUserStory(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("user_stories").delete().eq("id", id);

  if (error) {
    return { success: false, error: "فشل الحذف: " + error.message };
  }

  revalidatePath("/dashboard/submissions");
  return { success: true };
}
