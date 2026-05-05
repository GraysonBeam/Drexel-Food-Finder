import { supabase } from './supabase'
import type { Database } from './supabase'

type UserRow = Database['public']['Tables']['Users']['Row']
type PreferenceField = 'notifications' | 'vegetarian' | 'vegan' | 'halal'

export async function getPreferences(userId: string): Promise<UserRow | null> {
  const { data, error } = await supabase
    .from('Users')
    .select('id, first_name, last_name, notifications, vegetarian, vegan, halal')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('getPreferences error:', error)
    return null
  }
  return data as UserRow
}

export async function updatePreference(
  userId: string,
  field: PreferenceField,
  value: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from('Users')
    .update({ [field]: value })
    .eq('id', userId)

  if (error) {
    console.error('updatePreference error:', error)
    return false
  }
  return true
}
