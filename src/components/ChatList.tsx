'use client'

import Link from 'next/link'
import { User, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface ChatListProps {
  chats: any[]
  currentUserId: string
  activeChatId?: string
}

export function ChatList({ chats, currentUserId, activeChatId }: ChatListProps) {
  return (
    <div className="flex flex-col gap-2">
      {chats.map((chat) => {
        const isBuyer = chat.buyer_id === currentUserId
        const partner = isBuyer ? chat.seller : chat.buyer
        const isActive = chat.id === activeChatId

        return (
          <Link
            key={chat.id}
            href={`/messages?chat=${chat.id}`}
            className={cn(
              "flex items-center gap-3 p-4 rounded-2xl transition-all border border-transparent",
              isActive 
                ? "bg-primary/10 border-primary/20" 
                : "bg-white/5 border-white/5 hover:bg-white/10"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden flex-shrink-0">
              {partner.avatar_url ? (
                <img src={partner.avatar_url} alt={partner.full_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm truncate">{partner.full_name}</h4>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(chat.last_message_at))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate">
                  Item: {chat.listings.title}
                </p>
              </div>
            </div>
          </Link>
        )
      })}

      {chats.length === 0 && (
        <div className="text-center py-10 glass-card">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No conversations yet</p>
        </div>
      )}
    </div>
  )
}
