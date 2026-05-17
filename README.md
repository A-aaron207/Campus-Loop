# CampusLoop V1 MVP

Hyperlocal student marketplace for schools and colleges. Built for speed, trust, and a modern student experience.

## Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** TailwindCSS + Framer Motion
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth (SSR)
- **Realtime:** Supabase Realtime (In-app Chat)
- **Storage:** Supabase Storage (Listing Images)

## Features

- **Auth System:** Email/Password signup with automatic profile creation.
- **Marketplace Feed:** Search, filter by category, and explore latest listings.
- **Create Listing:** Multi-image upload, price setting, category selection, and SEO-friendly slugs.
- **Listing Details:** High-impact gallery, seller verification status, and view tracking.
- **In-App Realtime Chat:** Secure messaging between buyers and sellers.
- **Saved Items:** Bookmark listings for later.
- **Responsive Design:** Mobile-first architecture with glassmorphism UI.

## Getting Started

### 1. Prerequisites

- Node.js 18+
- Supabase Account

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd campusloop

# Install dependencies
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Database Setup

Run the SQL in `supabase/schema.sql` inside your Supabase SQL Editor.

### 5. Storage Setup

Create a public bucket named `listings` in Supabase Storage. Set up the following policy for public access:

- **Policy name:** `Public Access`
- **Allowed operations:** `SELECT`
- **Target roles:** `public`

### 6. Run the Project

```bash
npm run dev
```

## Engineering Decisions

- **Server Actions:** Used for all data mutations to ensure deep integration with Next.js and type safety.
- **Realtime Sync:** Leverages Supabase Realtime for the chat system, ensuring messages appear instantly without refresh.
- **Image Handling:** Uses a separate `listing_images` table for better scalability and faster sorting.
- **SEO Routing:** Listings use unique slugs (e.g., `/listings/calculus-book-abc12`) instead of UUIDs.
- **Trust Layer:** Built-in verification badges and campus/school metadata to create a secure student environment.

## License

MIT
# Campus-Loop
