import { createClient } from '@/utils/supabase/server'
import { ListingCard } from '@/components/ListingCard'
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Globe, Users } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: latestListings } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images(image_url),
      profiles(full_name, avatar_url, verified)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/10 blur-[120px] rounded-full -z-10 opacity-50" />
        
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
            <Zap className="w-3 h-3 fill-current" />
            Hypersonic Student Marketplace
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Campus Life
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The hyperlocal loop for students. Buy books, sell projects, exchange notes, and discover local deals—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/explore" className="btn-primary py-4 px-10 text-lg flex items-center gap-2 group shadow-xl shadow-primary/20">
              Start Browsing
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/sell" className="glass py-4 px-10 rounded-full font-medium hover:bg-white/10 transition-all">
              List an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="glass-card p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Verified Students</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A trust-first platform designed exclusively for your campus community. Every user is a fellow student.
          </p>
        </div>
        <div className="glass-card p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Hyperlocal Discovery</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Find items within walking distance. No shipping fees, no waiting. Just meet up on campus and trade.
          </p>
        </div>
        <div className="glass-card p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">In-App Realtime Chat</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Communicate securely without sharing your phone number. Close deals instantly with our realtime system.
          </p>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Latest on Campus</h2>
            <p className="text-muted-foreground">Fresh items listed by students today.</p>
          </div>
          <Link href="/explore" className="text-primary hover:underline font-medium flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestListings?.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="glass-card p-12 text-center space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all" />
        <ShoppingBag className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold">Ready to Declutter?</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Turn your old books, electronics, or uniforms into cash while helping out a fellow student.
        </p>
        <Link href="/sell" className="btn-primary py-4 px-10 inline-block shadow-lg shadow-primary/20">
          Post Your First Listing
        </Link>
      </section>
    </div>
  )
}
