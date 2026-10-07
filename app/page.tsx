import Link from 'next/link'
import { ArrowRight, Mail, MessageCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import ProjectCard from '@/components/ProjectCard'

export default function Home() {
  return (
    // Section rhythm lives on this parent's `gap`, not on each child's margin,
    // so commenting a section in or out never leaves a double or dead gap.
    <div className="flex min-h-screen w-full flex-col gap-16 pb-20 pt-10 md:gap-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <Hero />

      {/* Re-enable any of these by uncommenting the line and adding its import:
          import StatsStrip from '@/components/StatsStrip'
          import TechMarquee from '@/components/TechMarquee'
          import CurrentWork from '@/components/CurrentWork' */}
      {/* <StatsStrip /> */}
      {/* <TechMarquee /> */}
      {/* <CurrentWork /> */}

      <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">PROJECTS</h2>
          <p className="flex justify-center gap-1 pt-1 text-lg font-semibold md:text-xl">
            <span className="text-red-400">Explore</span>
            <span className="text-purple-500">Now</span>
          </p>
        </div>

        <div id="projects" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            title="Devloop"
            description="Autonomous incident resolution agent: Sentry error to LLM patch with 8-model fallback, Docker sandbox validation, then a GitHub PR and Slack ping. Finalist, Outskill x OpenAI Codex Hackathon."
            link="https://github.com/Rishikesh183/devloop"
          />
          <ProjectCard
            title="absent-mcp"
            description="Published npm MCP server that statically analyses codebases for missing security controls like IDOR, token revocation and rate limiting. Runs fully local, no API key."
            link="https://github.com/Rishikesh183/absent-mcp"
          />
          <ProjectCard
            title="JobPilot"
            description="Agentic job-hunting assistant with Adzuna job discovery, LLM match scoring, and automated company research via Browserbase and Stagehand with a Gemini fallback."
            link="https://github.com/Rishikesh183/job-pilot"
          />
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/resume"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-100"
          >
            See all projects on my resume
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 md:px-6">
        <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/10 to-black/40 p-8 text-center backdrop-blur-sm md:p-12">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Hiring, or just curious?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
            I built a RAG chatbot on my own resume &mdash; ask it about my work, my stack or how to
            reach me. Or skip straight to my inbox.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/chat"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-blue-400 sm:w-auto"
            >
              <MessageCircle size={16} />
              Chat with my AI
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200 sm:w-auto"
            >
              <Mail size={16} />
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
