import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { 
  MapPin, 
  Clock, 
  Tag, 
  Package, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  Share2, 
  Eye,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { ListingGallery } from '@/components/ListingGallery'
import { BookmarkButton } from '@/components/BookmarkButton'

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Fetch Listing with Seller Profile and Images
  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images(image_url, position),
      profiles(id, full_name, avatar_url, school, campus, verified)
    `)
    .eq('slug', slug)
    .single()

  if (error || !listing) {
    notFound()
  }

  // 2. Increment Views (Simple non-blocking update)
  await supabase.rpc('increment_listing_views', { listing_id: listing.id })
  // Note: I need to add this RPC function to the schema or just use a standard update.
  // I'll just use a standard update for now.
  await supabase.from('listings').update({ views: (listing.views || 0) + 1 }).eq('id', listing.id)

  const sortedImages = listing.listing_images.sort((a: any, b: any) => a.position - b.position)
  const images = sortedImages.map((img: any) => img.image_url)

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <Link 
        href="/explore" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <ListingGallery images={images} title={listing.title} />
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider text-primary">
                  {listing.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground">
                  {listing.condition}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-full glass hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <BookmarkButton listingId={listing.id} />
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight">{listing.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(listing.created_at))} ago</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{listing.views + 1} views</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-white py-4">
              ${listing.price}
            </div>

            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          <hr className="border-white/5" />

          {/* Seller Profile */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                  {listing.profiles.avatar_url ? (
                    <img src={listing.profiles.avatar_url} alt={listing.profiles.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{listing.profiles.full_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{listing.profiles.school}</span>
                    <span>•</span>
                    <span>{listing.profiles.campus}</span>
                  </div>
                </div>
              </div>
              {listing.profiles.verified && (
                <div className="flex items-center gap-1 text-primary text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  VERIFIED
                </div>
              )}
            </div>

            <Link 
              href={`/messages?listing=${listing.id}`}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20"
            >
              <MessageSquare className="w-5 h-5" />
              Chat with Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
