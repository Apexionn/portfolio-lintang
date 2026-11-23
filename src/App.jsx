import { useEffect, useState } from "react";
import HeroSection from "./sections/Hero/HeroSection";
import GameWorldBackground from "./components/layout/GameWorldBackground";
import JourneyIntro from "./intro/JourneyIntro";
import Nav from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AboutSection from "./sections/About/AboutSection";
import ProjectsSection from "./sections/Projects/ProjectsSection";
import ExperienceSection from "./sections/QuestLog/ExperienceSection";
import ArsenalSection from "./sections/Inventory/ArsenalSection";
import ContactSection from "./sections/Contact/ContactSection";
import useScrollReveal from "./hooks/useScrollReveal";

export default function App() {
  useScrollReveal();
  const [showJourney, setShowJourney] = useState(true);
  const [journeyCompleted, setJourneyCompleted] = useState(false);
  const [shortJourney] = useState(() => {
    try { return window.sessionStorage.getItem("bard-journey-seen") === "yes"; }
    catch { return false; }
  });

  useEffect(() => {
    if (!journeyCompleted) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.querySelector(".game-hero-start")?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [journeyCompleted]);

  return (
    <>
    <div className="game-page relative w-full min-h-[100svh]" inert={showJourney} aria-hidden={showJourney}>
      <GameWorldBackground />
      <Nav />
      <main>
        <HeroSection />
        <div className="game-section-break" />
        <AboutSection />
        <div className="game-section-break" />
        <ProjectsSection />
        <div className="game-section-break" />
        <ExperienceSection />
        <div className="game-section-break" />
        <ArsenalSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
    {showJourney && <JourneyIntro short={shortJourney} onEnter={() => {
      try { window.sessionStorage.setItem("bard-journey-seen", "yes"); } catch { /* session storage can be unavailable */ }
      setShowJourney(false);
      setJourneyCompleted(true);
    }} />}
    </>
  );
}
