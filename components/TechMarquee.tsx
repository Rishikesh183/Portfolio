const rowOne = [
  'TypeScript',
  'Next.js 15',
  'React 19',
  'NestJS',
  'FastAPI',
  'Python',
  'Node.js',
  'TailwindCSS',
  'Angular',
  'PostgreSQL',
  'MongoDB',
  'Redis',
]

const rowTwo = [
  'OpenAI',
  'Gemini',
  'OpenRouter',
  'RAG pipelines',
  'MCP',
  'Agentic workflows',
  'WebSockets',
  'WebRTC',
  'Redis Pub/Sub',
  'Turborepo',
  'Docker',
  'AWS',
]

function Row({
  items,
  reverse = false,
  durationSeconds,
}: {
  items: string[]
  reverse?: boolean
  durationSeconds: number
}) {
  return (
    <div
      className={`flex w-max gap-3 ${reverse ? 'marquee-track-reverse' : 'marquee-track'}`}
      style={{ animationDuration: `${durationSeconds}s` }}
    >
      {/* Rendered twice so the -50% translate lands on an identical frame. */}
      {[...items, ...items].map((item, index) => (
        <span
          key={`${item}-${index}`}
          aria-hidden={index >= items.length}
          className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 sm:text-sm"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export default function TechMarquee() {
  return (
    <div
      className="marquee-viewport flex flex-col gap-3 overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <Row items={rowOne} durationSeconds={38} />
      <Row items={rowTwo} reverse durationSeconds={44} />
    </div>
  )
}
