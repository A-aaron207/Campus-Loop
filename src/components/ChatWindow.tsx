'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { sendMessage } from '@/app/messages/actions'
import { Send, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

interface ChatWindowProps {
  chatId: string
  currentUserId: string
  chatPartner: any
  listing: any
}

export function ChatWindow({ chatId, currentUserId, chatPartner, listing }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // 1. Initial Fetch
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
      setLoading(false)
    }

    fetchMessages()

    // 2. Realtime Subscription
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId, supabase])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const messageContent = content
    setContent('')
    
    try {
      await sendMessage(chatId, messageContent)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col h-[600px] glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
            {chatPartner.avatar_url ? (
              <img src={chatPartner.avatar_url} alt={chatPartner.full_name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{chatPartner.full_name}</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Item: {listing.title}
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  isMe 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                    {format(new Date(msg.created_at), 'HH:mm')}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
        />
        <button 
          type="submit"
          className="p-2 rounded-xl bg-primary text-white hover:opacity-90 active:scale-95 transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
