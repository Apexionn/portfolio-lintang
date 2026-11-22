import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ProjectCover from "./ProjectCover";

function hasProjectValue(value) {
  return typeof value === "string" && value.trim() !== "" && !value.trim().startsWith("TODO");
}

function projectLinks(project) {
  const labels = { github: "GitHub", paper: "Paper", live: "Live site", demo: "Demo" };
  return Object.entries(project.links ?? {})
    .filter(([, href]) => Boolean(href))
    .map(([key, href]) => ({ label: labels[key] ?? key, href }));
}

function CoverLightbox({ project, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => closeRef.current?.focus(), []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
  };

  return (
    <div className="quest-lightbox" role="dialog" aria-modal="true" aria-label={`${project.title} cover image`} onKeyDown={handleKeyDown} onClick={onClose}>
      <button ref={closeRef} type="button" className="quest-icon-button quest-lightbox__close" aria-label="Close image preview" onClick={onClose}>×</button>
      <img src={project.coverImage} alt={project.coverAlt || `${project.title} project cover`} onClick={(event) => event.stopPropagation()} />
    </div>
  );
}

export default function QuestDetailDialog({ project, index, total, previousProject, nextProject, onClose, onPrevious, onNext, returnFocusRef }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const coverButtonRef = useRef(null);
  const lightboxOpenRef = useRef(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const links = projectLinks(project);
  const metadata = [
    ["YEAR", project.year],
    ["STATUS", project.status],
    ["ROLE", project.role],
    ["TEAM", project.teamType],
  ].filter(([, value]) => hasProjectValue(value));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const returnFocusTarget = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      } else if (event.key === "Tab") {
        if (lightboxOpenRef.current) {
          const lightboxClose = dialogRef.current?.querySelector(".quest-lightbox__close");
          event.preventDefault();
          lightboxClose?.focus();
          return;
        }

        const focusable = dialogRef.current?.querySelectorAll('button:not([disabled]), a[href]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      returnFocusTarget?.focus({ preventScroll: true });
    };
  }, [onClose, onNext, onPrevious, returnFocusRef]);

  const closeLightbox = () => {
    lightboxOpenRef.current = false;
    setIsLightboxOpen(false);
    window.requestAnimationFrame(() => coverButtonRef.current?.focus());
  };
  const openLightbox = () => {
    lightboxOpenRef.current = true;
    setIsLightboxOpen(true);
  };

  return createPortal(
    <div className="quest-dialog-backdrop" onClick={onClose}>
      <article ref={dialogRef} className="quest-dialog" role="dialog" aria-modal="true" aria-labelledby="quest-dialog-title" onClick={(event) => event.stopPropagation()}>
        <header className="quest-dialog__header">
          <div className="quest-dialog__window-lights" aria-hidden="true"><i /><i /><i /></div>
          <p className="quest-dialog__eyebrow">QUEST {project.questNumber}</p>
          <button ref={closeRef} type="button" className="quest-icon-button" aria-label="Close quest details" onClick={onClose}>×</button>
        </header>

        <div className="quest-dialog__body quest-dialog__content">
          <div className="quest-dialog__title-row">
            <div>
              <p className="quest-dialog__subtitle">{project.subtitle}</p>
              <h2 id="quest-dialog-title">{project.title}</h2>
            </div>
          </div>

          {metadata.length > 0 && (
            <dl className="quest-dialog__metadata" aria-label="Project details">
              {metadata.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          )}

          <div className="quest-dialog__feature-grid">
            <div className="quest-dialog__cover-wrap">
              <button ref={coverButtonRef} type="button" className="quest-dialog__cover-button" onClick={openLightbox} aria-label={`Open ${project.title} cover image`}>
                <ProjectCover project={project} variant="detail" />
                <span className="quest-dialog__image-hint">VIEW COVER ↗</span>
              </button>
            </div>

            <div className="quest-dialog__story-column">
              <section className="quest-dialog__story-card">
                <span className="quest-dialog__field-label">OVERVIEW</span>
                <p>{project.description}</p>
              </section>

              {project.keyFeatures?.length > 0 && (
                <section className="quest-dialog__story-card">
                  <h3>Key features</h3>
                  <ul className="quest-dialog__feature-list">
                    {project.keyFeatures.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                </section>
              )}

              {project.challenge && (
                <section className="quest-dialog__story-card quest-dialog__challenge">
                  <h3>Challenge</h3>
                  <p><span>The challenge</span>{project.challenge.description}</p>
                  <p><span>My approach</span>{project.challenge.approach}</p>
                </section>
              )}
            </div>
          </div>

          <section className="quest-dialog__tech">
            <h3>Tech used</h3>
            <div>{(project.techStack ?? []).map((tech) => <span className="game-tag" key={tech}>{tech}</span>)}</div>
          </section>

          {links.length > 0 && (
            <nav className="quest-dialog__links" aria-label={`${project.title} project links`}>
              {links.map((link) => (
                <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>
              ))}
            </nav>
          )}

          <nav className="quest-dialog__pager" aria-label="Browse projects">
            <button type="button" onClick={onPrevious} title={`Previous: ${previousProject.title}`}><span aria-hidden="true">←</span><span className="quest-dialog__pager-label">Previous: {previousProject.title}</span></button>
            <span>{index + 1} / {total}</span>
            <button type="button" onClick={onNext} title={`Next: ${nextProject.title}`}><span className="quest-dialog__pager-label">Next: {nextProject.title}</span><span aria-hidden="true">→</span></button>
          </nav>
        </div>

        {isLightboxOpen && <CoverLightbox project={project} onClose={closeLightbox} />}
      </article>
    </div>,
    document.body
  );
}
