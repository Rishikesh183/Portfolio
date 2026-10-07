'use client';

import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export type RailProject = {
  name: string;
  period: string;
  stack: string;
  summary: string;
  highlights?: string[];
  link?: string;
};

type Edges = { left: boolean; right: boolean };

export default function ProjectRail({ projects }: { projects: RailProject[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edges>({ left: false, right: true });

  const syncEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setEdges({
      left: rail.scrollLeft > 8,
      right: rail.scrollLeft < maxScroll - 8,
    });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    syncEdges();

    const observer = new ResizeObserver(syncEdges);
    observer.observe(rail);

    return () => observer.disconnect();
  }, [syncEdges]);

  const scrollByCard = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;

    const card = rail.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : rail.clientWidth * 0.8;

    rail.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  // Fade only the edge that still has content behind it, so the rail never
  // shows a hard cut or a scrollbar line.
  const maskStops = [
    edges.left ? 'transparent 0px, black 56px' : 'black 0px',
    edges.right ? 'black calc(100% - 56px), transparent 100%' : 'black 100%',
  ].join(', ');
  const mask = `linear-gradient(to right, ${maskStops})`;

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Scroll projects left"
          onClick={() => scrollByCard(-1)}
          disabled={!edges.left}
          className="rounded-full border border-white/15 bg-white/5 p-2 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Scroll projects right"
          onClick={() => scrollByCard(1)}
          disabled={!edges.right}
          className="rounded-full border border-white/15 bg-white/5 p-2 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div
        ref={railRef}
        onScroll={syncEdges}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="snap-rail no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth overscroll-x-contain pb-2"
      >
        {projects.map((project) => (
          <article
            key={project.name}
            className="w-[280px] shrink-0 snap-start rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30 sm:w-[320px]"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-cyan-200">{project.name}</h3>
              <span className="mt-1 shrink-0 text-xs uppercase tracking-[0.2em] text-slate-400">
                {project.period}
              </span>
            </div>

            <p className="mb-3 text-sm italic text-slate-300">{project.stack}</p>
            <p className="text-sm leading-6 text-slate-200">{project.summary}</p>

            {project.highlights?.length ? (
              <ul className="mt-3 space-y-1.5 text-xs leading-5 text-slate-300">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="mt-1.75 h-1 w-1 shrink-0 rounded-full bg-cyan-400/70" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:text-cyan-100"
              >
                View project <ExternalLink size={13} />
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
