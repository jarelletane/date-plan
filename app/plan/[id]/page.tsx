'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DateForm from '@/components/DateForm'
import type { UserData, Plan } from '@/lib/supabase'

export default function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/plans/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then(data => {
        setPlan(data)
        setLoading(false)
        if (data.result) {
          router.replace(`/plan/${id}/result`)
        }
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [id, router])

  async function handleSubmit(data: UserData) {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/plans/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'Something went wrong')
      }

      router.push(`/plan/${id}/result`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading...</div>
      </main>
    )
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-5 text-center">
        <div>
          <div className="text-5xl mb-4">🤔</div>
          <h1 className="text-2xl font-black text-white mb-2">Plan not found</h1>
          <p className="text-zinc-500 mb-6">This link might be invalid or expired.</p>
          <a href="/" className="text-white underline text-sm">Create your own plan →</a>
        </div>
      </main>
    )
  }

  if (plan?.personB) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-5 text-center">
        <div>
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-black text-white mb-2">Already completed</h1>
          <p className="text-zinc-500 mb-6">Both people have submitted. Check the results!</p>
          <a href={`/plan/${id}/result`} className="bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-zinc-100 transition text-sm">
            See the date plan →
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-6">
            <span className="w-2 h-2 bg-pink-400 rounded-full inline-block" />
            Date request
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            {plan?.personA?.name} wants to plan a date with you 👀
          </h1>
          <p className="text-zinc-500">
            Fill in your details below and we&apos;ll find the perfect plan for both of you.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <DateForm onSubmit={handleSubmit} loading={submitting} buttonLabel="See our date plan →" />
      </div>
    </main>
  )
}
