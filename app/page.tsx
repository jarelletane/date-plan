import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-zinc-950">
      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-sm text-zinc-400">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
          No signup required
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-6 text-white">
          Plan a date.
          <br />
          <span className="text-zinc-500">Without the back</span>
          <br />
          <span className="text-zinc-500">and forth.</span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-md mb-10 leading-relaxed">
          Fill out a quick form, send a link, get AI-matched date ideas — all in under a minute.
        </p>

        <Link
          href="/plan/new"
          className="bg-white text-black font-bold text-lg px-10 py-4 rounded-full hover:bg-zinc-100 transition inline-block"
        >
          Start a plan →
        </Link>

        <p className="mt-4 text-zinc-600 text-sm">Free. No account. Just a link.</p>
      </div>

      {/* How it works */}
      <div className="border-t border-zinc-900 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-10 text-center">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'You fill in your details', desc: 'Takes 30 seconds. Availability, vibe, budget, location.' },
              { step: '02', title: 'Send them the link', desc: 'A unique link is generated. Drop it in your DMs.' },
              { step: '03', title: 'Get a plan', desc: 'Once they fill theirs in, you both get matched date ideas.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="text-4xl font-black text-zinc-800 mb-3">{step}</div>
                <h3 className="font-bold text-white mb-1">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA footer */}
      <div className="border-t border-zinc-900 px-6 py-12 text-center">
        <Link
          href="/plan/new"
          className="bg-white text-black font-bold text-base px-8 py-3 rounded-full hover:bg-zinc-100 transition inline-block"
        >
          Start a plan now →
        </Link>
        <p className="text-zinc-700 text-xs mt-3">Built for dating apps. Shareable anywhere.</p>
      </div>
    </main>
  )
}
