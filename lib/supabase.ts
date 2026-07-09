import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Supabase env vars are not configured')
    _client = createClient(url, key)
  }
  return _client
}

export const supabase = {
  from: (table: string) => getSupabase().from(table),
}

export type UserData = {
  name: string
  availability: string[]
  vibe: string[]
  budget: '$' | '$$' | '$$$'
  location: string
  hard_no?: string
}

export type PlanResult = {
  overlapTimes: string[]
  suggestedTime: string
  suggestedArea: string
  ideas: string[]
  compatibilitySummary: string
  score: number
}

export type Plan = {
  id: string
  created_at: string
  personA: UserData
  personB: UserData | null
  result: PlanResult | null
}
