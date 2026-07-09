'use client'

import { use, useEffect, useState } from 'react'
import type { Plan } from '@/lib/supabase'

const VIBE_EMOJI: Record<string, string> = {
  coffee: '☕',
  drinks: '🍸',
  food: '🍜',
  activity: '🎯',
}

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [notReady, setNotReady] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/plans/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then((data: Plan) => {
        setPlan(data)
        setLoading(false)
        if (!data.result) setNotReady(true)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading results...</div>
      </main>
    )
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-5 text-center">
        <div>
          <div className="text-5xl mb-4">🤔</div>
          <h1 className="text-2xl font-black text-white mb-2">Plan not found</h1>
          <a href="/" className="text-white underline text-sm">Start a new plan →</a>
        </div>
      </main>
    )
  }

  if (notReady || !plan?.result) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-5 text-center">
        <div className="max-w-sm">
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="text-2xl font-black text-white mb-2">Waiting on them...</h1>
          <p className="text-zinc-500 mb-6 text-sm">
            {plan?.personA?.name} has submitted. Once the other person fills in their details, the results will appear here.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-zinc-100 transition text-sm"
          >
            Refresh
          </button>
        </div>
      </main>
    )
  }

  const { result, personA, personB } = plan

  const sharedVibes = personA?.vibe?.filter(v => personB?.vibe?.includes(v)) ?? []

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">💘</div>
          <h1 className="text-4xl font-black text-white mb-2">
            {personA?.name} × {personB?.name}
          </h1>
          <p className="text-zinc-500">Here&apos;s your date plan</p>
        </div>

        {/* Compatibility Score */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Compatibility</p>
          <div className="text-7xl font-black text-white mb-2">{result.score}%</div>
          <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
            <div
              className="h-2 rounded-full bg-white transition-all"
              style={{ width: `${result.score}%` }}
            />
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">{result.compatibilitySummary}</p>
        </div>

        {/* Suggested Time */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Best time</p>
          <p className="text-white font-bold text-lg">{result.suggestedTime}</p>
          {result.overlapTimes.length > 1 && (
            <p className="text-zinc-600 text-sm mt-1">
              Also works: {result.overlapTimes.slice(1, 3).join(', ')}
            </p>
          )}
        </div>

        {/* Suggested Area */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Where</p>
          <p className="text-white font-bold text-lg capitalize">{result.suggestedArea}</p>
        </div>

        {/* Shared Vibes */}
        {sharedVibes.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">You both like</p>
            <div className="flex gap-2 flex-wrap">
              {sharedVibes.map(v => (
                <span key={v} className="bg-white text-black text-sm font-bold px-4 py-1.5 rounded-full capitalize">
                  {VIBE_EMOJI[v]} {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Date Ideas */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Date ideas</p>
          <div className="space-y-3">
            {result.ideas.map((idea, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-zinc-700 font-black text-lg leading-tight mt-0.5">
                  {['01', '02', '03'][i]}
                </span>
                <p className="text-white text-sm leading-relaxed">{idea}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="text-center">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${personA?.name} × ${personB?.name} — DatePlan`,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
              }
            }}
            className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-zinc-100 transition text-sm"
          >
            Share this plan
          </button>
          <p className="mt-4 text-zinc-700 text-xs">
            <a href="/" className="hover:text-zinc-500 transition">Plan another date →</a>
          </p>
        </div>
      </div>
    </main>
  )
}
