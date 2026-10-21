# SkillFinder (Next.js + Tailwind + TypeScript + Supabase)

## 1. Supabase
1. Create a project (or reuse yours). If you ran the old schema, use a fresh project or delete the old tables first.
2. SQL Editor > New query > paste `supabase/schema.sql` > Run.
3. Authentication > Sign In / Providers > Email: **Confirm email** off while testing (on, with custom SMTP, before launch).
4. Project Settings > API Keys: copy the Project URL and the **publishable** key. Never use the secret key in this app.

## 2. Run locally
```
copy .env.example .env.local      (then paste your URL and key; set NEXT_PUBLIC_SITE_URL)
npm install
npm run build                     (must finish without red errors)
npm run dev                       (http://localhost:3000)
```

## 3. Test
1. Sign up as an **artisan** (the type is locked for good), set trade and city under Profile, add a service.
2. In Supabase Table Editor, add a row in `work_items`, `experiences`, `educations` for that artisan (upload screens come later).
3. Sign out: home shows the sliding top-artisan cards. Click one: full profile page.
4. Sign up as a **customer**, request a booking, then accept it as the artisan. Check the customer cannot see other people's bookings.

## 4. Deploy on Vercel
1. Push to GitHub (never commit `.env.local`).
2. Vercel > Add New Project > import the repo (Root Directory = the folder with `package.json`).
3. Environment Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (your live address). Deploy.
4. Supabase > Authentication > URL Configuration: Site URL = your live address.
5. After launch, submit `https://YOUR-SITE/sitemap.xml` in Google Search Console.

## Structure
`lib/services/*` data classes (only files that talk to Supabase) | `hooks/` shared state | `components/` reusable UI | `components/icons.ts` all icons | `app/` pages, `sitemap.ts`, `robots.ts`.

## Not built yet
Chat screen (table and rules are ready), photo upload screens (bucket `portfolio` is ready), review form (rule: accepted bookings only).
