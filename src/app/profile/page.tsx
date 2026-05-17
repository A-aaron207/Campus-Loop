import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, School, GraduationCap, Calendar, Mail, CheckCircle, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8 glass-card p-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-primary" />
            )}
          </div>
          {profile?.verified && (
            <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-background">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{profile?.full_name || 'Student'}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <School className="w-4 h-4" />
              <span>{profile?.school || 'University'}</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              <span>{profile?.campus || 'Campus'}</span>
            </div>
          </div>
        </div>

        <form action="/auth/signout" method="post">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-destructive">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Account Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </div>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined</span>
              </div>
              <span className="font-medium">
                {new Date(profile?.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4" />
                <span>Status</span>
              </div>
              <span className={profile?.verified ? "text-primary font-medium" : "text-amber-500 font-medium"}>
                {profile?.verified ? 'Verified Student' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Student Verification</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Verify your student ID to build trust and unlock more features.
          </p>
          <button className="btn-primary w-full opacity-50 cursor-not-allowed">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  )
}
