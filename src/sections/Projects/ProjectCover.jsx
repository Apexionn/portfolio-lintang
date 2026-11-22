import { useState } from "react";

export default function ProjectCover({ project, variant = "card" }) {
  const [hasImageError, setHasImageError] = useState(false);
  const showImage = project.coverImage && !hasImageError;

  return (
    <div className={`quest-cover quest-cover--${variant}`}>
      {showImage ? (
        <img
          className={`quest-cover__image${project.coverFit === "diagram" ? " quest-cover__image--diagram" : ""}`}
          src={project.coverImage}
          alt={project.coverAlt}
          loading="lazy"
          decoding="async"
          width="960"
          height="600"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <div className="quest-cover__placeholder" role="img" aria-label={`${project.coverAlt}. Screenshot coming soon.`}>
          <span className="quest-cover__sigil" aria-hidden="true">{project.title.slice(0, 2).toUpperCase()}</span>
          <span className="quest-cover__placeholder-title">Screenshot coming soon</span>
        </div>
      )}
      <span className="quest-cover__inner-frame" aria-hidden="true" />
    </div>
  );
}
