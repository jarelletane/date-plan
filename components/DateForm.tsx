'use client'

import { useState } from 'react'
import type { UserData } from '@/lib/supabase'
import LocationInput from './LocationInput'

const VIBE_OPTIONS = ['coffee', 'drinks', 'food', 'activity']
const BUDGET_OPTIONS: Array<'$' | '$$' | '$$$'> = ['$', '$$', '$$$']

const BUDGET_LABELS: Record<string, string> = {
  '$': 'Cheap & cheerful',
  '$$': 'Mid-range',
  '$$$': 'Splurge',
}

const SLOT_PRESETS = [
  'This weekend (morning)',
  'This weekend (afternoon)',
  'This weekend (evening)',
  'Weekday evening (this week)',
  'Weekday evening (next week)',
  'Next weekend (daytime)',
  'Next weekend (evening)',
  'Flexible / anytime',
]

type Props = {
  onSubmit: (data: UserData) => void
  loading?: boolean
  buttonLabel?: string
}

export default function DateForm({ onSubmit, loading, buttonLabel = 'Submit' }: Props) {
  const [name, setName] = useState('')
  const [availability, setAvailability] = useState<string[]>([])
  const [vibe, setVibe] = useState<string[]>([])
  const [budget, setBudget] = useState<'$' | '$$' | '$$$' | ''>('')
  const [location, setLocation] = useState('')
  const [hardNo, setHardNo] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function toggleArray<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!availability.length) e.availability = 'Pick at least one time slot'
    if (!vibe.length) e.vibe = 'Pick at least one vibe'
    if (!budget) e.budget = 'Pick a budget'
    if (!location.trim()) e.location = 'Location is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      name: name.trim(),
      availability,
      vibe,
      budget: budget as '$' | '$$' | '$$$',
      location: location.trim(),
      hard_no: hardNo.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">
          Your first name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Alex"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-white transition placeholder:text-zinc-600"
        />
        {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
      </div>

      {/* Availability */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">
          When are you free?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SLOT_PRESETS.map(slot => (
            <button
              key={slot}
              type="button"
              onClick={() => setAvailability(prev => toggleArray(prev, slot))}
              className={`text-sm px-3 py-2.5 rounded-xl border font-medium transition text-left ${
                availability.includes(slot)
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-400'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
        {errors.availability && <p className="mt-1 text-red-400 text-sm">{errors.availability}</p>}
      </div>

      {/* Vibe */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">
          What&apos;s your vibe?
        </label>
        <div className="flex gap-2 flex-wrap">
          {VIBE_OPTIONS.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setVibe(prev => toggleArray(prev, v))}
              className={`px-5 py-2.5 rounded-full border font-semibold capitalize transition ${
                vibe.includes(v)
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-400'
              }`}
            >
              {v === 'coffee' && '☕ '}
              {v === 'drinks' && '🍸 '}
              {v === 'food' && '🍜 '}
              {v === 'activity' && '🎯 '}
              {v}
            </button>
          ))}
        </div>
        {errors.vibe && <p className="mt-1 text-red-400 text-sm">{errors.vibe}</p>}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">
          Budget
        </label>
        <div className="flex gap-3">
          {BUDGET_OPTIONS.map(b => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              className={`flex-1 py-3 rounded-xl border font-bold text-lg transition ${
                budget === b
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-400'
              }`}
            >
              <span className="block">{b}</span>
              <span className="block text-xs font-normal mt-0.5 opacity-70">{BUDGET_LABELS[b]}</span>
            </button>
          ))}
        </div>
        {errors.budget && <p className="mt-1 text-red-400 text-sm">{errors.budget}</p>}
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">
          Your area / suburb
        </label>
        <LocationInput
          value={location}
          onChange={setLocation}
          placeholder="e.g. Fitzroy, Newtown, CBD..."
        />
        {errors.location && <p className="mt-1 text-red-400 text-sm">{errors.location}</p>}
      </div>

      {/* Hard No */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-400">
          Hard no? <span className="font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={hardNo}
          onChange={e => setHardNo(e.target.value)}
          placeholder="e.g. No hiking, no karaoke..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-white transition placeholder:text-zinc-600"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:bg-zinc-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : buttonLabel}
      </button>
    </form>
  )
}
