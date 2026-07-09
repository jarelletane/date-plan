'use client'

import { use, useState } from 'react'

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const link = typeof window !== 'undefined'
    ? `${window.location.origin}/plan/${id}`
    : `/plan/${id}`

  const [copied, setCopied] = useState(false)

  async function copyLink() {
    const url = `${window.location.origin}/plan/${id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-12 flex flex-col items-center justify-center text-center">
      <div className="max-w-md w-full">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-black text-white mb-3">Your link is ready</h1>
        <p className="text-zinc-400 mb-10 text-lg">
          Send this to them. Once they fill in their details, you&apos;ll both get a date plan.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Your date plan link</p>
          <p className="text-white font-mono text-sm break-all">{`${typeof window !== 'undefined' ? window.location.origin : ''}/plan/${id}`}</p>
        </div>

        <button
          onClick={copyLink}
          className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:bg-zinc-100 transition mb-3"
        >
          {copied ? '✓ Copied!' : 'Copy link'}
        </button>

        <a
          href={`sms:?body=Hey, fill this in so we can figure out when and where to go 👀 ${typeof window !== 'undefined' ? window.location.origin : ''}/plan/${id}`}
          className="w-full block text-center text-zinc-500 py-3 rounded-xl border border-zinc-800 hover:border-zinc-600 transition text-sm font-medium"
        >
          Share via SMS
        </a>

        <p className="mt-8 text-zinc-700 text-sm">
          Bookmark this page — once they submit, check back to see results.
        </p>

        <a href={`/plan/${id}/result`} className="mt-3 text-zinc-600 hover:text-zinc-400 text-sm transition inline-block">
          Already submitted? See results →
        </a>
      </div>
    </main>
  )
}
