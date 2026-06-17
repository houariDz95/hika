# حكاية (Hikaya) — منصة القصص العربية

A full-stack Arabic storytelling blog built with Next.js 15 (App Router), TypeScript, Supabase, Server Actions, and Tailwind CSS. Fully RTL, mobile-first, Medium-style design.

## Features

- **Public**: Homepage with featured/latest stories, `/stories` with search + category filter + pagination, `/story/[id]` single story with views/likes, `/submit` user story submission form.
- **Auth**: Email/password via Supabase Auth (`/login`), middleware-protected `/dashboard`.
- **Admin dashboard**: Stats overview, create/edit/delete posts with cover image upload (Supabase Storage), approve/reject user submissions (approving auto-publishes as a text-only post).
- **Server Actions only** for all mutations — no API routes.
- **Zod validation** on all forms.
- **RTL Arabic UI** using Noto Naskh Arabic font, Tailwind CSS, `dir="rtl"`.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com).

3. **Run the SQL schema**

   Open the Supabase SQL Editor and run `supabase/schema.sql`. This creates:
   - `posts` table (admin articles, with `image_url`, `category`, `status`, `views`, `likes`)
   - `user_stories` table (user submissions, `status`: pending/approved/rejected)
   - RLS policies for both tables
   - `post-images` storage bucket (public read, authenticated write)
   - RPC functions `increment_post_views` and `increment_post_likes`

4. **Environment variables**

   Copy `.env.local.example` to `.env.local` and fill in:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ADMIN_USER_ID=your_admin_user_uuid
   ```

   - Get the URL/anon key from Supabase Project Settings → API.
   - Create your admin user via Supabase Auth (sign up through `/login` → "إنشاء حساب", or create directly in Supabase Dashboard → Authentication → Users), then copy that user's UUID into `ADMIN_USER_ID`. Only this user can access `/dashboard`.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

6. **Deploy to Vercel**

   Push to GitHub and import into Vercel. Add the same environment variables in Vercel Project Settings → Environment Variables.

## Folder Structure

```
src/
  app/
    page.tsx                  → Homepage
    stories/page.tsx          → Story list (search, filter, pagination)
    story/[id]/page.tsx        → Single story
    submit/page.tsx            → User submission form
    login/page.tsx             → Auth
    dashboard/
      layout.tsx               → Admin sidebar layout
      page.tsx                 → Overview + posts table
      posts/new/page.tsx        → Create post
      posts/[id]/edit/page.tsx  → Edit post
      submissions/page.tsx      → Review user submissions
  actions/                     → Server Actions (auth, posts, user-stories)
  components/                  → UI components
  lib/
    supabase/                  → client/server/middleware Supabase clients
    validation.ts              → Zod schemas
  types/                       → Shared TypeScript types
supabase/schema.sql            → Full DB schema, RLS, storage, RPCs
```

## Notes

- **Image rule**: only admin posts (`posts` table) can have `image_url`. User submissions (`user_stories`) are text-only and never include images — enforced at the form/schema level.
- **Admin gating**: any authenticated user can sign in, but middleware checks `user.id === ADMIN_USER_ID` before allowing access to `/dashboard`. Adjust this logic (e.g. add a `role` column) if you need multiple admins.
- **Categories**: رومانسية، خيانة، رعب، غموض، انتقام — edit `CATEGORIES` in `src/types/index.ts` to change.
