# DatePlan

**Live:** [date-plan-phi.vercel.app](https://date-plan-phi.vercel.app/)

Plan a date without the back-and-forth. Fill out a quick form, send a link, and once the other person fills in theirs, you both get an AI-matched date plan — no signup required.

## The problem

Coordinating a first date over text is annoying: "when are you free?", "what are you into?", "how much do you want to spend?", "where should we meet?" — four questions, twenty messages, and it still falls apart half the time. DatePlan collapses that into one form each, and turns the answers into an actual plan.

## How it works

1. **You fill in your details** — availability, vibe (coffee / drinks / food / activity), budget, area, and an optional "hard no." Takes about 30 seconds.
2. **You get a shareable link** — no login, just a unique URL tied to that plan. Send it via SMS or copy/paste it anywhere.
3. **They fill in theirs** — same short form, from their side of the link.
4. **Both people get a plan** — a compatibility score, the best overlapping time, a suggested meeting area, and three concrete date ideas generated for the two of you specifically.

## Why it's good

- **Zero friction** — no accounts, no app install, no back-and-forth. One link does the whole negotiation.
- **Actually personalized** — ideas are generated from both people's shared vibe, budget, and constraints (including hard nos), not a generic "10 date ideas" listicle.
- **Honest, not just flattering** — the compatibility score and summary call out where two people differ, not just where they match, so the plan feels earned rather than generic.
- **Graceful without AI** — if no OpenAI key is configured, a rule-based fallback still produces sensible, on-vibe suggestions, so the app is never broken in a fresh environment.
- **Lightweight backend** — a single Supabase table (`plans`) holds both people's submissions and the computed result; there's no user system to build or maintain.

## How the matching works

- **Availability** — overlapping time slots between the two people are intersected; more overlap raises the availability score.
- **Vibe** — scored by Jaccard similarity (shared vibes ÷ total distinct vibes) between the two people's picks.
- **Budget** — full score if budgets match exactly, partial credit if they're one tier apart (e.g. `$` vs `$$`), zero if they're far apart.
- **Overall score** — a weighted blend (vibe 40%, availability 30%, budget 20%, plus a small baseline) rounded to a percentage.
- **Date ideas & summary** — sent to `gpt-4o-mini` along with both people's vibe, budget, location, hard-nos, and the computed score, asking for three specific ideas and a short, honest compatibility summary. Falls back to hand-written vibe-based suggestions if no API key is set.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Supabase](https://supabase.com) for storage (Postgres + RLS, public insert/select/update — no auth, by design, for an MVP where the "auth" is just possessing the link)
- [OpenAI](https://platform.openai.com) (`gpt-4o-mini`) for generating date ideas and the compatibility summary
- Tailwind CSS for styling

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example`-style vars into `.env` (see below) and fill them in.
3. Run the Supabase schema in `supabase-schema.sql` against your Supabase project.
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `OPENAI_API_KEY` | OpenAI key for generating date ideas (optional — falls back to rule-based ideas if omitted) |
| `NEXT_PUBLIC_APP_URL` | Public base URL, used for building shareable links |

## Deployment

Deploys cleanly to [Vercel](https://vercel.com/new) like any Next.js app — just set the environment variables above in the project settings.
