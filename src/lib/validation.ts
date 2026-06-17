import { z } from "zod";
import { CATEGORIES } from "@/types";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "العنوان يجب أن يكون 3 أحرف على الأقل")
    .max(200, "العنوان طويل جدًا"),
  content: z
    .string()
    .min(20, "المحتوى يجب أن يكون 20 حرفًا على الأقل"),
  category: z.enum(CATEGORIES).optional().or(z.literal("")),
  status: z.enum(["published", "draft"]),
});

export const userStorySchema = z.object({
  name: z.string().max(100, "الاسم طويل جدًا").optional().or(z.literal("")),
  title: z
    .string()
    .min(3, "العنوان يجب أن يكون 3 أحرف على الأقل")
    .max(200, "العنوان طويل جدًا"),
  content: z
    .string()
    .min(50, "القصة يجب أن تكون 50 حرفًا على الأقل")
    .max(20000, "القصة طويلة جدًا"),
});

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type PostInput = z.infer<typeof postSchema>;
export type UserStoryInput = z.infer<typeof userStorySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
