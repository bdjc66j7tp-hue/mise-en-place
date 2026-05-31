import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const recipeId = formData.get('recipeId') as string

    if (!file || !recipeId) {
      return NextResponse.json({ error: 'Missing file or recipe ID' }, { status: 400 })
    }

    // Build a Supabase client that knows about the user's auth session.
    // This is the key change — the anon-keyed client this used before
    // ran as nobody, so RLS on the recipes table blocked the update.
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          }
        }
      }
    )

    // Must be signed in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to upload a photo' }, { status: 401 })
    }

    // Must be the recipe owner
    const { data: recipe, error: recipeFetchError } = await supabase
      .from('recipes')
      .select('id, user_id')
      .eq('id', recipeId)
      .single()

    if (recipeFetchError || !recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    if (recipe.user_id !== user.id) {
      return NextResponse.json({ error: 'You can only upload photos to your own recipes' }, { status: 403 })
    }

    // Build the file name and upload
    const fileExt = file.name.split('.').pop()
    const fileName = `${recipeId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('recipe-photos')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload photo to storage' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('recipe-photos')
      .getPublicUrl(fileName)

    // Update the recipe row with the new URL
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ photo_url: publicUrl })
      .eq('id', recipeId)

    if (updateError) {
      console.error('Recipe update error:', updateError)
      return NextResponse.json({ error: 'Failed to update recipe with new photo' }, { status: 500 })
    }

    return NextResponse.json({ photo_url: publicUrl })

  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json({ error: 'Unexpected error during upload' }, { status: 500 })
  }
}