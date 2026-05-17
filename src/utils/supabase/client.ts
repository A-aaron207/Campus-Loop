import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // During build time, if keys are missing, we still need to return a valid-looking object
  // but in the browser, they MUST be present.
  if (!url || !key || url.includes('placeholder')) {
    // If we're in the browser and keys are missing/placeholders, 
    // it's a configuration error on Vercel.
    if (typeof window !== 'undefined') {
      console.error('Supabase keys are missing in the browser!')
    }
  }

  return createBrowserClient(url, key)
}
