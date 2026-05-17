'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(chatId: string, content: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 1. Insert message
  const { error: msgError } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      sender_id: user.id,
      content,
      is_read: false
    })

  if (msgError) throw msgError

  // 2. Update chat's last_message_at
  await supabase
    .from('chats')
    .update({ 
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', chatId)

  revalidatePath('/messages')
}

export async function getOrCreateChat(listingId: string, sellerId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  if (user.id === sellerId) throw new Error('You cannot chat with yourself')

  // Check if chat exists
  const { data: existingChat } = await supabase
    .from('chats')
    .select('id')
    .eq('listing_id', listingId)
    .eq('buyer_id', user.id)
    .eq('seller_id', sellerId)
    .single()

  if (existingChat) return existingChat.id

  // Create new chat
  const { data: newChat, error } = await supabase
    .from('chats')
    .insert({
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: sellerId
    })
    .select('id')
    .single()

  if (error) throw error
  return newChat.id
}
