'use client'

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  listingId: string
}

export function BookmarkButton({ listingId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkBookmark() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single()

      setIsBookmarked(!!data)
      setLoading(false)
    }

    checkBookmark()
  }, [listingId, supabase])

  const toggleBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Please login to save items')
      return
    }

    if (isBookmarked) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId)

      if (error) toast.error(error.message)
      else setIsBookmarked(false)
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert({ user_id: user.id, listing_id: listingId })

      if (error) toast.error(error.message)
      else {
        setIsBookmarked(true)
        toast.success('Saved to your bookmarks')
      }
    }
  }

  if (loading) return <div className="w-9 h-9 rounded-full glass animate-pulse" />

  return (
    <button 
      onClick={toggleBookmark}
      className={cn(
        "p-2 rounded-full glass transition-all hover:scale-110",
        isBookmarked ? "text-primary fill-primary border-primary/20" : "hover:text-primary"
      )}
    >
      <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
    </button>
  )
}
