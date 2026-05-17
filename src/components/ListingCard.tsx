'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Clock, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ListingCardProps {
  listing: any
}

export function ListingCard({ listing }: ListingCardProps) {
  const mainImage = listing.listing_images?.[0]?.image_url || '/placeholder.png'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden flex flex-col group"
    >
      <Link href={`/listings/${listing.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <img 
          src={mainImage} 
          alt={listing.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg glass text-[10px] font-bold uppercase tracking-wider text-primary">
          {listing.category}
        </div>
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold">
          ${listing.price}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground uppercase font-medium">
            {listing.condition}
          </span>
        </div>
        
        <Link href={`/listings/${listing.slug}`} className="block mb-2 group-hover:text-primary transition-colors">
          <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
        </Link>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-3 border-t border-white/5">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(listing.created_at))} ago</span>
            </div>
            {listing.profiles?.verified && (
              <span className="text-primary font-bold">VERIFIED SELLER</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
