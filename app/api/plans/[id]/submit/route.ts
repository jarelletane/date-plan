import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { findOverlapTimes, computeScore, suggestMidpoint } from '@/lib/scoring'
import { generateDatePlan } from '@/lib/openai'
import type { UserData } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body: UserData = await req.json()

    if (!body.name || !body.availability?.length || !body.vibe?.length || !body.budget || !body.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: plan, error: fetchError } = await supabase.from('plans').select('*').eq('id', id).single()

    if (fetchError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    if (plan.personB) {
      return NextResponse.json({ error: 'Plan already completed' }, { status: 409 })
    }

    const personA: UserData = plan.personA
    const personB: UserData = body

    const overlapTimes = findOverlapTimes(personA.availability, personB.availability)
    const suggestedTime = overlapTimes[0] ?? 'TBD — you two will need to sort this one out'
    const suggestedArea = suggestMidpoint(personA.location, personB.location)
    const score = computeScore(personA, personB)

    const { ideas, compatibilitySummary } = await generateDatePlan(
      personA,
      personB,
      overlapTimes,
      suggestedArea,
      score
    )

    const result = {
      overlapTimes,
      suggestedTime,
      suggestedArea,
      ideas,
      compatibilitySummary,
      score,
    }

    const { error: updateError } = await supabase
      .from('plans')
      .update({ personB, result })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({ result })
  } catch (err) {
    console.error('POST /api/plans/[id]/submit error:', err)
    return NextResponse.json({ error: 'Failed to submit plan' }, { status: 500 })
  }
}
