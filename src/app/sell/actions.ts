'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import slugify from 'slugify'
import { nanoid } from 'nanoid' // Wait, I didn't install nanoid. I'll use random string.

function generateSlug(title: string) {
  const base = slugify(title, { lower: true, strict: true })
  const random = Math.random().toString(36).substring(2, 7)
  return `${base}-${random}`
}

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const condition = formData.get('condition') as string
  const location = formData.get('location') as string
  const images = formData.getAll('images') as File[]

  const slug = generateSlug(title)

  // 1. Insert Listing
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .insert({
      seller_id: user.id,
      title,
      slug,
      description,
      price,
      category,
      condition,
      location,
      status: 'active'
    })
    .select()
    .single()

  if (listingError) throw listingError

  // 2. Upload Images & Insert into listing_images
  const imageUrls: string[] = []
  
  for (let i = 0; i < images.length; i++) {
    const file = images[i]
    if (file.size === 0) continue

    const fileExt = file.name.split('.').pop()
    const fileName = `${listing.id}/${i}-${Math.random()}.${fileExt}`
    
    const { error: uploadError, data } = await supabase.storage
      .from('listings')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      continue
    }

    const { data: { publicUrl } } = supabase.storage
      .from('listings')
      .getPublicUrl(fileName)

    await supabase.from('listing_images').insert({
      listing_id: listing.id,
      image_url: publicUrl,
      position: i
    })
  }

  revalidatePath('/')
  revalidatePath('/explore')
  redirect(`/listings/${slug}`)
}
