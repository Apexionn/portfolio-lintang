import { useEffect, useState } from "react";
import { HERO_COPY } from "../../data/heroCopy";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = HERO_COPY.navigation.links;

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') setIsMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="game-nav fixed top-3 left-1/2 -translate-x-1/2 z-[100] flex justify-between items-center px-3 sm:px-5 py-2.5 w-[calc(100%-24px)] max-w-[1180px]" data-hero-enter="nav">
        <a href="#hero" aria-label={`${HERO_COPY.name.join(" ")}, home`} className="game-logo font-syne font-[800] text-[18px] sm:text-[20px] tracking-[-0.5px] no-underline relative z-[110]" onClick={() => setIsMenuOpen(false)}>
          LA<span>.</span>
        </a>

        <ul className="hidden md:flex items-center gap-1.5 list-none p-0 m-0">
          {links.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} aria-describedby={`nav-tip-${item.id}`} className="game-nav-link font-syne-mono text-[10px] lg:text-[11px] tracking-[0.08em] uppercase no-underline">
                <span aria-hidden="true">{item.icon}</span>{item.label}
                <span id={`nav-tip-${item.id}`} className="game-nav-tooltip" role="tooltip">{item.description}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="game-nav-status hidden xl:flex items-center gap-2 font-syne-mono text-[9px] text-port-text-muted tracking-[0.08em]" title={HERO_COPY.status.title} tabIndex="0" aria-describedby="hero-status-tooltip" aria-label={`${HERO_COPY.status.long}. ${HERO_COPY.status.title}`}>
          <span className="game-status-dot" />
          <span className="game-status-copy-long">{HERO_COPY.status.long}</span>
          <span className="game-status-copy-short">{HERO_COPY.status.short}</span>
          <span id="hero-status-tooltip" className="game-status-tooltip" role="tooltip">{HERO_COPY.status.title}</span>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? HERO_COPY.navigation.closeMenuLabel : HERO_COPY.navigation.openMenuLabel}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="game-menu-toggle md:hidden relative z-[110] flex flex-col justify-center items-center w-[38px] h-[36px] gap-[5px] cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`w-[24px] h-[2px] bg-port-text-primary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <div className={`w-[24px] h-[2px] bg-port-text-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-[24px] h-[2px] bg-port-text-primary transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </nav>

      <div id="mobile-navigation" aria-hidden={!isMenuOpen} inert={!isMenuOpen} className={`game-mobile-menu fixed inset-0 flex flex-col items-center justify-center transition-all duration-500 md:hidden z-[105] ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <ul className="flex flex-col gap-5 list-none text-center p-0 m-0">
          {links.map((item, idx) => (
            <li key={item.id} style={{ transitionDelay: `${idx * 70}ms` }} className={`transition-transform duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <a
                href={`#${item.id}`}
                onClick={() => setIsMenuOpen(false)}
                aria-describedby={`mobile-nav-tip-${item.id}`}
                className="game-mobile-link font-syne text-[28px] font-[800] no-underline"
              >
                <span aria-hidden="true">{item.icon}</span>{item.label}
                <span id={`mobile-nav-tip-${item.id}`} className="game-nav-tooltip" role="tooltip">{item.description}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className={`absolute bottom-10 flex items-center gap-2 font-syne-mono text-[10px] text-port-text-muted tracking-widest transition-opacity duration-500 delay-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} title={HERO_COPY.status.title}>
          <span className="game-status-dot" /> {HERO_COPY.status.short}
        </div>
      </div>
    </>
  );
}
