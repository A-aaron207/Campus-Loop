import { createClient } from '@/utils/supabase/server'
import { ListingCard } from '@/components/ListingCard'
import { EmptyState } from '@/components/EmptyState'
import { Bookmark, Search } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function SavedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: savedItems } = await supabase
    .from('bookmarks')
    .select(`
      listing_id,
      listings (
        *,
        listing_images(image_url),
        profiles(full_name, avatar_url, verified)
      )
    `)
    .eq('user_id', user.id)

  const listings = savedItems?.map(item => item.listings) || []

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Saved Items</h1>
        <p className="text-muted-foreground">Listings you've bookmarked for later.</p>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved items"
          description="Start browsing the marketplace and save items you're interested in!"
          actionLabel="Explore Marketplace"
          actionHref="/explore"
        />
      )}
    </div>
  )
}
