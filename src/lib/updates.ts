import { supabase } from '@/lib/supabase'

export interface Update {
  id: string
  title: string
  content: string
  created_at: string
  updated_at?: string
}

export async function getUpdates(): Promise<Update[]> {
  try {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching updates:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getUpdates:', error)
    throw error
  }
}

export async function getUpdateById(id: string): Promise<Update | null> {
  try {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching update:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in getUpdateById:', error)
    throw error
  }
}

export async function createUpdate(update: Omit<Update, 'id' | 'created_at' | 'updated_at'>): Promise<Update> {
  try {
    const { data, error } = await supabase
      .from('updates')
      .insert([update])
      .select()
      .single()

    if (error) {
      console.error('Error creating update:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in createUpdate:', error)
    throw error
  }
}
