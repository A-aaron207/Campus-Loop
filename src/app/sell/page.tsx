'use client'

import { useState } from 'react'
import { createListing } from './actions'
import { motion } from 'framer-motion'
import { Camera, Tag, DollarSign, MapPin, Package, List, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const categories = ['Books', 'Notes', 'Electronics', 'Uniforms', 'Projects', 'Services', 'Other']
const conditions = ['New', 'Like New', 'Used', 'Heavily Used']

export default function SellPage() {
  const [loading, setLoading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createListing(formData)
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Listing</h1>
        <p className="text-muted-foreground">List your item for other students to see.</p>
      </div>

      <form action={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div className="glass-card p-6">
          <label className="block text-sm font-medium mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            Photos (Max 5)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {previews.map((preview, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 relative">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ))}
            {previews.length < 5 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                <Camera className="w-6 h-6 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center px-2">Add Photo</span>
                <input 
                  type="file" 
                  name="images" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageChange}
                  required={previews.length === 0}
                />
              </label>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Clear, well-lit photos help your item sell faster.
          </p>
        </div>

        {/* Basic Info */}
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Calculus Early Transcendentals"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Location/Campus
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Student Union, North Campus"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <List className="w-4 h-4 text-primary" />
                Category
              </label>
              <select
                name="category"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
              >
                <option value="" className="bg-background">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-background">{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Condition
              </label>
              <select
                name="condition"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
              >
                <option value="" className="bg-background">Select Condition</option>
                {conditions.map(cond => (
                  <option key={cond} value={cond} className="bg-background">{cond}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Tell other students about the item's condition, features, or why you're selling it."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 text-lg shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? 'Creating Listing...' : 'Post Listing'}
        </button>
      </form>
    </div>
  )
}
