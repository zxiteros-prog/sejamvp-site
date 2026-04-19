import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function PUT(request: NextRequest) {
  try {
    const { updates } = await request.json()

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Updates must be an array' }, { status: 400 })
    }

    // Get existing updates from Supabase
    const { data: existingUpdates, error: fetchError } = await supabase
      .from('updates')
      .select('id')

    if (fetchError) {
      console.error('Error fetching existing updates:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch existing updates' }, { status: 500 })
    }

    const existingIds = new Set(existingUpdates?.map(u => u.id) || [])
    
    // Separate updates into new and existing
    const newUpdates = updates.filter(u => !existingIds.has(u.id))
    const existingUpdatesToUpsert = updates.filter(u => existingIds.has(u.id))

    // Transform data to match Supabase schema
    const transformUpdate = (update: any) => ({
      id: update.id,
      title: update.title,
      content: update.description,
      created_at: update.date ? new Date(update.date).toISOString() : new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // Insert new updates
    if (newUpdates.length > 0) {
      const { error: insertError } = await supabase
        .from('updates')
        .insert(newUpdates.map(transformUpdate))

      if (insertError) {
        console.error('Error inserting new updates:', insertError)
        return NextResponse.json({ error: 'Failed to insert new updates' }, { status: 500 })
      }
    }

    // Update existing updates
    if (existingUpdatesToUpsert.length > 0) {
      const { error: updateError } = await supabase
        .from('updates')
        .upsert(existingUpdatesToUpsert.map(transformUpdate))

      if (updateError) {
        console.error('Error updating existing updates:', updateError)
        return NextResponse.json({ error: 'Failed to update existing updates' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: 'Updates saved successfully' })
  } catch (error) {
    console.error('Error in updates PUT endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
