import React from 'react';
import {
  BookOpen,
  Briefcase,
  Code,
  GitBranch,
  Mail,
  Phone,
  Star,
  Trophy,
} from 'lucide-react';

const experience = [
  {
    title: 'AI Engineer',
    company: 'SLRIS',
    period: 'Oct 2024 - Present',
    points: [
      'Built an end-to-end voice agent system using Smallest.ai, OpenAI Whisper, and Gemini via OpenRouter for real-time conversations.',
      'Developed NestJS REST APIs for request orchestration, agent workflows, and AI data processing.',
      'Shipped AI-powered spreadsheet, document, and image generation tools with modular, production-ready architecture.',
    ],
  },
  {
    title: 'AI Engineer Intern',
    company: 'SLRIS',
    period: 'Jul 2024 - Sep 2024',
    points: [
      'Developed AI avatar-based interaction flows with HeyGen and integrated them into React applications.',
      'Built chatbot interfaces and chat history flows with React and backend APIs in Next.js.',
      'Created responsive UI components for real-time conversational experiences across frontend and backend.',
    ],
  },
];

const projects = [
  {
    name: 'AuctionTrack',
    period: 'Mar 2024',
    stack: 'Next.js, Supabase Realtime, PostgreSQL',
    summary:
      'Built a real-time distributed auction platform with instant bid updates and synchronized state across multiple clients.',
  },
  {
    name: 'TruthLens',
    period: 'Aug 2024',
    stack: 'Transformers, Node.js, React, NLP',
    summary:
      'Developed a transformer-based fake news detection system that achieved 91% accuracy with scalable inference pipelines.',
  },
  {
    name: 'SkillForge AI',
    period: 'Oct 2023',
    stack: 'React (Vite), TypeScript, Firebase, Gemini API, LLMs',
    summary:
      'Built an AI-powered developer tool with interview simulation, dynamic PDF generation, and personalized LLM-backed feedback.',
  },
];

const skillGroups = [
  {
    label: 'Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'Java'],
  },
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Express', 'FastAPI', 'REST APIs', 'NestJS'],
  },
  {
    label: 'AI/ML',
    items: ['LLM Integration', 'Agentic AI', 'RAG', 'NLP', 'Transformers', 'Gemini API'],
  },
  {
    label: 'Cloud & Data',
    items: ['AWS', 'MongoDB', 'PostgreSQL', 'Redis', 'Pinecone', 'FAISS'],
  },
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
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 md:text-lg">
                Full Stack Developer with hands-on experience building and shipping end-to-end products
                across frontend and backend, with a strong focus on LLM pipelines, agentic AI workflows,
                scalable APIs, and production ownership.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-200">
              <a href="tel:+917013848045" className="flex items-center gap-2 transition-colors hover:text-cyan-300">
                <Phone size={18} />
                <span>+91-7013848045</span>
              </a>
              <a
                href="mailto:rishikeshdevarashetty@gmail.com"
                className="flex items-center gap-2 transition-colors hover:text-cyan-300"
              >
                <Mail size={18} />
                <span>rishikeshdevarashetty@gmail.com</span>
              </a>
              <a
                href="https://linkedin.com/in/rishikesh24"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-cyan-300"
              >
                <Star size={18} />
                <span>linkedin.com/in/rishikesh24</span>
              </a>
              <a
                href="https://github.com/Rishikesh183"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-cyan-300"
              >
                <GitBranch size={18} />
                <span>github.com/Rishikesh183</span>
              </a>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <Briefcase className="text-cyan-300" />
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((item) => (
                <article key={`${item.company}-${item.title}`}>
                  <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-200">{item.title}</h3>
                      <p className="text-sm text-slate-300">{item.company}</p>
                    </div>
                    <p className="text-sm text-slate-400">{item.period}</p>
                  </div>
                  <ul className="space-y-2 text-sm leading-6 text-slate-200">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold">
                <Trophy className="text-cyan-300" />
                Achievement
              </h2>
              <p className="text-sm leading-6 text-slate-200">
                Finalist in the Meta AI x Hugging Face Hackathon for building an OpenEnv-based RL
                environment simulating real-world government workflows like Aadhaar-PAN linking,
                passport services, and driving licence services.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold">
                <BookOpen className="text-cyan-300" />
                Education
              </h2>
              <p className="font-semibold text-cyan-200">Keshav Memorial Institute of Technology</p>
              <p className="mt-2 text-sm text-slate-200">B.Tech in Computer Science</p>
              <p className="mt-1 text-sm text-slate-300">CGPA: 7.5</p>
              <p className="mt-1 text-sm text-slate-400">Hyderabad, Telangana | 2021 - 2025</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Briefcase className="text-cyan-300" />
            Selected Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-cyan-200">{project.name}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{project.period}</span>
                </div>
                <p className="mb-3 text-sm italic text-slate-300">{project.stack}</p>
                <p className="text-sm leading-6 text-slate-200">{project.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/35 p-8 backdrop-blur-sm">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <Code className="text-cyan-300" />
            Technical Skills
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
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
