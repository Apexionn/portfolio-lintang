import { useEffect, useRef, useState } from "react";
import { HERO_COPY } from "../../data/heroCopy";

const DESKTOP_NAV_BREAKPOINT = 1024;

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const links = HERO_COPY.navigation.links;

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableElements = () => [
      toggleRef.current,
      ...menuRef.current?.querySelectorAll("a[href]") ?? [],
    ].filter(Boolean);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = focusableElements();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleOutsidePointer = (event) => {
      if (navRef.current?.contains(event.target)) return;
      setIsMenuOpen(false);
      requestAnimationFrame(() => toggleRef.current?.focus());
    };

    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_NAV_BREAKPOINT) setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleOutsidePointer);
    window.addEventListener("resize", handleResize);
    requestAnimationFrame(() => menuRef.current?.querySelector("a[href]")?.focus());

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleOutsidePointer);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  const closeAfterNavigation = () => setIsMenuOpen(false);

  return (
    <nav ref={navRef} className="game-nav fixed z-[100] flex justify-between items-center px-3 sm:px-5 py-2.5" data-hero-enter="nav">
      <a href="#hero" aria-label={`${HERO_COPY.name.join(" ")}, home`} className="game-logo font-syne font-[800] text-[18px] sm:text-[20px] tracking-[-0.5px] no-underline relative z-[110]" onClick={closeAfterNavigation}>
        LA<span>.</span>
      </a>

      <ul className="game-nav-inline hidden lg:flex items-center gap-1.5 list-none p-0 m-0">
        {links.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-describedby={`nav-tip-${item.id}`} className="game-nav-link font-syne-mono text-[10px] lg:text-[11px] tracking-[0.08em] uppercase no-underline">
              <span aria-hidden="true">{item.icon}</span>{item.label}
              <span id={`nav-tip-${item.id}`} className="game-nav-tooltip" role="tooltip">{item.description}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="game-nav-status game-nav-status-mobile lg:hidden" title={HERO_COPY.status.title} aria-label={HERO_COPY.status.long}>
        <span className="game-status-dot" />
        <span>{HERO_COPY.status.short}</span>
      </div>
      <div className="game-nav-status game-nav-status-desktop hidden xl:flex items-center gap-2 font-syne-mono text-[9px] text-port-text-muted tracking-[0.08em]" title={HERO_COPY.status.title} tabIndex="0" aria-describedby="hero-status-tooltip" aria-label={`${HERO_COPY.status.long}. ${HERO_COPY.status.title}`}>
        <span className="game-status-dot" />
        <span className="game-status-copy-long">{HERO_COPY.status.long}</span>
        <span className="game-status-copy-short">{HERO_COPY.status.short}</span>
        <span id="hero-status-tooltip" className="game-status-tooltip" role="tooltip">{HERO_COPY.status.title}</span>
      </div>

      <button
        ref={toggleRef}
        type="button"
        aria-label={isMenuOpen ? HERO_COPY.navigation.closeMenuLabel : HERO_COPY.navigation.openMenuLabel}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        data-menu-toggle="true"
        className={`game-menu-toggle lg:hidden relative z-[110] flex flex-col justify-center items-center w-11 h-11 gap-[5px] cursor-pointer${isMenuOpen ? " is-open" : ""}`}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        ref={menuRef}
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`game-mobile-menu lg:hidden${isMenuOpen ? " is-open" : ""}`}
      >
        <ul className="game-mobile-links list-none p-0 m-0">
          {links.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={closeAfterNavigation} aria-describedby={`mobile-nav-tip-${item.id}`} className="game-mobile-link">
                <span className="game-mobile-link__icon" aria-hidden="true">{item.icon}</span>
                <span className="game-mobile-link__copy"><strong>{item.label}</strong><small id={`mobile-nav-tip-${item.id}`}>{item.description}</small></span>
                <span className="game-mobile-link__arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="game-mobile-status">
          <span className="game-status-dot" />
          <span>{HERO_COPY.status.long}</span>
        </div>
      </div>
    </nav>
  );
}
