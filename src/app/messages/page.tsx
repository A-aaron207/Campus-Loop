import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ChatList } from '@/components/ChatList'
import { ChatWindow } from '@/components/ChatWindow'
import { getOrCreateChat } from './actions'
import { MessageSquare } from 'lucide-react'

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  let activeChatId = params.chat as string
  const listingId = params.listing as string

  // 1. If listingId is provided, get or create chat and redirect
  if (listingId && !activeChatId) {
    const { data: listing } = await supabase
      .from('listings')
      .select('seller_id')
      .eq('id', listingId)
      .single()

    if (listing) {
      try {
        const chatId = await getOrCreateChat(listingId, listing.seller_id)
        redirect(`/messages?chat=${chatId}`)
      } catch (e) {
        console.error(e)
      }
    }
  }

  // 2. Fetch all chats for user
  const { data: chats } = await supabase
    .from('chats')
    .select(`
      *,
      listings(title),
      buyer:profiles!buyer_id(full_name, avatar_url),
      seller:profiles!seller_id(full_name, avatar_url)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })

  let activeChat = null
  if (activeChatId) {
    activeChat = chats?.find(c => c.id === activeChatId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
      {/* Sidebar: Chat List */}
      <div className="lg:col-span-1 space-y-4 flex flex-col">
        <h1 className="text-2xl font-bold px-2">Messages</h1>
        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
          <ChatList 
            chats={chats || []} 
            currentUserId={user.id} 
            activeChatId={activeChatId}
          />
        </div>
      </div>

      {/* Main: Chat Window */}
      <div className="lg:col-span-2">
        {activeChat ? (
          <ChatWindow 
            chatId={activeChat.id} 
            currentUserId={user.id}
            chatPartner={activeChat.buyer_id === user.id ? activeChat.seller : activeChat.buyer}
            listing={activeChat.listings}
          />
        ) : (
          <div className="h-full glass-card flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Pick a chat from the list or message a seller from a listing page.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
