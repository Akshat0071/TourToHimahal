# TourToHimachal

A Next.js 16 + React 19 project for Himachal tour packages, taxi bookings, blogs, and diaries with Tailwind CSS and Supabase.

## Features

- Marketing website with Home, Packages, Taxi, Blog, Diaries, Contact pages
- Admin area scaffolding for content management
- Cloudinary integrations (media library, uploads)
- Supabase SQL migrations and SSR helpers
- Tailwind CSS 4, Radix UI components, Framer Motion animations

## Prerequisites

- Node.js 18+ (recommend LTS)
- npm or pnpm
- Optional: Supabase account + Cloudinary account

## Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
2. Create environment file:
   - Copy `.env.local.example` or create `.env.local` and add keys:
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
   NEXT_PUBLIC_CLOUDINARY_API_KEY=
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
   # Contact defaults
   NEXT_PUBLIC_CONTACT_PHONE=
   NEXT_PUBLIC_WHATSAPP_NUMBER=
   NEXT_PUBLIC_CONTACT_EMAIL=
   ```
3. Start dev server:
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

## Scripts

- `dev`: start Next.js dev server
- `build`: production build
- `start`: run production server
- `lint`: run ESLint

## Project Structure

- `app/` Next.js app router pages and routes
- `components/` UI components (home, contact, admin, blog, etc.)
- `lib/` utilities (settings context, contact submission, Cloudinary, Whatsapp helpers)
- `data/` sample content for blogs, diaries, packages, taxis
- `scripts/` Supabase SQL migration files
- `public/` static assets

## Deploy

- Vercel recommended. Ensure env vars are configured in dashboard.
- Set `images.unoptimized: true` in `next.config.mjs` (already set) or configure Next Image loader per platform.

## Notes

- TypeScript is enabled; Next adjusted `tsconfig.json` (jsx: react-jsx and `.next/dev/types` include).
- Tailwind CSS 4 setup with custom colors like `mountain-blue` and `saffron`.
- If using pnpm, prefer `pnpm install` and `pnpm dev`.

## License

Proprietary project files. Do not redistribute without permission.
