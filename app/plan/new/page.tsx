'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DateForm from '@/components/DateForm'
import type { UserData } from '@/lib/supabase'

export default function NewPlanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: UserData) {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'Something went wrong')
      }

      router.push(`/plan/${json.id}/share`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create plan')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12">
      <div className="max-w-lg mx-auto">
        <a href="/" className="text-zinc-600 text-sm hover:text-zinc-400 transition mb-8 inline-block">
          ← Back
        </a>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-2">Your details</h1>
          <p className="text-zinc-500">Fill this in and we&apos;ll generate a link to send them.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <DateForm onSubmit={handleSubmit} loading={loading} buttonLabel="Generate my link →" />
      </div>
    </main>
  )
}
