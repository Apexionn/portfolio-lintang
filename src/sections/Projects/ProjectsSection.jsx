import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "../../data/projects";
import ProjectCover from "./ProjectCover";
import QuestDetailDialog from "./QuestDetailDialog";
import "./projects.css";

const FILTERS = ["All", "Web", "AI/ML", "Mobile", "Research"];
const QUEST_HASH_PREFIX = "#quest-";

function hasProjectValue(value) {
  return typeof value === "string" && value.trim() !== "" && !value.trim().startsWith("TODO:");
}

function getQuestIndexFromLocation() {
  if (typeof window === "undefined" || !window.location.hash.startsWith(QUEST_HASH_PREFIX)) return null;
  const slug = window.location.hash.slice(QUEST_HASH_PREFIX.length);
  const index = PROJECTS.findIndex((project) => project.slug === slug);
  return index >= 0 ? index : null;
}

function linkForProject(project) {
  if (project.links.live) return { label: "Live demo", href: project.links.live };
  if (project.links.github) return { label: "GitHub", href: project.links.github };
  if (project.links.paper) return { label: "Paper", href: project.links.paper };
  if (project.links.demo) return { label: "Demo", href: project.links.demo };
  return null;
}

function ProjectCard({ project, onOpen }) {
  const externalLink = linkForProject(project);

  return (
    <article className="game-panel quest-card">
      <div className="quest-card__topline">
        <span className="game-pixel-label">QUEST {project.questNumber}</span>
        <span className="game-project-status">UNLOCKED</span>
      </div>
      {hasProjectValue(project.status) && <div className="quest-card__status-row"><span>{project.status}</span></div>}
      <ProjectCover project={project} />
      <div className="quest-card__content">
        <p className="quest-card__subtitle">{project.subtitle}</p>
        <h3 className="game-card-title">{project.title}</h3>
        <p className="quest-card__summary">{project.summary}</p>
        {hasProjectValue(project.impact) && <p className="quest-card__impact"><span>IMPACT</span>{project.impact}</p>}
        <div className="quest-card__tags" aria-label="Technologies used">
          {project.techStack.map((tech) => <span className="game-tag" key={tech}>{tech}</span>)}
        </div>
        <div className="quest-card__actions">
          <button type="button" className="game-button game-button-primary" onClick={onOpen}>View quest <span aria-hidden="true">→</span></button>
          {externalLink && <a className="game-button game-button-secondary" href={externalLink.href} target="_blank" rel="noreferrer">{externalLink.label}<span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(getQuestIndexFromLocation);
  const filterTimerRef = useRef(null);
  const returnFocusRef = useRef(null);
  const previousHashRef = useRef("#work");

  const filteredProjects = useMemo(() => (
    activeFilter === "All" ? PROJECTS : PROJECTS.filter((project) => project.categories.includes(activeFilter))
  ), [activeFilter]);

  const syncQuestFromLocation = useCallback(() => {
    previousHashRef.current = "#work";
    setSelectedIndex(getQuestIndexFromLocation());
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", syncQuestFromLocation);
    window.addEventListener("popstate", syncQuestFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncQuestFromLocation);
      window.removeEventListener("popstate", syncQuestFromLocation);
      window.clearTimeout(filterTimerRef.current);
    };
  }, [syncQuestFromLocation]);

  const openQuest = (index) => {
    returnFocusRef.current = document.activeElement;
    previousHashRef.current = window.location.hash && !window.location.hash.startsWith(QUEST_HASH_PREFIX)
      ? window.location.hash
      : "#work";
    setSelectedIndex(index);
    window.history.pushState({ quest: PROJECTS[index].slug }, "", `${QUEST_HASH_PREFIX}${PROJECTS[index].slug}`);
  };

  const closeQuest = useCallback(() => {
    setSelectedIndex(null);
    if (window.location.hash.startsWith(QUEST_HASH_PREFIX)) {
      window.history.replaceState({}, "", previousHashRef.current || "#work");
    }
  }, []);

  const moveQuest = useCallback((direction) => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex + direction + PROJECTS.length) % PROJECTS.length;
    window.history.replaceState({ quest: PROJECTS[nextIndex].slug }, "", `${QUEST_HASH_PREFIX}${PROJECTS[nextIndex].slug}`);
    setSelectedIndex(nextIndex);
  }, [selectedIndex]);
  const previousQuest = useCallback(() => moveQuest(-1), [moveQuest]);
  const nextQuest = useCallback(() => moveQuest(1), [moveQuest]);

  const chooseFilter = (filter) => {
    if (filter === activeFilter) return;
    setIsFiltering(true);
    window.clearTimeout(filterTimerRef.current);
    filterTimerRef.current = window.setTimeout(() => {
      setActiveFilter(filter);
      setIsFiltering(false);
    }, 130);
  };

  const selectedProject = selectedIndex === null ? null : PROJECTS[selectedIndex];

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

        <div className="quest-filters" role="group" aria-label="Filter projects by category">
          {FILTERS.map((filter) => (
            <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => chooseFilter(filter)}>{filter}</button>
          ))}
        </div>
        <div className={`quest-project-grid${isFiltering ? " is-filtering" : ""}`} aria-live="polite">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={() => openQuest(PROJECTS.indexOf(project))} />
          ))}
          {filteredProjects.length === 0 && <p className="quest-empty-state">No quests in this category yet.</p>}
        </div>
      </div>

      {selectedProject && <QuestDetailDialog
        key={selectedProject.id}
        project={selectedProject}
        index={selectedIndex}
        total={PROJECTS.length}
        previousProject={PROJECTS[(selectedIndex - 1 + PROJECTS.length) % PROJECTS.length]}
        nextProject={PROJECTS[(selectedIndex + 1) % PROJECTS.length]}
        onClose={closeQuest}
        onPrevious={previousQuest}
        onNext={nextQuest}
        returnFocusRef={returnFocusRef}
      />}
    </section>
  );
}
