import { Mic, Music, Radio } from 'lucide-react'

const currentWork = [
  {
    icon: Mic,
    name: 'SimplyOffer',
    blurb: 'AI-powered HR platform',
    detail:
      'End-to-end chatbot and voice agent — Smallest.ai TTS, Gemini STT, OpenAI LLM — architected to hold 20-30ms latency. Frontend migrated to Next.js 15.',
  },
  {
    icon: Music,
    name: 'AI Content Generation',
    blurb: 'Pre-launch — name under NDA',
    detail:
      'LLM-powered PPT and spreadsheet generators with custom viewers, plus a creative studio for AI music and matching video with optional voice cloning.',
  },
  {
    icon: Radio,
    name: 'Social Platform',
    blurb: 'Pre-launch — name under NDA',
    detail:
      '14 microservices in a Turborepo monorepo. Real-time Messenger over WebSockets with Redis Pub/Sub, Cloudflare WebRTC streaming, and a 5-bucket feed algorithm.',
  },
]

export default function CurrentWork() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">CURRENTLY BUILDING</h2>
        <p className="pt-1 text-lg font-semibold md:text-xl">
          <span className="text-red-400">At</span>{' '}
          <span className="text-purple-500">SLRI Solutions</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {currentWork.map(({ icon: Icon, name, blurb, detail }) => (
          <article
            key={name}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-cyan-400/30"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
              <Icon size={18} />
            </div>
            <h3 className="text-lg font-bold text-cyan-200">{name}</h3>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-400">
              {blurb}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
