'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusSquare, MessageSquare, User, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Explore', href: '/explore', icon: Search },
  { name: 'Sell', href: '/sell', icon: PlusSquare },
  { name: 'Saved', href: '/saved', icon: Bookmark },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl lg:flex flex-col p-6 z-50">
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            CampusLoop
          </h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-foreground")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-white/10 bg-black/60 backdrop-blur-xl lg:hidden flex items-center justify-around px-2 z-50">
        {navItems.slice(0, 3).concat(navItems.slice(4)).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
