import characterCard from "../data/characterCard";
import "./character-card.css";

function LyreMark({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 40 48" fill="none" aria-hidden="true">
      <path d="M8 5c-1 8 1 23 5 31 2 4 4 6 7 6s5-2 7-6c4-8 6-23 5-31" />
      <path d="M8 5c4 2 8 2 12 0 4 2 8 2 12 0M13 13c5 2 9 2 14 0M14 20c4 1 8 1 12 0M16 27c3 1 5 1 8 0M18 34h4M11 8l18 31" />
      <circle cx="20" cy="5" r="2" />
    </svg>
  );
}

function CornerOrnaments() {
  return (
    <div className="bard-card__ornaments" aria-hidden="true">
      <svg className="bard-card__corner bard-card__corner--northwest" viewBox="0 0 64 64" fill="none">
        <path d="M8 56c3-11 11-19 21-26C39 23 45 17 48 8M15 46c-2-7-1-13 2-19M22 39c7 2 13 1 19-3M29 32c-1-7 1-13 5-18M37 25c6 0 11-2 15-6" />
        <path d="M16 36c-3-2-5-5-5-9M22 31c-1-4 0-7 3-10M35 20c3 1 6 1 9 0M28 41c-3 3-4 6-4 10M43 35c3 2 5 4 6 7" />
      </svg>

      <svg className="bard-card__corner bard-card__corner--northeast" viewBox="0 0 64 64" fill="none">
        <path d="M24 10c-9 3-11 14-8 26 3 11 9 20 16 21 7-1 13-10 16-21 3-12 1-23-8-26M19 17c8 4 18 4 26 0M17 26c9 4 21 4 30 0M18 36c8 3 20 3 28 0M21 46c7 2 15 2 22 0" />
        <path d="m22 14 18 38M42 14 24 52M20 52h24" />
      </svg>

      <svg className="bard-card__corner bard-card__corner--southwest" viewBox="0 0 64 64" fill="none">
        <path d="M9 12c13 4 18 13 13 23-4 8-9 14-7 22M17 43c8-3 15-2 22 2M24 32c7 1 13-1 18-6M31 23c1-6 4-10 9-13M35 50c5 1 9 4 12 8" />
        <path d="M38 14v13m0-13 9-2v12M47 24c0 3-2 5-5 5s-5-2-4-4M12 28c-3-2-4-5-4-8M24 47c-2 3-3 6-2 9" />
      </svg>

      <svg className="bard-card__corner bard-card__corner--southeast" viewBox="0 0 64 64" fill="none">
        <path d="M55 9c-6 11-14 18-25 24C19 39 13 45 10 55M46 18c2 6 1 12-2 18M38 27c-7-2-13-1-19 3M31 33c1 7-1 13-5 18M23 40c-6 0-11 2-15 6" />
        <path d="M48 28c3 2 5 5 5 9M42 33c1 4 0 7-3 10M29 44c-3-1-6-1-9 0M36 23c3-3 4-6 4-10M21 50c-3-2-5-4-6-7" />
      </svg>
    </div>
  );
}

function EngravedRule() {
  return (
    <svg className="bard-card__rule" viewBox="0 0 320 26" fill="none" aria-hidden="true">
      <path d="M2 13h105c8 0 10-8 18-8 6 0 9 4 14 8-5 4-8 8-14 8-8 0-10-8-18-8M318 13H213c-8 0-10-8-18-8-6 0-9 4-14 8 5 4 8 8 14 8 8 0 10-8 18-8" />
      <path d="M153 13c0-6 3-10 7-10s7 4 7 10-3 10-7 10-7-4-7-10ZM160 3v20M154 9h12M154 17h12" />
      <circle cx="126" cy="13" r="2" /><circle cx="194" cy="13" r="2" />
    </svg>
  );
}

function handlePointerMove(event) {
  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;

  card.style.setProperty("--card-rotate-x", `${((0.5 - y) * 5).toFixed(2)}deg`);
  card.style.setProperty("--card-rotate-y", `${((x - 0.5) * 6).toFixed(2)}deg`);
  card.style.setProperty("--foil-x", `${(x * 100).toFixed(1)}%`);
  card.style.setProperty("--foil-y", `${(y * 100).toFixed(1)}%`);
  card.style.setProperty("--foil-opacity", "0.42");
}

function handlePointerLeave(event) {
  const card = event.currentTarget;
  card.style.setProperty("--card-rotate-x", "0deg");
  card.style.setProperty("--card-rotate-y", "0deg");
  card.style.setProperty("--foil-x", "50%");
  card.style.setProperty("--foil-y", "50%");
  card.style.setProperty("--foil-opacity", "0");
}

export default function CharacterCard({ character = characterCard }) {
  return (
    <article
      className="bard-card"
      aria-label={`${character.name}, ${character.className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="bard-card__grain" aria-hidden="true" />
      <header className="bard-card__identity">
        <p className="bard-card__edition">Character folio <span>·</span> 01</p>
        <h2 className="bard-card__name">{character.name}</h2>
        <p className="bard-card__class"><span className="bard-card__class-rule" />{character.className}<span className="bard-card__class-rule" /></p>
      </header>

      <figure className="bard-card__portrait-frame">
        <div className="bard-card__portrait-mat">
          <img src={character.portrait} alt={character.portraitAlt} className="bard-card__portrait" />
        </div>
        <figcaption className="bard-card__guild"><span>{character.affiliation.label}</span>{character.affiliation.value}</figcaption>
      </figure>

      <section className="bard-card__details" aria-label="Character details">
        <div className="bard-card__calling">
          <span className="bard-card__label">Calling</span>
          <p>{character.calling.map((item, index) => (
            <span key={item}>{index > 0 && <i aria-hidden="true"> · </i>}{item}</span>
          ))}</p>
        </div>
        <EngravedRule />
        <p className="bard-card__epithet"><LyreMark className="bard-card__lyre" />{character.epithet}</p>
      </section>

      <CornerOrnaments />
    </article>
  );
}
