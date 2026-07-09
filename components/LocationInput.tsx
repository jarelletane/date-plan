'use client'

import { useState, useEffect, useRef } from 'react'

type Suggestion = {
  display_name: string
  address: {
    suburb?: string
    neighbourhood?: string
    town?: string
    city?: string
    state?: string
  }
}

type Props = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

function getLabel(s: Suggestion): string {
  const a = s.address
  const suburb = a.suburb ?? a.neighbourhood ?? a.town ?? a.city ?? ''
  const state = a.state ?? ''
  return suburb && state ? `${suburb}, ${state}` : suburb || s.display_name.split(',').slice(0, 2).join(',').trim()
}

export default function LocationInput({ value, onChange, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=au&format=json&addressdetails=1&limit=6&featuretype=settlement`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data: Suggestion[] = await res.json()
        setSuggestions(data)
        setOpen(data.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 350)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(s: Suggestion) {
    const label = getLabel(s)
    setQuery(label)
    onChange(label)
    setOpen(false)
    setSuggestions([])
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-white transition placeholder:text-zinc-600"
      />
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
        </div>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={() => select(s)}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-zinc-800 transition border-b border-zinc-800 last:border-0"
              >
                {getLabel(s)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
