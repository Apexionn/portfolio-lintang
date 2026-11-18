import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// DATA
const PROJECTS = [
  {
    num: "01",
    name: "CineMate",
    subtitle: "Cinema Booking System",
    tags: ["Frontend", "MVVM", "React", 'Tailwind'],
    stack: "React · MVVM · REST API · Node.js",
    desc: "A full online cinema booking experience engineered with React (MVVM architecture) and a dedicated REST backend. Clean separation of concerns, real booking flows, and a UI that doesn't get in the way of buying a ticket.",
    featured: true,
    link: "https://github.com/MMADUs/CineMate",
  },
  {
    num: "02",
    name: "PATANI",
    subtitle: "Agricultural Intelligence Platform",
    tags: ["AI ML", "Web App"],
    stack: "Python · Scikit learn · React",
    desc: "An AI web application that uses environmental sensor data to predict crop yields and recommend fertilizer. The project combines a React interface with machine learning models built in Python.",
    featured: false,
    link: "https://github.com/Apexionn/frontend_ai",
  },
  {
    num: "03",
    name: "IndoBERT vs GPT",
    subtitle: "Indonesian NLP: Few-Shot Prompting",
    tags: ["AI Research", "NLP", "LLMs"],
    stack: "Python · IndoBERT · OpenAI API · HuggingFace · Jupyter",
    desc: "A comparison of IndoBERT and OpenAI models on Indonesian-language detection tasks. The study examines few-shot prompting and differences in model accuracy for Indonesian text.",
    featured: false,
    link: "https://github.com/Apexionn/AI-Detection-Gambling-Promotion",
  },
  {
    num: "04",
    name: "Booking Room Meeting",
    subtitle: "Meeting Room Booking Backend",
    tags: ["Backend", "Laravel", "Room Booking"],
    stack: "Laravel · PHP · MySQL · REST API",
    desc: "A backend system for managing meeting room bookings, built to support efficient reservations and keep booking data consistent.",
    featured: false,
    link: "https://github.com/Apexionn/Booking-Room-Meeting",
  },
  {
    num: "05",
    name: "Pengaduan Masyarakat",
    subtitle: "Public Complaint Platform",
    tags: ["Full Stack", "Web", "Android"],
    stack: "Laravel · PHP · Blade · Flutter · Dart · HTTP API",
    desc: "A public complaint platform available as a web app and an Android app. The two clients provide different ways to access the same community reporting service.",
    featured: false,
    links: [
      { label: "Web App", url: "https://github.com/Apexionn/PengaduanMasyarakat" },
      { label: "Android App", url: "https://github.com/Apexionn/pengaduan_flutter" },
    ],
  },
  {
    num: "06",
    name: "Cashier Application",
    subtitle: "Game Store Point of Sale",
    tags: ["Full Stack", "Laravel", "Store System"],
    stack: "Laravel · PHP · Blade · MySQL",
    desc: "A full stack cashier application for a game store, bringing its sales workflow into a web-based system.",
    featured: false,
    link: "https://github.com/Apexionn/Cashier-Application",
  },
];

const SKILLS = {
  core: ["React", "Node.js", "MySQL", "PostgreSQL", "Railway", "REST APIs", "Git", "TypeScript"],
  ai: ["Large Language Models", "Natural Language Processing", "Machine Learning", "Prompt Engineering", "Python", "HuggingFace", "Computer Vision"],
  tools: ["Figma", "Three.js", "Unity", "Vite", "Docker"],
};

const EXPERIENCE = [
  {
    role: "Registration Coordinator Volunteer",
    org: "Codeavour 7.0 International Finale",
    tag: "Volunteer",
    period: "May 2026",
    current: false,
    desc: "Coordinated registration and participant check-in for the Codeavour 7.0 International Finale.",
    bullets: [
      "Collaborated with committee members to ensure smooth event execution",
      "Received a Certificate of Recognition and Letter of Appreciation for outstanding contribution",
    ],
    stack: "Event Operations · Coordination",
    proofs: [
      {
        src: "/team-codeavour.jpg",
        label: "Team Photo & Certificate",
        alt: "Codeavour 7.0 Certificate of Recognition",
      },
      {
        src: "/codeavour.jpg",
        label: "Certificate",
        alt: "Codeavour 7.0 Certificate of Recognition",
      },
    ],
  },
  {
    role: "Web Development Division Coordinator",
    org: "HIMTI BINUS",
    tag: "Leadership",
    period: "April 2025 to May 2025",
    current: false,
    desc: "Led a web development team building and maintaining platforms for the organization, setting code standards and coordinating project delivery.",
    bullets: [
      "Coordinated a five-person development team across two projects",
      "Introduced a shared component library, reducing build time by approximately 30%",
    ],
    stack: "React · Figma",
    proofs: [
      {
        src: "/hishot.JPG",
        label: "Team Photo & App Preview",
        alt: "HIMTI web development team",
      },
      {
        src: "/home-hishot.png",
        label: "App Preview",
        alt: "HIMTI web development team",
      },
      {
        src: "/about-hishot.png",
        label: "App Preview",
        alt: "HIMTI web development team",
      },
      {
        src: "/events-hishot.png",
        label: "App Preview",
        alt: "HIMTI web development team",
      },
      {
        src: "/faq-hishot.png",
        label: "App Preview",
        alt: "HIMTI web development team",
      },
    ],
  },
  {
    role: "Frontend Web Developer",
    org: "PT Satrio Gemilang Perkasa",
    tag: "Contract",
    period: "Jan 2024 to Aug 2024",
    current: false,
    desc: "Built responsive interfaces for a banking application, focusing on consistent visual styling, accessibility, and a smooth experience across user journeys.",
    bullets: [
      "Built frontend features to improve accessibility across the platform",
      "Applied consistent visual styling across multiple user journeys",
    ],
    stack: "React · TypeScript · Tailwind · Bitbucket",
    proofs: [
      {
        src: "/satrio.jpeg",
        label: "Team Photo",
        alt: "Banking application interface",
      }
    ],
  },
  {
    role: "Backend Developer Intern",
    org: "PT Asuransi Bintang Tbk",
    tag: "Internship",
    period: "Aug 2023 to Oct 2023",
    current: false,
    desc: "Developed and led the implementation of backend systems for an efficient room booking management system. Optimized performance and maintained data integrity to improve user experience and operational efficiency.",
    bullets: [
      "Built backend functionality to support room booking workflows",
      "Improved system performance while maintaining reliable, consistent booking data",
    ],
    stack: "Laravel · REST APIs · Postman",
    proofs: [
      {
        src: "/asbin.jpeg",
        label: "Team Photo & App Preview",
        alt: "Meeting room booking dashboard",
      },
      {
        src: "/login.jpg",
        label: "App Preview",
        alt: "Meeting room booking dashboard",
      },
      {
        src: "/br1.png",
        label: "App Preview",
        alt: "Meeting room booking dashboard",
      },
      {
        src: "/br5.png",
        label: "App Preview",
        alt: "Meeting room booking dashboard",
      },
      {
        src: "/form5.png",
        label: "App Preview",
        alt: "Meeting room booking dashboard",
      },
    ],
  },
];

// SCROLL REVEAL HOOK
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || "0";
            setTimeout(() => el.classList.add("visible"), parseInt(delay, 10));
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal-item").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function GameWorldBackground() {
  return (
    <div className="game-world-background fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <svg className="game-world-art absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
        <defs>
          <pattern id="game-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="#b9c8e8" strokeOpacity=".045" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#game-grid)" />
        <g className="game-cloud cloud-one" fill="#536486" opacity=".34">
          <path d="M1130 170h32v-24h48v-24h72v24h48v24h48v48h-248z" />
          <path d="M120 330h32v-24h48v-24h72v24h48v24h32v48H120z" />
        </g>
        <g fill="#d7e2ff" opacity=".55">
          <path d="M200 130h8v8h-8zM390 215h6v6h-6zM900 110h8v8h-8zM1040 320h6v6h-6zM720 260h7v7h-7zM1320 390h6v6h-6zM560 100h5v5h-5z" />
        </g>
        <g className="game-platform platform-left">
          <path d="M0 746h80v-24h48v-24h128v24h48v24h64v24H0z" fill="#24304d" />
          <path d="M0 746h80v-24h48v-24h128v24h48v24h64" fill="none" stroke="#7182a7" strokeWidth="4" />
          <path d="M46 772h28v28H46zM146 772h28v28h-28zM246 772h28v28h-28z" fill="#354565" />
        </g>
        <g className="game-platform platform-right">
          <path d="M1010 820h72v-24h56v-24h120v24h54v24h128v80h-430z" fill="#24304d" />
          <path d="M1010 820h72v-24h56v-24h120v24h54v24h128" fill="none" stroke="#7182a7" strokeWidth="4" />
          <path d="M1080 844h28v28h-28zM1190 844h28v28h-28zM1300 844h28v28h-28z" fill="#354565" />
        </g>
      </svg>
      <div className="game-world-vignette absolute inset-0" />
    </div>
  );
}

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    { label: "Profile", id: "about", icon: "◉" },
    { label: "Projects", id: "work", icon: "✦" },
    { label: "Quest Log", id: "experience", icon: "▤" },
    { label: "Inventory", id: "arsenal", icon: "◇" },
    { label: "Contact", id: "contact", icon: "➜" },
  ];

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
      <nav className="game-nav fixed top-3 left-1/2 -translate-x-1/2 z-[100] flex justify-between items-center px-3 sm:px-5 py-2.5 w-[calc(100%-24px)] max-w-[1180px]">
        <a href="#hero" aria-label="Lintang Anggowoyuono, home" className="game-logo font-syne font-[800] text-[18px] sm:text-[20px] tracking-[-0.5px] no-underline relative z-[110]" onClick={() => setIsMenuOpen(false)}>
          LA<span>.</span>
        </a>

        <ul className="hidden md:flex items-center gap-1.5 list-none p-0 m-0">
          {links.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="game-nav-link font-syne-mono text-[10px] lg:text-[11px] tracking-[0.08em] uppercase no-underline">
                <span aria-hidden="true">{item.icon}</span>{item.label}
              </a>
            </li>
          ))}
        </ul>
        
        <div className="hidden xl:flex items-center gap-2 font-syne-mono text-[9px] text-port-text-muted tracking-[0.08em] uppercase">
          <span className="game-status-dot" />
          Open to quests
        </div>

        <button 
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
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
                className="game-mobile-link font-syne text-[28px] font-[800] no-underline"
              >
                <span aria-hidden="true">{item.icon}</span>{item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={`absolute bottom-10 flex items-center gap-2 font-syne-mono text-[10px] text-port-text-muted uppercase tracking-widest transition-opacity duration-500 delay-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
          <span className="game-status-dot" /> Open to quests
        </div>
      </div>
    </>
  );
}

function HeroSection() {
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
          <p className="game-eyebrow font-syne-mono text-[10px] sm:text-[11px] tracking-[0.12em] uppercase mb-5 opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.3s]">
            PLAYER 01 <span>•</span> BINUS COMPUTER SCIENCE
          </p>
          
          <h1 className="game-hero-title font-syne font-[800] leading-[0.98] tracking-[-0.06em] mb-5 opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.5s] break-words">
            <span>Lintang</span>
            <br />
            <span>Anggowoyuono</span>
          </h1>
          
          <p className="game-hero-copy text-[14px] sm:text-[16px] leading-[1.8] max-w-[480px] mb-8 opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.7s]">
            Full Stack • AI • Game Dev<br />
            I build useful things with code, curiosity, and a little player energy.
          </p>
          
          <div className="relative w-full">
            <div className="flex items-center opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.9s]">
              <div className="flex gap-[16px] flex-wrap">
                <a href="#work" className="game-button game-button-primary font-syne-mono text-[10px] sm:text-[11px] tracking-[0.08em] py-3.5 px-5 sm:px-6 font-[500] inline-flex items-center gap-3 no-underline">
                  <span aria-hidden="true">▶</span> Start exploring
                </a>
                <a href="/cv-lintang-anggowoyuono.pdf" target="_blank" rel="noreferrer" className="game-button game-button-secondary font-syne-mono text-[10px] sm:text-[11px] tracking-[0.08em] py-3.5 px-5 sm:px-6 inline-flex items-center gap-2 no-underline">
                  Resume ↓
                </a>
              </div>
            </div>

            {isDesktop && (
              <div className="game-scroll-hint mt-8 flex items-center gap-3 font-syne-mono text-[9px] tracking-[0.12em] uppercase opacity-0 animate-[fadeUp_0.6s_ease_forwards_1.2s]">
                <span className="game-scroll-arrow">↓</span> Scroll to continue
              </div>
            )}

          </div>
        </div>

        <div className="game-avatar-stage relative flex-none w-[220px] sm:w-[280px] md:w-[330px] lg:w-[390px] mt-3 md:mt-0 reveal-item" data-delay="250">
          <div className="game-avatar-card relative p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="game-pixel-label">PLAYER CARD</span>
              <span className="game-pixel-label game-pixel-label-accent">LV. 03</span>
            </div>
            <div className="game-avatar-window relative overflow-hidden">
              <img src="/lintang.jpeg" alt="Lintang Anggowoyuono" className="w-full h-full object-cover object-center" />
              <div className="game-avatar-scanline" />
              <span className="game-avatar-corner avatar-corner-tl" />
              <span className="game-avatar-corner avatar-corner-br" />
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <span className="font-syne text-[15px] font-[800]">LINTANG A.</span>
              <span className="game-player-status"><i /> Online</span>
            </div>
          </div>
          <div className="game-floating-token token-star" aria-hidden="true">✦</div>
          <div className="game-floating-token token-heart" aria-hidden="true">♥</div>
        </div>

      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="game-section relative z-10 py-20 md:py-28" id="about">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="game-section-label font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-4 reveal-item" data-delay="0">
          <span className="game-label-icon">01</span> Character Profile
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-[80px] items-start">
          <div className="reveal-item" data-delay="100">
            <h2 className="game-section-title font-syne text-[clamp(32px,4vw,52px)] font-[800] leading-[1.02] mb-8">
              Meet the<br />player.
            </h2>
            <div className="game-profile-stats mt-8">
              {[
                { label: "Name", value: "Lintang Anggowoyuono" },
                { label: "Location", value: "Jakarta, Indonesia" },
                { label: "Education", value: "BINUS University" },
                { label: "Focus", value: "Full Stack & AI Systems" },
                { label: "Community", value: "HIMTI" },
              ].map((item, i) => (
                <div className="game-stat-row flex flex-col gap-1 py-3" key={item.label}>
                  <span className="game-pixel-label">{item.label}</span>
                  <span className="font-syne text-[15px] font-[700]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-item" data-delay="200">
            <div className="game-panel game-about-copy text-[14px] sm:text-[15px] leading-[1.9] space-y-4 p-5 sm:p-7">
              <p>
                My interest in software began in an elementary school <strong className="text-port-text-primary font-[500]">game development</strong> club, where I saw how code could bring creativity and logic together. I went on to study <strong className="text-port-text-primary font-[500]">Software Engineering</strong> in vocational high school and now study Computer Science at BINUS University, exploring software engineering, artificial intelligence, and user-centered design.
              </p>
              <p>
                I have worked on interactive web applications, organizational platforms, and <span className="game-highlight">AI projects</span> in agriculture and natural language processing. I enjoy developing <strong>React interfaces</strong>, integrating <strong>machine learning models</strong>, and designing products that are reliable and easy to use.
              </p>
              <p>
                I believe technology works best when it is <strong>accessible, useful, and built with people in mind</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="game-section relative z-10 py-20 md:py-28" id="work">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="game-section-label font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-4 reveal-item" data-delay="0">
          <span className="game-label-icon">02</span> Quest Log / Selected Projects
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <h2 className="game-section-title font-syne text-[clamp(32px,4vw,52px)] font-[800] leading-[1.02] reveal-item" data-delay="100">Projects unlocked.</h2>
          <span className="game-count-badge font-syne-mono text-[9px] uppercase tracking-[0.08em]">{PROJECTS.length} quests available</span>
        </div>
        <div className="game-project-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <article
              className={`game-panel game-project-card group reveal-item p-5 sm:p-6 ${p.featured ? 'is-featured' : ''}`}
              data-delay={String(i * 80 + 150)} 
              key={p.num}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="game-pixel-label">QUEST {p.num}</span>
                <span className="game-project-status">UNLOCKED</span>
              </div>
              <div>
                <div className="flex flex-wrap gap-[8px] mb-[12px]">
                  {p.tags.map((t) => (
                    <span className="game-tag font-syne-mono text-[9px] tracking-[0.08em] uppercase px-2.5 py-1" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="game-card-title font-syne text-[clamp(22px,2.5vw,30px)] font-[800] mb-2 transition-colors duration-200">{p.name}</h3>
                <p className="text-[13px] text-port-text-dim leading-[1.8]">{p.desc}</p>
                <p className="game-stack font-syne-mono text-[9px] mt-5 tracking-[0.04em]">ITEMS: {p.stack}</p>
              </div>
              <div className="game-project-actions mt-5 flex flex-wrap gap-x-5 gap-y-3">
                {(p.links || [{ label: "View quest", url: p.link }]).map((projectLink) => (
                  <a
                    className="game-card-action font-syne-mono text-[9px] uppercase tracking-widest inline-flex items-center gap-2 no-underline"
                    href={projectLink.url}
                    key={projectLink.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {projectLink.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [modalState, setModalState] = useState({ isOpen: false, proofs: [], currentIndex: 0 });
  const [isModalImageLoading, setIsModalImageLoading] = useState(true);
  const closeButtonRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

  const openModal = (proofs) => {
    lastFocusedElementRef.current = document.activeElement;
    setIsModalImageLoading(true); 
    setModalState({ isOpen: true, proofs: proofs, currentIndex: 0 });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setIsModalImageLoading(true);
    setModalState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex === prev.proofs.length - 1 ? 0 : prev.currentIndex + 1
    }));
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setIsModalImageLoading(true);
    setModalState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.proofs.length - 1 : prev.currentIndex - 1
    }));
  };

  // Mencegah scroll layar saat modal terbuka & Listener Keyboard
  useEffect(() => {
    if (modalState.isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Tab') {
          const focusable = document.querySelectorAll('[data-gallery-dialog] button:not([disabled])');
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
        lastFocusedElementRef.current?.focus();
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [modalState.isOpen, modalState.proofs]);

  return (
    <section className="game-section relative z-10 py-20 md:py-28" id="experience">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="game-section-label font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-4 reveal-item" data-delay="0">
          <span className="game-label-icon">03</span> Career / Milestones
        </p>
        <h2 className="game-section-title font-syne text-[clamp(32px,4vw,52px)] font-[800] leading-[1.02] mb-10 reveal-item" data-delay="100">
          Quest log.
        </h2>

        <div className="game-quest-list relative max-w-[1040px] pl-6 sm:pl-9">
          <div className="flex flex-col gap-[64px]">
            {EXPERIENCE.map((item, i) => (
              <div className="game-quest-entry relative reveal-item" data-delay={String(i * 100 + 150)} key={item.role}>
                <div className="game-panel game-quest-card flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8 p-5 sm:p-7">
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline flex-wrap gap-2 mb-[6px]">
                      <span className="game-card-title font-syne text-[21px] font-[700]">
                        {item.role}
                      </span>
                      <span className="game-period font-syne-mono text-[9px] tracking-[0.04em] whitespace-nowrap">
                        {item.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-[10px] mb-[18px]">
                      <span className="game-highlight text-[13px] font-[600]">{item.org}</span>
                      <span className="game-tag game-tag-coral font-syne-mono text-[8px] tracking-[0.08em] uppercase px-2 py-1">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-[13px] text-port-text-dim leading-[1.75] mb-4 max-w-[600px]">
                      {item.desc}
                    </p>

                    <ul className="flex flex-col gap-[10px]">
                      {item.bullets.map((b) => (
                        <li key={b} className="game-quest-bullet text-[12px] text-port-text-dim leading-[1.6] pl-5 relative">
                          <span className="absolute left-0 top-0 font-[800]">✦</span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    <p className="game-stack font-syne-mono text-[9px] mt-4 tracking-[0.04em]">
                      LOOT: {item.stack}
                    </p>
                  </div>

                  {item.proofs && item.proofs.length > 0 && (
                    <div className="flex flex-col items-start md:items-end gap-[12px] shrink-0 w-[200px]">
                      <button
                        type="button"
                        aria-label={`Open ${item.org} gallery`}
                        onClick={() => openModal(item.proofs)}
                        className="game-proof-button relative w-full h-[130px] md:w-[190px] rounded-lg flex items-center justify-center group cursor-pointer overflow-hidden transition-all duration-300"
                      >
                        <img 
                          src={item.proofs[0].src} 
                          alt={item.proofs[0].alt} 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/200x130/1A2235/00F5C4?text=Missing+Image";
                          }}
                        />

                        {item.proofs.length > 1 && (
                          <div className="game-proof-count absolute bottom-2 left-2 px-2 py-1 rounded text-[9px] font-syne-mono z-10">
                            +{item.proofs.length - 1} files
                          </div>
                        )}

                        <svg className="absolute top-[10px] right-[10px] w-4 h-4 text-port-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </button>

                      <div className="game-proof-label flex items-center gap-[6px] font-syne-mono text-[9px] tracking-[0.08em] uppercase pl-1 md:pr-1">
                        <svg className="w-[14px] h-[14px] text-port-text-dim" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                        {item.proofs[0].label}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalState.isOpen && modalState.proofs.length > 0 && createPortal(
        <div 
          role="dialog"
          aria-modal="true"
          aria-label={modalState.proofs[modalState.currentIndex].label}
          data-gallery-dialog
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 bg-[#151d35]/95 backdrop-blur-xl transition-opacity duration-300"
          onClick={closeModal}
        >
          <button 
            ref={closeButtonRef}
            type="button"
            aria-label="Close image gallery"
            className="absolute top-6 right-6 md:top-10 md:right-10 text-port-text-muted hover:text-port-teal transition-colors duration-200 cursor-pointer p-2 z-[10000]"
            onClick={closeModal}
          >
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative max-w-6xl w-full max-h-[85vh] rounded-[4px] border border-port-grid bg-port-surface overflow-hidden shadow-[0_0_50px_rgba(0,245,196,0.05)]"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="absolute top-0 left-0 w-full h-[40px] bg-port-bg border-b border-port-grid flex items-center px-4 gap-2 z-10">
               <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
               <span className="font-syne-mono text-[10px] text-port-text-muted ml-3 uppercase tracking-widest">
                 {modalState.proofs[modalState.currentIndex].label}
               </span>
               
               {modalState.proofs.length > 1 && (
                  <span className="font-syne-mono text-[10px] text-port-teal ml-auto tracking-widest">
                    {modalState.currentIndex + 1} / {modalState.proofs.length}
                  </span>
               )}
            </div>
            
            <div className="relative w-full h-full bg-[#05070A] pt-[40px] flex items-center justify-center">
              
              {isModalImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center pt-[40px] z-0">
                  <div className="w-10 h-10 border-2 border-port-grid border-t-port-teal rounded-full animate-spin shadow-[0_0_15px_rgba(0,245,196,0.2)]" />
                </div>
              )}

              {modalState.proofs.length > 1 && (
                <button type="button" aria-label="Previous image" onClick={prevImage} className="absolute left-4 w-10 h-10 rounded-full bg-port-bg/80 border border-port-grid flex items-center justify-center text-port-text-primary hover:text-port-teal hover:border-port-teal transition-all duration-200 z-20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>
              )}

              <img 
                key={modalState.currentIndex} 
                src={modalState.proofs[modalState.currentIndex].src} 
                alt={modalState.proofs[modalState.currentIndex].alt} 
                onLoad={() => setIsModalImageLoading(false)}
                className={`relative z-10 w-full h-full object-contain max-h-[calc(85vh-40px)] transition-opacity duration-300 ${isModalImageLoading ? 'opacity-0' : 'opacity-100'}`}
                onError={(e) => {
                  e.target.onerror = null;
                  setIsModalImageLoading(false);
                  e.target.src = "https://via.placeholder.com/800x600/1A2235/00F5C4?text=Image+Not+Found";
                }}
              />

              {modalState.proofs.length > 1 && (
                <button type="button" aria-label="Next image" onClick={nextImage} className="absolute right-4 w-10 h-10 rounded-full bg-port-bg/80 border border-port-grid flex items-center justify-center text-port-text-primary hover:text-port-teal hover:border-port-teal transition-all duration-200 z-20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>
              )}

            </div>
          </div>
          
          {modalState.proofs.length > 1 && (
             <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3" onClick={(e) => e.stopPropagation()}>
                {modalState.proofs.map((_, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    aria-label={`Show image ${idx + 1}`}
                    aria-current={modalState.currentIndex === idx ? "true" : undefined}
                    onClick={() => {
                      setIsModalImageLoading(true); // PERBAIKAN: Set loading di titik pagination
                      setModalState(prev => ({ ...prev, currentIndex: idx }))
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${modalState.currentIndex === idx ? 'bg-port-teal w-6' : 'bg-port-grid hover:bg-port-text-muted'}`}
                  />
                ))}
             </div>
          )}
        </div>,
        document.body
      )}
    </section>
  );
}

function ArsenalSection() {
  return (
    <section className="game-section relative z-10 py-20 md:py-28" id="arsenal">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="game-section-label font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-4 reveal-item" data-delay="0">
          <span className="game-label-icon">04</span> Player Inventory
        </p>
        <h2 className="game-section-title font-syne text-[clamp(32px,4vw,52px)] font-[800] leading-[1.02] mb-8 reveal-item" data-delay="100">
          Tools equipped.
        </h2>

        <div className="game-panel game-inventory-panel overflow-hidden reveal-item" data-delay="200">
          <div className="game-panel-header py-3 px-4 sm:px-6 flex items-center justify-between gap-3">
            <span className="game-pixel-label">LINTANG.EXE / INVENTORY</span>
            <span className="game-count-badge font-syne-mono text-[8px] uppercase tracking-[0.08em]">{Object.values(SKILLS).flat().length} items</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 p-4 sm:p-6 md:p-7">
            {[
              { title: "Core Gear", key: "core", icon: "✦" },
              { title: "AI / ML", key: "ai", icon: "◈" },
              { title: "Tools", key: "tools", icon: "⬡" },
            ].map((category) => (
              <div className="game-inventory-category" key={category.key}>
                <h3 className="game-inventory-heading font-syne text-[17px] font-[800] mb-4 flex items-center gap-2">
                  <span aria-hidden="true">{category.icon}</span>{category.title}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {SKILLS[category.key].map((skill) => (
                    <span className="game-inventory-item font-syne-mono text-[9px] px-2.5 py-2" key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
            <div className="game-status-message md:col-span-3 flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="game-status-dot" />
              <span className="game-pixel-label">CURRENT SIDE QUEST</span>
              <span className="text-[12px]">Exploring game development and new technologies.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="game-section relative z-10 py-20 md:py-28" id="contact">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="game-section-label justify-center font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-5 reveal-item" data-delay="0">
            <span className="game-label-icon">05</span> Next Quest
          </p>
          <h2 className="game-section-title font-syne text-[clamp(36px,5vw,72px)] font-[800] leading-[0.98] mb-6 reveal-item" data-delay="100">
            Ready for the<br />next level?
          </h2>
          <p className="text-[14px] text-port-text-dim leading-[1.8] mb-[48px] max-w-[480px] mx-auto reveal-item" data-delay="200">
            Have a project idea, an AI feature to discuss, or a tricky engineering problem? Let's talk.
          </p>
          <div className="flex justify-center gap-[16px] flex-wrap reveal-item" data-delay="300">
            <a href="mailto:lintanganggowo@gmail.com" className="game-button game-button-primary font-syne-mono text-[10px] tracking-[0.08em] py-3.5 px-6 font-[500] inline-flex items-center gap-3 no-underline">
              <span aria-hidden="true">✉</span> Send a message
            </a>
            <a href="https://github.com/Apexionn" target="_blank" rel="noreferrer" className="game-button game-button-secondary font-syne-mono text-[10px] tracking-[0.08em] py-3.5 px-6 inline-flex items-center gap-2 no-underline">
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="game-footer relative z-10 border-t py-[32px] px-6 md:px-[60px] flex flex-col md:flex-row justify-between items-center gap-[16px] text-center md:text-left">
      <p className="font-syne-mono text-[11px] text-port-text-muted tracking-[0.05em]">
        © 2026 Lintang Anggowoyuono. Designed &amp; engineered from scratch.
      </p>
      <ul className="flex gap-[24px] list-none">
        <li><a href="https://github.com/Apexionn" target="_blank" rel="noreferrer" className="game-footer-link font-syne-mono text-[11px] tracking-[0.08em]">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/lintang-anggowoyuono/" target="_blank" rel="noreferrer" className="game-footer-link font-syne-mono text-[11px] tracking-[0.08em]">LinkedIn</a></li>
        <li><a href="mailto:lintanganggowo@gmail.com" className="game-footer-link font-syne-mono text-[11px] tracking-[0.08em]">Email</a></li>
      </ul>
    </footer>
  );
}

// ROOT APP
export default function App() {
  useScrollReveal();

  return (
    <div className="game-page relative w-full overflow-x-hidden min-h-screen">
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
        <div className="game-section-break" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
