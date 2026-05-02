import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const recipeId = formData.get('recipeId') as string

    if (!file || !recipeId) {
      return NextResponse.json({ error: 'Missing file or recipe ID' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${recipeId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('recipe-photos')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('recipe-photos')
      .getPublicUrl(fileName)

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ photo_url: publicUrl })
      .eq('id', recipeId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 })
    }

    return NextResponse.json({ photo_url: publicUrl })

  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
  }
}
