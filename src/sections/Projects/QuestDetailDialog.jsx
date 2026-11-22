import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ProjectCover from "./ProjectCover";

const DETAIL_FIELDS = [
  ["The problem", "problem"],
  ["My approach", "approach"],
  ["Result", "result"],
  ["Challenges and learnings", "challenges"],
];

function hasProjectValue(value) {
  return typeof value === "string" && value.trim() !== "" && !value.trim().startsWith("TODO:");
}

function projectLinks(project) {
  const labels = { live: "Live site", github: "GitHub", paper: "Paper", demo: "Demo" };
  const primaryLinks = Object.entries(project.links ?? {})
    .filter(([, href]) => Boolean(href))
    .map(([key, href]) => ({ label: labels[key] ?? key, href }));
  return [...primaryLinks, ...(project.additionalLinks ?? [])];
}

function Lightbox({ images, index, onClose, onChange }) {
  const closeRef = useRef(null);

  useEffect(() => closeRef.current?.focus(), []);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    } else if (event.key === "ArrowRight") {
      event.stopPropagation();
      onChange((index + 1) % images.length);
    } else if (event.key === "ArrowLeft") {
      event.stopPropagation();
      onChange((index - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="quest-lightbox" role="dialog" aria-modal="true" aria-label={images[index].alt} tabIndex={-1} onKeyDown={onKeyDown} onClick={onClose}>
      <button ref={closeRef} type="button" className="quest-icon-button quest-lightbox__close" aria-label="Close image preview" onClick={onClose}>×</button>
      {images.length > 1 && <button type="button" className="quest-icon-button quest-lightbox__previous" aria-label="Previous image" onClick={(event) => { event.stopPropagation(); onChange((index - 1 + images.length) % images.length); }}>‹</button>}
      <img src={images[index].src} alt={images[index].alt} onClick={(event) => event.stopPropagation()} />
      {images.length > 1 && <button type="button" className="quest-icon-button quest-lightbox__next" aria-label="Next image" onClick={(event) => { event.stopPropagation(); onChange((index + 1) % images.length); }}>›</button>}
      <p>{images[index].caption || images[index].alt}</p>
    </div>
  );
}

export default function QuestDetailDialog({ project, index, total, onClose, onPrevious, onNext, returnFocusRef }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const images = project.gallery ?? [];
  const links = projectLinks(project);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const returnFocusTarget = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "Tab") {
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

  const research = project.research;

  return createPortal(
    <div className="quest-dialog-backdrop" onClick={onClose}>
      <article ref={dialogRef} className="quest-dialog" role="dialog" aria-modal="true" aria-labelledby="quest-dialog-title" onClick={(event) => event.stopPropagation()}>
        <header className="quest-dialog__header">
          <div className="quest-dialog__window-lights" aria-hidden="true"><i /><i /><i /></div>
          <p className="quest-dialog__eyebrow">QUEST {project.questNumber}{hasProjectValue(project.status) && <> <span>·</span> {project.status}</>}</p>
          <button ref={closeRef} type="button" className="quest-icon-button" aria-label="Close quest details" onClick={onClose}>×</button>
        </header>

        <div className="quest-dialog__body">
          <div className="quest-dialog__title-row">
            <div>
              <p className="quest-dialog__subtitle">{project.subtitle}</p>
              <h2 id="quest-dialog-title">{project.title}</h2>
            </div>
              {hasProjectValue(project.year) && <span className="quest-dialog__year">{project.year}</span>}
          </div>

          {hasProjectValue(project.role) && <p className="quest-dialog__role"><span>MY ROLE</span>{project.role}</p>}

          <div className="quest-dialog__feature-grid">
            <div className="quest-dialog__cover-wrap">
              {project.coverImage ? (
                <button type="button" className="quest-dialog__cover-button" onClick={() => setLightboxIndex(0)} aria-label={`Open ${project.title} cover image`}>
                  <ProjectCover project={project} variant="detail" />
                </button>
              ) : <ProjectCover project={project} variant="detail" />}
              {images.length > 0 && (
                <div className="quest-dialog__gallery" aria-label="Project gallery">
                  {images.map((image, imageIndex) => (
                    <button type="button" key={image.src} onClick={() => setLightboxIndex(imageIndex)} aria-label={`Open image ${imageIndex + 1}: ${image.alt}`}>
                      <img src={image.src} alt="" loading="lazy" width="120" height="75" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="quest-dialog__impact-panel">
              {hasProjectValue(project.impact) && <><span className="quest-dialog__field-label">IMPACT</span><p>{project.impact}</p></>}
              <span className="quest-dialog__field-label">OVERVIEW</span>
              <p>{project.description}</p>
            </div>
          </div>

          <div className="quest-dialog__detail-grid">
            {DETAIL_FIELDS.filter(([, key]) => hasProjectValue(project.details[key])).map(([label, key]) => (
              <section key={key}>
                <h3>{label}</h3>
                <p>{project.details[key]}</p>
              </section>
            ))}
          </div>

            {project.highlights?.some(hasProjectValue) && (
            <section className="quest-dialog__highlights">
              <h3>Quest notes</h3>
                <ul>{project.highlights.filter(hasProjectValue).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            </section>
          )}

          {research && (
            <section className="quest-dialog__research">
              <h3>Research record</h3>
              <dl>
                {[
                  ["Research question", research.question],
                  ["Dataset", research.dataset],
                  ["Models compared", research.models?.join(" · ")],
                  ["Evaluation method", research.evaluation],
                  ["Key findings", research.findings],
                ].filter(([, value]) => hasProjectValue(value)).map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            </section>
          )}

          <section className="quest-dialog__tech">
            <h3>Tech used</h3>
            <div>{project.techStack.map((tech) => <span className="game-tag" key={tech}>{tech}</span>)}</div>
          </section>

          {links.length > 0 && (
            <nav className="quest-dialog__links" aria-label={`${project.title} project links`}>
              {links.map((link) => (
                <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>
              ))}
            </nav>
          )}

          <nav className="quest-dialog__pager" aria-label="Browse projects">
            <button type="button" onClick={onPrevious}>← Previous quest</button>
            <span>{index + 1} / {total}</span>
            <button type="button" onClick={onNext}>Next quest →</button>
          </nav>
        </div>
        {lightboxIndex !== null && images.length > 0 && (
          <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} />
        )}
      </article>
    </div>,
    document.body
  );
}
