import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { randomUUID } from 'crypto'
import type { UserData } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body: UserData = await req.json()

    if (!body.name || !body.availability?.length || !body.vibe?.length || !body.budget || !body.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = randomUUID().replace(/-/g, '').slice(0, 12)

    const { error } = await supabase.from('plans').insert({
      id,
      personA: body,
      personB: null,
      result: null,
    })

    if (error) throw error

    return NextResponse.json({ id })
  } catch (err) {
    console.error('POST /api/plans error:', err)
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ error: 'Failed to create plan', detail: message }, { status: 500 })
  }
}
