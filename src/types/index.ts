export type PostStatus = "published" | "draft";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string | null;
  status: PostStatus;
  views: number;
  likes: number;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStory {
  id: string;
  name: string | null;
  title: string;
  content: string;
  status: SubmissionStatus;
  user_id: string | null;
  created_at: string;
}

export const CATEGORIES = [
  "رومانسية",
  "خيانة",
  "دراما",
  "رعب",
  "غموض",
  "انتقام",
] as const;

export type Category = (typeof CATEGORIES)[number];
