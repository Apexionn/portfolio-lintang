import { useCallback, useEffect, useRef, useState } from "react";

export default function ContactSection() {
  const [campfireMessage, setCampfireMessage] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [copyNotice, setCopyNotice] = useState("");
  const campfireMessageRef = useRef(null);
  const campfireHotspotRef = useRef(null);
  const campfireMoodRef = useRef({ hover: false, focus: false });

  const setCampfireMood = useCallback((source, isActive) => {
    campfireMoodRef.current[source] = isActive;
    document.body.classList.toggle("campfire-attuned", Object.values(campfireMoodRef.current).some(Boolean));
  }, []);

  const clearCampfireMood = useCallback(() => {
    campfireMoodRef.current = { hover: false, focus: false };
    document.body.classList.remove("campfire-attuned");
  }, []);

  const closeCampfireMessage = useCallback(({ restoreFocus = false } = {}) => {
    setCampfireMessage(false);
    if (restoreFocus && campfireMessageRef.current?.contains(document.activeElement)) {
      campfireHotspotRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const blurCampfireControls = useCallback(() => {
    const activeElement = document.activeElement;
    if (campfireHotspotRef.current === activeElement || campfireMessageRef.current?.contains(activeElement)) activeElement.blur();
  }, []);

  useEffect(() => {
    const onContactVisibility = (event) => {
      setContactVisible(event.detail.visible);
      if (!event.detail.visible) {
        setCampfireMessage(false);
        clearCampfireMood();
        blurCampfireControls();
      }
    };
    const onRouteChange = () => {
      setCampfireMessage(false);
      clearCampfireMood();
      blurCampfireControls();
    };
    window.addEventListener("portfolio-contact-visibility", onContactVisibility);
    window.addEventListener("hashchange", onRouteChange);
    window.addEventListener("popstate", onRouteChange);
    return () => {
      window.removeEventListener("portfolio-contact-visibility", onContactVisibility);
      window.removeEventListener("hashchange", onRouteChange);
      window.removeEventListener("popstate", onRouteChange);
      clearCampfireMood();
    };
  }, [blurCampfireControls, clearCampfireMood]);

  useEffect(() => {
    if (!campfireMessage) return undefined;
    const timeout = window.setTimeout(() => closeCampfireMessage({ restoreFocus: true }), 4000);
    const onPointerDown = (event) => {
      if (campfireMessageRef.current?.contains(event.target) || campfireHotspotRef.current?.contains(event.target)) return;
      closeCampfireMessage();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeCampfireMessage({ restoreFocus: true });
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [campfireMessage, closeCampfireMessage]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("lintanganggowo@gmail.com");
      setCopyNotice("Email copied");
    } catch {
      setCopyNotice("lintanganggowo@gmail.com");
    }
  };

  const toggleCampfireMessage = useCallback(() => setCampfireMessage((open) => !open), []);

  return (
    <section className="game-section game-contact-section relative z-20 py-20 md:py-28" id="contact">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px] game-contact-content">
        <div className="max-w-[700px] mx-auto text-center game-contact-copy">
          <p className="game-section-label justify-center font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-5 reveal-item" data-delay="0">
            <span className="game-label-icon">05</span> Next Quest
          </p>
          <h2 className="game-section-title font-syne text-[clamp(36px,5vw,72px)] font-[800] leading-[0.98] mb-6 reveal-item" data-delay="100">
            <span className="block">Ready for the</span><span className="block">next level?</span>
          </h2>
          <p className="text-[14px] text-port-text-dim leading-[1.8] mb-[48px] max-w-[480px] mx-auto reveal-item" data-delay="200">
            Have a project idea, an AI feature to discuss, or a tricky engineering problem? Let's talk.
          </p>
          <div className="flex justify-center gap-[16px] flex-wrap reveal-item" data-delay="300">
            <a
              href="mailto:lintanganggowo@gmail.com"
              className="game-button game-button-primary font-syne-mono text-[10px] tracking-[0.08em] py-3.5 px-6 font-[500] inline-flex items-center gap-3 no-underline"
              onMouseEnter={() => setCampfireMood("hover", true)}
              onMouseLeave={() => setCampfireMood("hover", false)}
              onFocus={() => setCampfireMood("focus", true)}
              onBlur={() => setCampfireMood("focus", false)}
            >
              <span aria-hidden="true">✉</span> Send a message
            </a>
            <a href="https://www.linkedin.com/in/lintang-anggowoyuono/" target="_blank" rel="noreferrer" className="game-button game-button-secondary font-syne-mono text-[10px] tracking-[0.08em] py-3.5 px-6 inline-flex items-center gap-2 no-underline">
              LinkedIn ↗
            </a>
            <button type="button" onClick={copyEmail} className="game-button game-button-secondary font-syne-mono text-[10px] tracking-[0.08em] py-3.5 px-6 inline-flex items-center gap-2">
              Copy email
            </button>
            <a href="https://github.com/Apexionn" target="_blank" rel="noreferrer" className="game-button game-button-secondary font-syne-mono text-[10px] tracking-[0.08em] py-3.5 px-6 inline-flex items-center gap-2 no-underline">
              GitHub ↗
            </a>
          </div>
          <p className="game-contact-copy-status font-syne-mono text-[10px] mt-3" aria-live="polite">{copyNotice}</p>
          <div
            ref={campfireMessageRef}
            id="campfire-message"
            className={`game-campfire-message inline-flex${campfireMessage ? " is-open" : ""}`}
            role="status"
            aria-live="polite"
            aria-hidden={!campfireMessage}
          >
            <span>Rest Here Traveler</span>
          </div>
        </div>
      </div>
      <button
        ref={campfireHotspotRef}
        type="button"
        className="game-campfire-hotspot"
        aria-label="Rest at the campfire and reveal the email action"
        aria-controls="campfire-message"
        aria-expanded={campfireMessage}
        tabIndex={contactVisible ? 0 : -1}
        onClick={toggleCampfireMessage}
        onMouseEnter={() => setCampfireMood("hover", true)}
        onMouseLeave={() => setCampfireMood("hover", false)}
        onFocus={() => setCampfireMood("focus", true)}
        onBlur={() => setCampfireMood("focus", false)}
      />
    </section>
  );
}
