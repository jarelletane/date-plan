import OpenAI from 'openai'
import type { UserData } from './supabase'

let _openai: OpenAI | null = null
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  return _openai
}

function fallbackPlan(a: UserData, b: UserData, score: number) {
  const sharedVibes = a.vibe.filter(v => b.vibe.includes(v))
  const vibe = sharedVibes[0] ?? a.vibe[0] ?? 'something fun'
  const ideas: Record<string, string[]> = {
    coffee: ['Find a cosy café and see if the conversation flows as well as the coffee', 'Hit up a local specialty coffee spot and debate your orders', 'Morning coffee walk — low stakes, easy exit if needed'],
    drinks: ['Start with one drink somewhere cool and see where the night goes', 'Find a rooftop bar and pretend you do this all the time', 'A wine bar with good snacks — classy but not try-hard'],
    food: ['Try a restaurant neither of you have been to — built-in conversation starter', 'Share a bunch of small plates somewhere with a vibe', 'Street food or a food market — casual, fun, no awkward silences'],
    activity: ['Mini golf or bowling — competitive energy, good laughs', 'An art gallery or exhibition — instant talking points', 'Explore a neighbourhood neither of you knows well'],
  }
  const picked = ideas[vibe] ?? ideas.drinks
  const summary = score >= 70
    ? `You two are ${score}% aligned — that's genuinely good. Shared taste in ${sharedVibes.join(' and ') || 'how to have a good time'}, compatible budgets, and overlapping schedules. Just go.`
    : score >= 40
    ? `${score}% compatibility — solid foundation. You've got some differences but that's not a bad thing. Enough overlap to have a great time, enough contrast to keep it interesting.`
    : `${score}% match — you're a bit of a wildcard combo. Different tastes, but sometimes the best dates are the ones you didn't see coming. Lean in.`
  return { ideas: picked, compatibilitySummary: summary }
}

export async function generateDatePlan(
  a: UserData,
  b: UserData,
  overlapTimes: string[],
  suggestedArea: string,
  score: number
): Promise<{ ideas: string[]; compatibilitySummary: string }> {
  const key = process.env.OPENAI_API_KEY
  if (!key || key.startsWith('your_') || !key.startsWith('sk-')) return fallbackPlan(a, b, score)

  const vibes = [...new Set([...a.vibe, ...b.vibe])]
  const sharedVibes = a.vibe.filter(v => b.vibe.includes(v))
  const budgetLabel = a.budget === b.budget ? a.budget : `${a.budget}–${b.budget}`
  const timeHint = overlapTimes[0] || 'flexible'

  const prompt = `You are helping two people plan their first date. Be playful, modern, and slightly cheeky — not robotic.

Person A (${a.name}): likes ${a.vibe.join(', ')}, budget ${a.budget}, based in ${a.location}${a.hard_no ? `, hard no: "${a.hard_no}"` : ''}
Person B: likes ${b.vibe.join(', ')}, budget ${b.budget}, based in ${b.location}${b.hard_no ? `, hard no: "${b.hard_no}"` : ''}

Shared vibe: ${sharedVibes.length ? sharedVibes.join(', ') : "none specifically, but there's still chemistry"}
Suggested area: ${suggestedArea}
Time: ${timeHint}
Budget range: ${budgetLabel}
Compatibility score: ${score}%

Return JSON with exactly this shape:
{
  "ideas": ["idea 1", "idea 2", "idea 3"],
  "compatibilitySummary": "2-3 sentence summary"
}

Ideas should be specific, fun, and match the vibe + budget. Each idea is 1 short sentence.
The summary should mention the score, highlight what aligned, and be honest-but-fun if there are differences. Keep it under 60 words.`

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  })

  const content = response.choices[0].message.content ?? '{}'
  const parsed = JSON.parse(content)

  return {
    ideas: Array.isArray(parsed.ideas) ? parsed.ideas.slice(0, 3) : ['Grab coffee somewhere new', 'Check out a local bar', 'Try a new restaurant together'],
    compatibilitySummary: typeof parsed.compatibilitySummary === 'string' ? parsed.compatibilitySummary : 'You two have some good energy — go find out in person.',
  }
}
