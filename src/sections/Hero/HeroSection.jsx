import { useEffect, useState } from "react";
import CharacterCard from "./CharacterCard";
import HeroSocialIcon from "../../components/ui/HeroSocialIcon";
import { HERO_COPY } from "../../data/heroCopy";

export default function HeroSection() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="game-hero relative z-10 min-h-screen flex flex-col justify-center pt-[100px] pb-12" id="hero">
      <div className="game-hero-layout max-w-[1200px] w-full mx-auto px-6 md:px-[60px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-[60px]">

        <div className={`w-full min-w-0 pt-10 md:pt-0 ${isDesktop ? 'flex-1' : 'flex-none'}`}>
          <p className="game-eyebrow font-syne-mono text-[10px] sm:text-[11px] tracking-[0.12em] uppercase mb-5">
            {HERO_COPY.eyebrow[0]} <span>•</span> {HERO_COPY.eyebrow[1]}
          </p>

          <h1 className="game-hero-title font-syne font-[800] leading-[0.98] tracking-[-0.06em] mb-5 break-words">
            <span className="hero-name-line">{HERO_COPY.name[0]}</span>
            <br />
            <span className="hero-name-line">{HERO_COPY.name[1]}</span>
          </h1>

          <div className="game-hero-copy max-w-[590px] mb-6">
            <p className="hero-subtitle hero-role-line">{HERO_COPY.role}</p>
            <p className="hero-description">{HERO_COPY.introduction}</p>
            <span className="game-dev-chip">{HERO_COPY.secondaryTag}</span>
          </div>

          <div className="relative w-full">
            <div className="flex items-center">
              <div className="flex gap-[16px] flex-wrap">
                <a href="#work" className="game-button game-button-primary hero-enter-button game-hero-start font-syne-mono text-[10px] sm:text-[11px] tracking-[0.08em] py-3.5 px-5 sm:px-6 font-[500] inline-flex items-center gap-3 no-underline">
                  <span aria-hidden="true">▶</span> {HERO_COPY.actions.primary}
                </a>
                <a href="/cv-lintang-anggowoyuono.pdf" target="_blank" rel="noreferrer" className="game-button game-button-secondary hero-enter-button font-syne-mono text-[10px] sm:text-[11px] tracking-[0.08em] py-3.5 px-5 sm:px-6 inline-flex items-center gap-2 no-underline">
                  {HERO_COPY.actions.resume} ↓
                </a>
              </div>
            </div>

            <div className="hero-proof-strip">
              <div className="hero-social-links" role="group" aria-label={HERO_COPY.socialGroupLabel}>
                {HERO_COPY.socialLinks.map((social) => (
                  <a key={social.icon} href={social.href} aria-label={social.label} title={social.label} target="_blank" rel="noreferrer">
                    <HeroSocialIcon icon={social.icon} />
                  </a>
                ))}
              </div>
            </div>

            {isDesktop && (
              <div className="game-scroll-hint mt-8 flex items-center gap-3 font-syne-mono text-[9px] tracking-[0.12em] uppercase">
                <span className="game-scroll-arrow">↓</span> {HERO_COPY.actions.scroll}
              </div>
            )}

          </div>
        </div>

        <div className="game-avatar-stage relative flex-none w-[min(330px,calc(100vw-3rem))] lg:w-[390px] mt-3 md:mt-0 reveal-item" data-delay="250">
          <CharacterCard content={HERO_COPY.folio} />
        </div>

      </div>
    </section>
  );
}
