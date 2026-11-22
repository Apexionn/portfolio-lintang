import { PROJECTS } from "../../data/projects";

export default function ProjectsSection() {
  return (
    <section className="game-section relative z-10 py-20 md:py-28" id="work">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="game-section-label font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-4 reveal-item" data-delay="0">
          <span className="game-label-icon">02</span> Quest Log / Selected Projects
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <h2 className="game-section-title font-syne text-[clamp(32px,4vw,52px)] font-[800] leading-[1.02] reveal-item" data-delay="100">Projects unlocked.</h2>
          <span className="game-count-badge font-syne-mono text-[9px] uppercase tracking-[0.08em]">{PROJECTS.length} quests available</span>
        </div>
        <div className="game-project-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <article
              className={`game-panel game-project-card group reveal-item p-5 sm:p-6 ${p.featured ? 'is-featured' : ''}`}
              data-delay={String(i * 80 + 150)}
              key={p.num}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="game-pixel-label">QUEST {p.num}</span>
                <span className="game-project-status">UNLOCKED</span>
              </div>
              <div>
                <div className="flex flex-wrap gap-[8px] mb-[12px]">
                  {p.tags.map((t) => (
                    <span className="game-tag font-syne-mono text-[9px] tracking-[0.08em] uppercase px-2.5 py-1" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="game-card-title font-syne text-[clamp(22px,2.5vw,30px)] font-[800] mb-2 transition-colors duration-200">{p.name}</h3>
                <p className="text-[13px] text-port-text-dim leading-[1.8]">{p.desc}</p>
                <p className="game-stack font-syne-mono text-[9px] mt-5 tracking-[0.04em]">ITEMS: {p.stack}</p>
              </div>
              <div className="game-project-actions mt-5 flex flex-wrap gap-x-5 gap-y-3">
                {(p.links || [{ label: "View quest", url: p.link }]).map((projectLink) => (
                  <a
                    className="game-card-action font-syne-mono text-[9px] uppercase tracking-widest inline-flex items-center gap-2 no-underline"
                    href={projectLink.url}
                    key={projectLink.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {projectLink.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
