import {
  BookOpen,
  Briefcase,
  Code,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  Mail,
  MapPin,
  Phone,
  Star,
  Trophy,
} from 'lucide-react';
import ProjectRail, { type RailProject } from '@/components/ProjectRail';

const featuredProjects = [
  {
    name: 'Devloop',
    period: '2026',
    tagline: 'Autonomous incident resolution agent',
    stack: 'FastAPI, Next.js 15, OpenRouter, Docker, Supabase',
    summary:
      'Sentry error to shipped fix with no human in the loop: LLM patch generation with 8-model fallback via OpenRouter, validated in a Docker sandbox, then opened as a GitHub PR with a Slack notification.',
    highlights: [
      'Finalist, Outskill x OpenAI Codex Hackathon',
      'SSE streaming for real-time frontend updates',
      'Supabase row-level security for multi-tenant isolation',
      'Built end-to-end in 7 days (hackathon build, not production)',
    ],
    link: 'https://github.com/Rishikesh183/devloop',
  },
  {
    name: 'absent-mcp',
    period: '2026',
    tagline: 'Published npm MCP server',
    stack: 'TypeScript, Node.js, Model Context Protocol',
    summary:
      'Statically analyses codebases for missing security controls — IDOR, token refresh and revocation, rate limiting, session management — and generates code-quality review reports. Targets architectural gaps, not CVEs.',
    highlights: [
      'Tools: scan_repo, generate_report, list_controls, explain_control',
      'Runs fully local, no API key required',
      'Works with Claude Code/Desktop, Cursor, Copilot, Codex via npx -y absent-mcp',
    ],
    link: 'https://github.com/Rishikesh183/absent-mcp',
  },
  {
    name: 'JobPilot',
    period: '2026',
    tagline: 'Agentic job-hunting assistant',
    stack: 'Next.js 16, React 19, OpenRouter, Gemini, Browserbase',
    summary:
      'Discovers roles through the Adzuna API, scores how well each one matches with an LLM, and runs automated company research through Browserbase and Stagehand with a Gemini fallback.',
    highlights: [
      'LLM match scoring across discovered listings',
      'Browser-agent company research with model fallback',
      'PostHog instrumentation for funnel analysis',
    ],
    link: 'https://github.com/Rishikesh183/job-pilot',
  },
];

const railProjects: RailProject[] = [
  {
    name: 'CivicPath',
    period: '2026',
    stack: 'Python, Reinforcement Learning, OpenEnv',
    summary:
      'RL agent modelling Indian government service workflows — Aadhaar-PAN linking, passport, driving licence — as a Markov Decision Process.',
    highlights: [
      'Meta AI x Hugging Face Hackathon Finalist',
      'Custom environment with a 7-dimensional reward system',
    ],
  },
  {
    name: 'Smart-ATS',
    period: '2026',
    stack: 'Python, FAISS, BM25, OpenAI Embeddings, gpt-4o-mini',
    summary:
      'AI candidate ranking system replacing keyword ATS matching with semantic retrieval and LLM scoring.',
    highlights: [
      'Hybrid retrieval: FAISS + BM25 + Reciprocal Rank Fusion',
      'Honeypot fake-profile detection; ranks 100k candidates',
    ],
    link: 'https://github.com/Rishikesh183/smart-ats',
  },
  {
    name: 'Note AI',
    period: '2026',
    stack: 'React, Next.js 15, NestJS, PostgreSQL, TipTap, ProseMirror',
    summary:
      'Rich-text editor with custom schemas and extensions, AI inline commands for rewrite, expand and summarise, real-time autosave, document versioning, and reusable templates.',
  },
  {
    name: 'AuctionTrack',
    period: '2025',
    stack: 'Next.js, TypeScript, Supabase Realtime, PostgreSQL',
    summary:
      'Real-time bidding platform with Supabase Realtime subscriptions and conflict-free concurrent bid state.',
    highlights: [
      'Sub-200ms bid propagation latency',
      'Structured schema for auction history, player data, analytics',
    ],
  },
  {
    name: 'SkillForge AI',
    period: '2025',
    stack: 'React, TypeScript, Next.js, Firebase, Clerk, Gemini API',
    summary:
      'AI interview-prep platform with Gemini-powered personalized feedback, interview simulation, and dynamic PDF generation.',
    link: 'https://ai-learner-nu.vercel.app/',
  },
  {
    name: 'TruthLens',
    period: '2024',
    stack: 'Python, FastAPI, HuggingFace Transformers, Pandas',
    summary:
      'Transformer-based NLP misinformation detection exposed via a FastAPI REST API, covering the full pipeline of preprocessing, inference, and API integration.',
  },
];

const experience = [
  {
    title: 'AI Engineer',
    company: 'SLRI Solutions, Hyderabad',
    period: 'Oct 2025 - Present',
    note: 'Converted from intern to full-time',
    products: [
      {
        name: 'AI-powered job hr platform',
        blurb: '',
        points: [
          'Migrated the entire frontend from React.js to Next.js 15.',
          'Wrote candidate and job data-fetching APIs in NestJS.',
          'Built an end-to-end AI chatbot and voice agent (Smallest.ai TTS, Gemini STT, OpenAI LLM) with voice streaming, architected to hold 20-30ms latency.',
        ],
      },
      {
        name: 'AI Content Generation Platform',
        blurb: '',
        points: [
          'Built LLM-powered PPT and Spreadsheet generators with custom viewers in the React frontend.',
          'Stored generated assets in MongoDB and integrated third-party app connectors via Composio.',
          "Built the platform's creative studio: AI music and matching video generation with Kie.ai/Suno, AI lyrics, genre, mood and style control, plus optional voice cloning — guided mode for beginners, full parameter control for pros.",
        ],
      },
      {
        name: 'Social Media Platform',
        blurb: '',
        points: [
          'Backend as a Turborepo monorepo with 14 microservices behind a React frontend.',
          'Built real-time Messenger over WebSockets with Pub/Sub, using Redis for multi-instance socket stability and horizontal scaling.',
          'Built a live notification system covering messages, posts, live streams, reshares, likes and comments.',
          'Built live host-to-peer video streaming on Cloudflare WebRTC.',
          'Designed a 5-bucket feed algorithm, post ranking, and the Explore page with local and global trending.',
          'Handled concurrency with DB indexing, message queues, event-driven architecture, Valkey, Redis cache, connection pooling and debouncing.',
        ],
      },
    ],
  },
  {
    title: 'AI Engineer Intern',
    company: 'SLRI Solutions, Hyderabad',
    period: 'Jul 2025 - Sep 2025',
    products: [
      {
        name: 'Early AI prototypes',
        blurb: 'Avatars, chat, dashboards',
        points: [
          'Built an AI avatar with HeyGen that speaks LLM responses and presents PPT slides.',
          'Built the AI chatbot frontend in React.js wired to backend APIs.',
          'Built Angular dashboards for Projects and integrated the chatbot.',
        ],
      },
    ],
  },
];

const openSource = [
  {
    repo: 'Bootstrap',
    detail:
      'Merged PR #42416 — added .nvmrc and migrated all 7 CI workflow files to node-version-file.',
    meta: '174k stars · 2026',
  },
];

const skillGroups = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL'] },
  { label: 'Frontend', items: ['React', 'Next.js', 'Angular', 'TailwindCSS'] },
  { label: 'Backend', items: ['Node.js', 'NestJS', 'REST APIs'] },
  {
    label: 'Real-Time',
    items: ['WebSockets', 'WebRTC', 'Redis Pub/Sub', 'SSE'],
  },
  { label: 'Databases', items: ['PostgreSQL', 'firebase'] },
  {
    label: 'AI/LLM',
    items: [
      'RAG pipelines',
      'Agentic workflows',
      'MCP',
    ],
  },
  {
    label: 'Architecture',
    items: ['Microservices', 'Message queues'],
  },
  { label: 'DevOps', items: ['Docker', 'AWS', 'CI/CD'] },
  // { label: 'Familiar', items: ['Java', 'Go', 'TensorFlow'] },
];

const contactLinks = [
  { icon: Phone, label: '+91-7013848045', href: 'tel:+917013848045' },
  {
    icon: Mail,
    label: 'rishikeshdevarashetty@gmail.com',
    href: 'mailto:rishikeshdevarashetty@gmail.com',
  },
  { icon: Star, label: 'linkedin.com/in/rishikesh24', href: 'https://linkedin.com/in/rishikesh24' },
  { icon: GitBranch, label: 'github.com/Rishikesh183', href: 'https://github.com/Rishikesh183' },
  { icon: Code, label: 'leetcode.com/u/rishikesh183', href: 'https://leetcode.com/u/rishikesh183/' },
];

export default function ResumePage() {
  return (
    <div className="min-h-screen text-white [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16">
        <header className="rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-cyan-300">Resume</p>
              <h1 className="text-4xl font-bold md:text-6xl">Devarashetty Rishikesh</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                <MapPin size={15} /> Hyderabad, India
              </p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 md:text-lg">
                AI Engineer working across agentic AI and full stack, with over 1 year at SLRI Solutions
                shipping LLM voice agents, content generators and real-time systems across three
                products. Hackathon finalist twice over, with a merged PR in Bootstrap and 650+ DSA
                problems solved.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-200">
              {contactLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex items-center gap-2 transition-colors hover:text-cyan-300"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </header>

        

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <Briefcase className="text-cyan-300" />
              Experience
            </h2>

            <div className="space-y-10">
              {experience.map((role) => (
                <article key={`${role.company}-${role.title}`}>
                  <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-200">{role.title}</h3>
                      <p className="text-sm text-slate-300">{role.company}</p>
                      {role.note ? (
                        <p className="mt-1 text-xs text-cyan-300/80">{role.note}</p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-sm text-slate-400">{role.period}</p>
                  </div>

                  <div className="space-y-5 border-l border-white/10 pl-4">
                    {role.products.map((product) => (
                      <div key={product.name}>
                        <p className="text-sm font-semibold text-white">
                          {product.name}
                          <span className="ml-2 font-normal text-slate-400">{product.blurb}</span>
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-200">
                          {product.points.map((point) => (
                            <li key={point} className="flex gap-2">
                              <span className="mt-2.25 h-1 w-1 shrink-0 rounded-full bg-cyan-400/60" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold">
                <Trophy className="text-cyan-300" />
                Achievements
              </h2>
              <ul className="space-y-3 text-sm leading-6 text-slate-200">
                <li>Finalist, Meta AI x Hugging Face Hackathon — CivicPath RL agent.</li>
                <li>Finalist, Outskill x OpenAI Codex Hackathon — Devloop, built in 7 days.</li>
                <li>650+ DSA problems solved (430 LeetCode, 247 GFG).</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold">
                <GitPullRequest className="text-cyan-300" />
                Open Source
              </h2>
              <div className="space-y-4">
                {openSource.map((entry) => (
                  <div key={entry.repo}>
                    <p className="text-sm font-semibold text-cyan-200">{entry.repo}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-200">{entry.detail}</p>
                    <p className="mt-1 text-xs text-slate-400">{entry.meta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold">
                <BookOpen className="text-cyan-300" />
                Education
              </h2>
              <p className="font-semibold text-cyan-200">
                Keshav Memorial Institute of Technology
              </p>
              <p className="mt-2 text-sm text-slate-200">
                B.Tech in Computer Science and Engineering
              </p>
              <p className="mt-1 text-sm text-slate-300">CGPA: 7.5/10</p>
              <p className="mt-1 text-sm text-slate-400">Hyderabad, Telangana | 2021 - 2025</p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Star className="text-cyan-300" />
              Featured Work
            </h2>
            <p className="text-sm text-slate-400">The three I would want you to look at first</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article
                key={project.name}
                className="flex flex-col rounded-3xl border border-cyan-400/25 bg-linear-to-b from-cyan-500/10 to-black/35 p-6 backdrop-blur-sm transition hover:border-cyan-400/50"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-cyan-100">{project.name}</h3>
                  <span className="mt-1 shrink-0 text-xs uppercase tracking-[0.2em] text-slate-400">
                    {project.period}
                  </span>
                </div>

                <p className="mb-3 text-sm font-semibold text-cyan-300">{project.tagline}</p>
                <p className="mb-3 text-xs italic text-slate-300">{project.stack}</p>
                <p className="text-sm leading-6 text-slate-200">{project.summary}</p>

                <ul className="mt-4 space-y-2 text-xs leading-5 text-slate-300">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span className="mt-1.75 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-100"
                >
                  View on GitHub <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Briefcase className="text-cyan-300" />
              More Projects
            </h2>
            <p className="text-sm text-slate-400">Scroll or swipe sideways</p>
          </div>

          <ProjectRail projects={railProjects} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Code className="text-cyan-300" />
            Technical Skills
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <h3 className="mb-3 text-lg font-semibold text-cyan-200">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-100 ring-1 ring-cyan-400/20"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
