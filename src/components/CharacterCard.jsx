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
        <path d="M3 61V20Q3 3 20 3h41M9 48c11-3 17-13 19-27M13 35c8-1 14-7 16-15M17 26c-1-6 2-10 7-13M27 21c5-4 10-4 14-1M23 30c5 0 9 3 10 8M12 46c-4 1-7 4-8 8" />
        <path d="M20 13c-1 4 0 7 3 9M35 12c1 4 4 6 8 6M27 40c-4 1-6 4-6 8" />
      </svg>

      <svg className="bard-card__corner bard-card__corner--northeast" viewBox="0 0 64 64" fill="none">
        <path d="M3 3h41q17 0 17 17v41M11 12c-1 10 1 24 5 33 2 5 5 8 9 8s7-3 9-8c4-9 6-23 5-33M11 12c5 2 9 2 14 0 5 2 9 2 14 0M15 24c7 3 13 3 20 0M17 36c6 2 10 2 16 0M20 47h10" />
        <path d="M17 16l16 37M37 16L21 53" />
      </svg>

      <svg className="bard-card__corner bard-card__corner--southwest" viewBox="0 0 64 64" fill="none">
        <path d="M3 3v41q0 17 17 17h41M10 53c9-4 14-13 15-26M16 49c7-1 12-6 14-13M14 39c-4 0-7 2-9 5M27 24c2-5 6-8 11-8M25 32c5 0 9 3 11 7M31 44c5-2 10-2 15 1" />
        <path d="M39 12v10m0-10 8-2v9M47 19c0 3-2 5-5 5s-4-2-3-4M20 47c-3 2-5 5-5 9" />
      </svg>

      <svg className="bard-card__corner bard-card__corner--southeast" viewBox="0 0 64 64" fill="none">
        <path d="M61 3v41q0 17-17 17H3M54 10c-4 9-13 14-26 15M50 16c-1 7-6 12-13 14M40 14c0-4 2-7 5-9M25 27c-5 2-8 6-8 11M32 25c0 5 3 9 7 11M44 31c-2 5-2 10 1 15" />
        <path d="M53 39c-4 0-7 2-9 5M47 20c2-3 5-5 9-5M13 55c4-1 7 0 9 3" />
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
