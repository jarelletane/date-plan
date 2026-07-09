import type { UserData } from './supabase'

export function findOverlapTimes(a: string[], b: string[]): string[] {
  const setB = new Set(b.map(s => s.toLowerCase().trim()))
  return a.filter(slot => setB.has(slot.toLowerCase().trim()))
}

export function computeVibeScore(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0
  const setB = new Set(b)
  const overlap = a.filter(v => setB.has(v)).length
  const union = new Set([...a, ...b]).size
  return union === 0 ? 0 : overlap / union
}

export function computeBudgetScore(a: string, b: string): number {
  if (a === b) return 1
  const levels = ['$', '$$', '$$$']
  const diff = Math.abs(levels.indexOf(a) - levels.indexOf(b))
  return diff === 1 ? 0.5 : 0
}

export function suggestMidpoint(locA: string, locB: string): string {
  if (!locA || !locB) return locA || locB || 'your area'
  if (locA.toLowerCase().trim() === locB.toLowerCase().trim()) return locA
  return `somewhere between ${locA} and ${locB}`
}

export function computeScore(a: UserData, b: UserData): number {
  const overlapTimes = findOverlapTimes(a.availability, b.availability)
  const availScore = overlapTimes.length > 0 ? Math.min(overlapTimes.length / 3, 1) : 0
  const vibeScore = computeVibeScore(a.vibe, b.vibe)
  const budgetScore = computeBudgetScore(a.budget, b.budget)

  const weighted =
    vibeScore * 0.4 +
    availScore * 0.3 +
    budgetScore * 0.2 +
    0.1

  return Math.round(weighted * 100)
}
