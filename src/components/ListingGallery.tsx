'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ListingGalleryProps {
  images: string[]
  title: string
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-3xl overflow-hidden glass border border-white/10 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              currentIndex === i ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
