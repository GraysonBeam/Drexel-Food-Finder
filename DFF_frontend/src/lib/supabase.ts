import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

export type Database = {
  public: {
    Tables: {
      Users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          notifications: boolean
          vegetarian: boolean
          vegan: boolean
          halal: boolean
          created_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email?: string | null
          notifications?: boolean
          vegetarian?: boolean
          vegan?: boolean
          halal?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          notifications?: boolean
          vegetarian?: boolean
          vegan?: boolean
          halal?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          date: string | null
          time: string | null
          location: string | null
          description: string | null
          food_offered: string | null
          link: string | null
          event_date: string | null
          is_halal: boolean
          is_vegan: boolean
          is_vegetarian: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          date?: string | null
          time?: string | null
          location?: string | null
          description?: string | null
          food_offered?: string | null
          link?: string | null
          event_date?: string | null
          is_halal?: boolean
          is_vegan?: boolean
          is_vegetarian?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string | null
          time?: string | null
          location?: string | null
          description?: string | null
          food_offered?: string | null
          link?: string | null
          event_date?: string | null
          is_halal?: boolean
          is_vegan?: boolean
          is_vegetarian?: boolean
          created_at?: string
        }
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          expo_push_token: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          expo_push_token: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          expo_push_token?: string
          created_at?: string
        }
      }
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
