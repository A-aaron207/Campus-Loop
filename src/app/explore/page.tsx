import { createClient } from '@/utils/supabase/server'
import { ListingCard } from '@/components/ListingCard'
import { EmptyState } from '@/components/EmptyState'
import { Search, Filter, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const categories = ['All', 'Books', 'Notes', 'Electronics', 'Uniforms', 'Projects', 'Services', 'Other']

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const category = params.category as string || 'All'
  const query = params.q as string || ''

  const supabase = await createClient()

  let dbQuery = supabase
    .from('listings')
    .select(`
      *,
      listing_images(image_url),
      profiles(full_name, avatar_url, verified)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (category !== 'All') {
    dbQuery = dbQuery.eq('category', category)
  }

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`)
  }

  const { data: listings } = await dbQuery

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4">
        <form action="/explore" className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for books, notes, electronics..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/explore?category=${cat}${query ? `&q=${query}` : ''}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No listings found"
          description={query ? `We couldn't find anything matching "${query}"` : "Be the first to list something in this category!"}
          actionLabel="Post a Listing"
          actionHref="/sell"
        />
      )}
    </div>
  )
}
