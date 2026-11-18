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
        <path d="M12 53c7-10 13-20 16-33 1-5 4-9 9-12" />
        <path d="M19 43c-6-1-9-5-10-11 6 0 10 3 12 8M24 33c6-3 12-2 17 2-4 5-10 6-16 3M29 22c-4-3-5-7-4-12 5 2 7 5 8 10M35 17c3-5 8-7 14-6-2 6-6 9-12 10" />
      </svg>

      <svg className="bard-card__corner bard-card__corner--northeast" viewBox="0 0 64 64" fill="none">
        <path d="M21 15c-6 8-5 22 0 32 3 6 8 10 11 11 4-1 9-5 12-11 5-10 6-24 0-32M21 15c6 3 18 3 23 0M24 23l16 29M40 23 24 52M24 31c5 3 11 3 16 0" />
      </svg>

      <svg className="bard-card__corner bard-card__corner--southwest" viewBox="0 0 64 64" fill="none">
        <path d="M13 12c7 9 11 19 9 29-1 7-4 12-3 19M21 39c7-1 13 1 18 6M24 30c6 1 11-1 15-5" />
        <path d="M40 13v13m0-13 8-2v11M48 22c0 3-2 5-5 5s-4-2-3-4M13 25c-3-2-4-5-4-9" />
      </svg>

      <svg className="bard-card__corner bard-card__corner--southeast" viewBox="0 0 64 64" fill="none">
        <path d="M52 11c-7 10-13 20-16 33-1 5-4 9-9 12M45 21c5 1 9 5 10 11-6 0-10-3-12-8M40 31c-6 3-12 2-17-2 4-5 10-6 16-3M35 42c4 3 5 7 4 12-5-2-7-5-8-10M29 47c-3 5-8 7-14 6 2-6 6-9 12-10" />
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
