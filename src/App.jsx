import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

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

// THREE.JS NEURAL MESH (Hero)
function useNeuralMesh(canvasRef, isDesktop) {
  useEffect(() => {
    if (!isDesktop) return; 
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.clientWidth || 560;
    const H = canvas.clientHeight || 480;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // "false" = jangan biarkan Three.js menimpa CSS width/height canvas.
    // Biarkan Tailwind (w-full h-full) yang mengatur ukuran tampilan,
    // Three.js cukup mengatur resolusi buffer render internalnya saja.
    renderer.setSize(W, H, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const NODE_COUNT = 64;
    const CONNECT_DIST = 2.0;

    const nodes = Array.from({ length: NODE_COUNT }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.2 + Math.random() * 1.2;
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        isCentral: Math.random() < 0.12,
      };
    });

    const tealMat = new THREE.MeshBasicMaterial({ color: 0x00f5c4 });
    const violetMat = new THREE.MeshBasicMaterial({ color: 0x5e4ae3 });
    const dimMat = new THREE.MeshBasicMaterial({ color: 0x1a2235 });

    const smallGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const bigGeo = new THREE.SphereGeometry(0.08, 10, 10);

    const meshes = nodes.map((n) => {
      const geo = n.isCentral ? bigGeo : smallGeo;
      const mat = n.isCentral ? violetMat : Math.random() < 0.3 ? dimMat : tealMat;
      const m = new THREE.Mesh(geo, mat);
      m.position.set(n.x, n.y, n.z);
      scene.add(m);
      return m;
    });

    const maxLines = NODE_COUNT * NODE_COUNT;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineSegments = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ vertexColors: true, opacity: 0.18, transparent: true })
    );
    scene.add(lineSegments);

    let targetMX = 0, targetMY = 0, currentMX = 0, currentMY = 0;
    const wrap = canvas.parentElement;
    
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      targetMX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetMY = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { targetMX = 0; targetMY = 0; };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    const onResize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ResizeObserver menangkap perubahan ukuran container itu sendiri
    // (misal saat layout flex berubah), bukan cuma saat window di-resize.
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(wrap);

    let frameId;
    let frame = 0;
    const TEAL = new THREE.Color(0x00f5c4);
    const VIOLET = new THREE.Color(0x5e4ae3);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      frame++;

      currentMX += (targetMX - currentMX) * 0.04;
      currentMY += (targetMY - currentMY) * 0.04;

      const t = frame * 0.006;
      scene.rotation.y = t * 0.1 + currentMX * 0.35;
      scene.rotation.x = Math.sin(t * 0.05) * 0.12 + currentMY * 0.2;

      nodes.forEach((n, i) => {
        n.pulse += n.pulseSpeed;
        const s = 0.85 + 0.3 * Math.sin(n.pulse);
        meshes[i].scale.setScalar(s);
      });

      let lineIdx = 0;
      const tealArr = [TEAL.r, TEAL.g, TEAL.b];
      const violetArr = [VIOLET.r, VIOLET.g, VIOLET.b];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < CONNECT_DIST) {
            const base = lineIdx * 6;
            linePositions[base] = nodes[i].x; linePositions[base + 1] = nodes[i].y; linePositions[base + 2] = nodes[i].z;
            linePositions[base + 3] = nodes[j].x; linePositions[base + 4] = nodes[j].y; linePositions[base + 5] = nodes[j].z;

            const colorArr = nodes[i].isCentral || nodes[j].isCentral ? violetArr : tealArr;
            lineColors[base] = colorArr[0]; lineColors[base + 1] = colorArr[1]; lineColors[base + 2] = colorArr[2];
            lineColors[base + 3] = colorArr[0]; lineColors[base + 4] = colorArr[1]; lineColors[base + 5] = colorArr[2];
            lineIdx++;
          }
        }
      }

      for (let k = lineIdx * 6; k < linePositions.length; k++) linePositions[k] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx * 2);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [isDesktop]);
}

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

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-[60px] py-4 md:py-5 border-b border-port-grid bg-port-bg/80 backdrop-blur-md">
        <a href="#" className="font-syne font-[800] text-[20px] text-port-text-primary tracking-[-0.5px] no-underline relative z-[110]" onClick={() => setIsMenuOpen(false)}>
          LA<span className="text-port-teal">.</span>
        </a>

        <ul className="hidden md:flex gap-9 list-none">
          {['About', 'Work', 'Experience', 'Arsenal', 'Contact'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="font-syne-mono text-[11px] tracking-[0.12em] uppercase text-port-text-muted hover:text-port-teal transition-colors duration-200 no-underline">
                {item}
              </a>
            </li>
          ))}
        </ul>
        
        <div className="hidden md:flex items-center gap-2 font-syne-mono text-[11px] text-port-text-muted">
          <div className="w-2 h-2 rounded-full bg-port-teal shadow-[0_0_10px_#00F5C4] animate-pulse-glow" />
          Available for work
        </div>

        <button 
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="md:hidden relative z-[110] flex flex-col justify-center items-center w-[32px] h-[32px] gap-[6px] cursor-pointer bg-transparent border-none outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`w-[24px] h-[2px] bg-port-text-primary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <div className={`w-[24px] h-[2px] bg-port-text-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-[24px] h-[2px] bg-port-text-primary transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </nav>

      <div id="mobile-navigation" aria-hidden={!isMenuOpen} inert={!isMenuOpen} className={`fixed inset-0 bg-[#080B10]/98 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 md:hidden z-[105] ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <ul className="flex flex-col gap-[36px] list-none text-center p-0 m-0">
          {['About', 'Work', 'Experience', 'Arsenal', 'Contact'].map((item, idx) => (
            <li key={item} style={{ transitionDelay: `${idx * 100}ms` }} className={`transition-transform duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <a 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setIsMenuOpen(false)}
                className="font-syne text-[36px] font-[800] tracking-[-1px] text-port-text-primary hover:text-port-teal transition-colors duration-200 no-underline"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className={`absolute bottom-[60px] flex items-center gap-2 font-syne-mono text-[11px] text-port-text-muted transition-opacity duration-500 delay-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-2 h-2 rounded-full bg-port-teal shadow-[0_0_10px_#00F5C4] animate-pulse-glow" />
          Available for work
        </div>
      </div>
    </>
  );
}

function HeroSection() {
  const canvasRef = useRef(null);
  
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useNeuralMesh(canvasRef, isDesktop);

  return (
    <section className="relative z-10 min-h-screen flex flex-col justify-center pt-[80px]" id="hero">
      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-[60px] flex flex-col md:flex-row items-center justify-between gap-[60px]">
        
        <div className={`w-full pt-10 md:pt-0 ${isDesktop ? 'flex-1' : 'flex-none'}`}>
          <p className="font-syne-mono text-[12px] text-port-teal tracking-[0.15em] uppercase mb-[24px] opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.3s]">
            // Full Stack · AI · Game Dev
          </p>
          
          <h1 className="font-syne text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-[800] leading-[1.1] md:leading-[1.0] tracking-[-1px] md:tracking-[-2px] mb-[24px] opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.5s] break-words">
            <span className="text-port-text-muted font-normal text-[0.7em] tracking-[-1px]">&lt; </span>
            Hello!
            <br />
            I'm
            <br />
            <span className="text-port-teal break-words">Lintang</span>
            <br />
            <span className="text-port-teal break-words">Anggowoyuono</span>
            <span className="text-port-text-muted font-normal text-[0.7em] tracking-[-1px]"> /&gt;</span>
          </h1>
          
          <p className="text-[14px] text-port-text-dim leading-[1.8] max-w-[440px] mb-[44px] opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.7s]">
            Computer Science student at BINUS University, building web applications and exploring language models.
          </p>
          
          <div className="relative w-full">
            <div className="flex items-center opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.9s]">
              <div className="flex gap-[16px] flex-wrap">
                <a href="/cv-lintang-anggowoyuono.pdf" target="_blank" rel="noreferrer" className="font-syne-mono text-[12px] tracking-[0.12em] bg-port-teal text-port-bg py-[14px] px-[28px] font-[500] inline-block transition-all duration-200 hover:opacity-85 hover:-translate-y-px" style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
                  [ Download CV ]
                </a>
                <a href="https://github.com/Apexionn" target="_blank" rel="noreferrer" className="font-syne-mono text-[12px] tracking-[0.12em] bg-transparent text-port-text-primary border border-port-grid py-[14px] px-[28px] inline-flex items-center gap-[8px] transition-all duration-200 hover:border-port-teal hover:text-port-teal hover:-translate-y-px">
                  GitHub ↗
                </a>
              </div>
            </div>

            {isDesktop && (
              <div className="mt-[40px] flex items-center gap-[12px] font-syne-mono text-[10px] text-port-text-muted tracking-[0.15em] uppercase opacity-0 animate-[fadeUp_0.6s_ease_forwards_1.2s]">
                <div className="w-[40px] h-px bg-port-grid relative overflow-hidden">
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-port-teal animate-scanline" />
                </div>
                scroll to explore
              </div>
            )}

          </div>
        </div>

        {isDesktop && (
          <div className="flex-1 w-full relative h-[320px] md:h-[480px]">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        )}

      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="relative z-10 py-[100px]" id="about">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="font-syne-mono text-[11px] tracking-[0.2em] uppercase text-port-teal mb-[16px] flex items-center gap-[12px] after:content-[''] after:block after:h-px after:w-[60px] after:bg-port-teal after:opacity-40 reveal-item" data-delay="0">
          01 / About
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-[80px] items-start">
          <div className="reveal-item" data-delay="100">
            <h2 className="font-syne text-[clamp(32px,4vw,52px)] font-[800] tracking-[-1.5px] leading-[1.05] text-port-text-primary mb-[32px]">
              The mind
              <br />
              behind the code.
            </h2>
            <div className="mt-[32px]">
              {[
                { label: "Name", value: "Lintang Anggowoyuono" },
                { label: "Location", value: "Jakarta, Indonesia" },
                { label: "Education", value: "BINUS University" },
                { label: "Focus", value: "Full Stack & AI Systems" },
                { label: "Community", value: "HIMTI" },
              ].map((item, i) => (
                <div className={`flex flex-col gap-[4px] py-[20px] border-b border-port-grid ${i === 0 ? 'border-t' : ''}`} key={item.label}>
                  <span className="font-syne-mono text-[10px] text-port-text-muted uppercase tracking-[0.12em]">{item.label}</span>
                  <span className="font-syne text-[15px] font-[700] text-port-text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-item flex flex-col gap-8" data-delay="200">
            <div className="w-full max-w-[300px] aspect-square rounded-[4px] overflow-hidden border border-port-grid relative">
              <img 
                src="/lintang.jpeg" 
                alt="Lintang Anggowoyuono" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="text-[15px] text-port-text-dim leading-[1.9] space-y-[20px]">
              <p>
                My interest in software began in an elementary school <strong className="text-port-text-primary font-[500]">game development</strong> club, where I saw how code could bring creativity and logic together. I went on to study <strong className="text-port-text-primary font-[500]">Software Engineering</strong> in vocational high school and now study Computer Science at BINUS University, exploring software engineering, artificial intelligence, and user-centered design.
              </p>
              <p>
                I have worked on interactive web applications, organizational platforms, and <span className="text-port-teal">AI projects</span> in agriculture and natural language processing. I enjoy developing <strong className="text-port-text-primary font-[500]">React interfaces</strong>, integrating <strong className="text-port-text-primary font-[500]">machine learning models</strong>, and designing products that are reliable and easy to use.
              </p>
              <p>
                I believe technology works best when it is <strong className="text-port-text-primary font-[500]">accessible, useful, and built with people in mind</strong>.
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
    <section className="relative z-10 py-[100px]" id="work">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="font-syne-mono text-[11px] tracking-[0.2em] uppercase text-port-teal mb-[16px] flex items-center gap-[12px] after:content-[''] after:block after:h-px after:w-[60px] after:bg-port-teal after:opacity-40 reveal-item" data-delay="0">
          02 / Selected Work
        </p>
        <h2 className="font-syne text-[clamp(32px,4vw,52px)] font-[800] tracking-[-1.5px] leading-[1.05] text-port-text-primary mb-[32px] reveal-item" data-delay="100">
          Projects that
          <br />
          shipped.
        </h2>
        <div className="flex flex-col">
          {PROJECTS.map((p, i) => (
            <a 
              href={p.link} 
              target="_blank" 
              rel="noreferrer" 
              className="group grid grid-cols-[48px_1fr] md:grid-cols-[80px_1fr_auto] gap-x-[40px] items-start py-[44px] border-b border-port-grid transition-colors duration-300 hover:bg-port-surface/55 cursor-pointer first:border-t reveal-item no-underline block" 
              data-delay={String(i * 80 + 150)} 
              key={p.num}
            >
              <p className="font-syne-mono text-[12px] text-port-text-muted pt-[4px] tracking-[0.08em]">[ {p.num} ]</p>
              <div>
                <div className="flex flex-wrap gap-[8px] mb-[12px]">
                  {p.tags.map((t) => (
                    <span className={`font-syne-mono text-[10px] tracking-[0.1em] uppercase px-[10px] py-[4px] rounded-[2px] ${p.featured ? 'bg-port-teal/10 text-port-teal border border-port-teal/20' : 'bg-port-grid text-port-text-muted'}`} key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-syne text-[clamp(22px,2.5vw,32px)] font-[800] tracking-[-1px] text-port-text-primary mb-[12px] transition-colors duration-200 group-hover:text-port-teal">{p.name}</h3>
                <p className="text-[14px] text-port-text-dim leading-[1.8] max-w-[560px]">{p.desc}</p>
                <p className="font-syne-mono text-[11px] text-port-text-muted mt-[16px] tracking-[0.05em]">stack: {p.stack}</p>
              </div>
              <span className="hidden md:block text-[28px] text-port-grid transition-all duration-250 pt-[4px] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-port-teal" aria-hidden="true">↗</span>
            </a>
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
    <section className="relative z-10 py-[100px]" id="experience">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="font-syne-mono text-[11px] tracking-[0.2em] uppercase text-port-teal mb-[16px] flex items-center gap-[12px] after:content-[''] after:block after:h-px after:w-[60px] after:bg-port-teal after:opacity-40 reveal-item" data-delay="0">
          03 / Experience
        </p>
        <h2 className="font-syne text-[clamp(32px,4vw,52px)] font-[800] tracking-[-1.5px] leading-[1.05] text-port-text-primary mb-[56px] reveal-item" data-delay="100">
          The
          <br />
          Journey.
        </h2>

        <div className="relative max-w-[960px] pl-8">
          <div
            className="absolute left-[5px] top-2 bottom-2 w-px"
            style={{ background: "linear-gradient(to bottom, #00F5C4, #1A2235 80%)" }}
          />

          <div className="flex flex-col gap-[64px]">
            {EXPERIENCE.map((item, i) => (
              <div className="relative reveal-item" data-delay={String(i * 100 + 150)} key={item.role}>
                <div
                  className={`absolute -left-8 top-1 w-[11px] h-[11px] rounded-full bg-port-bg border-2 ${
                    item.current ? "border-port-teal" : "border-port-text-muted"
                  }`}
                  style={{ boxShadow: "0 0 0 4px #080B10" }}
                >
                  {item.current && (
                    <span
                      className="absolute -inset-[6px] rounded-full border border-port-teal opacity-40 animate-ping"
                      style={{ animationDuration: "2s" }}
                    />
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-[40px]">
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline flex-wrap gap-2 mb-[6px]">
                      <span className="font-syne text-[22px] font-[700] text-port-text-primary">
                        {item.role}
                      </span>
                      <span className="font-syne-mono text-[11px] text-port-text-muted tracking-[0.05em] whitespace-nowrap">
                        {item.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-[10px] mb-[18px]">
                      <span className="text-[14px] text-port-teal font-[500]">{item.org}</span>
                      <span className="font-syne-mono text-[9px] tracking-[0.08em] uppercase px-[9px] py-[3px] rounded-[2px] bg-port-violet/10 text-[#A394F5] border border-port-violet/30">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-[14px] text-port-text-dim leading-[1.75] mb-[20px] max-w-[600px]">
                      {item.desc}
                    </p>

                    <ul className="flex flex-col gap-[10px]">
                      {item.bullets.map((b) => (
                        <li key={b} className="text-[13px] text-port-text-dim leading-[1.6] pl-[20px] relative">
                          <span className="absolute left-0 top-0 text-port-teal font-[800]">›</span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    <p className="font-syne-mono text-[11px] text-port-text-muted mt-[20px] tracking-[0.04em]">
                      stack: {item.stack}
                    </p>
                  </div>

                  {item.proofs && item.proofs.length > 0 && (
                    <div className="flex flex-col items-start md:items-end gap-[12px] shrink-0 w-[200px]">
                      <button
                        type="button"
                        aria-label={`Open ${item.org} gallery`}
                        onClick={() => openModal(item.proofs)}
                        className="relative w-full h-[130px] rounded-[4px] bg-port-surface border border-port-grid flex items-center justify-center group cursor-pointer overflow-hidden transition-all duration-300 hover:border-port-teal hover:-translate-y-1"
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
                          <div className="absolute bottom-2 left-2 bg-[#080B10]/80 backdrop-blur-md border border-port-grid px-[6px] py-[2px] rounded text-[9px] font-syne-mono text-port-text-primary z-10">
                            1 / {item.proofs.length}
                          </div>
                        )}

                        <svg className="absolute top-[10px] right-[10px] w-4 h-4 text-port-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </button>

                      <div className="flex items-center gap-[6px] font-syne-mono text-[10px] text-port-text-muted tracking-[0.1em] uppercase pl-1 md:pr-1">
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
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 bg-[#080B10]/95 backdrop-blur-xl transition-opacity duration-300"
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
    <section className="relative z-10 py-[100px]" id="arsenal">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="font-syne-mono text-[11px] tracking-[0.2em] uppercase text-port-teal mb-[16px] flex items-center gap-[12px] after:content-[''] after:block after:h-px after:w-[60px] after:bg-port-teal after:opacity-40 reveal-item" data-delay="0">
          04 / Tech Arsenal
        </p>
        <h2 className="font-syne text-[clamp(32px,4vw,52px)] font-[800] tracking-[-1.5px] leading-[1.05] text-port-text-primary mb-[32px] reveal-item" data-delay="100">
          The stack.
        </h2>

        <div className="bg-port-surface border border-port-grid rounded-[4px] overflow-hidden reveal-item" data-delay="200">
          <div className="bg-port-surface-alt border-b border-port-grid py-[12px] px-[20px] flex items-center gap-[8px]">
            <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E]" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#28C840]" />
            <span className="font-syne-mono text-[11px] text-port-text-muted ml-[12px] tracking-[0.08em]">lintang@dev — ~/arsenal</span>
          </div>
          <div className="py-[32px] px-[40px]">
            <div className="font-syne-mono text-[13px] mb-[20px] leading-[1.5]">
              <span className="text-port-teal select-none">$ </span>
              <span className="text-port-text-dim">ls --category core stack</span>
            </div>
            <div className="flex flex-wrap gap-[8px] mt-[6px] md:pl-[16px]">
              {SKILLS.core.map((s) => (
                <span className="font-syne-mono text-[11px] tracking-[0.08em] px-[14px] py-[6px] rounded-[2px] transition-transform duration-150 hover:-translate-y-[2px] cursor-default bg-port-teal/10 text-port-teal border border-port-teal/25" key={s}>{s}</span>
              ))}
            </div>

            <div className="font-syne-mono text-[13px] mb-[20px] leading-[1.5] mt-[24px]">
              <span className="text-port-teal select-none">$ </span>
              <span className="text-port-text-dim">ls --category ai and ml</span>
            </div>
            <div className="flex flex-wrap gap-[8px] mt-[6px] md:pl-[16px]">
              {SKILLS.ai.map((s) => (
                <span className="font-syne-mono text-[11px] tracking-[0.08em] px-[14px] py-[6px] rounded-[2px] transition-transform duration-150 hover:-translate-y-[2px] cursor-default bg-port-violet/10 text-[#A394F5] border border-port-violet/30" key={s}>{s}</span>
              ))}
            </div>

            <div className="font-syne-mono text-[13px] mb-[20px] leading-[1.5] mt-[24px]">
              <span className="text-port-teal select-none">$ </span>
              <span className="text-port-text-dim">ls --category tools and design</span>
            </div>
            <div className="flex flex-wrap gap-[8px] mt-[6px] md:pl-[16px]">
              {SKILLS.tools.map((s) => (
                <span className="font-syne-mono text-[11px] tracking-[0.08em] px-[14px] py-[6px] rounded-[2px] transition-transform duration-150 hover:-translate-y-[2px] cursor-default bg-port-grid text-port-text-dim border border-port-grid" key={s}>{s}</span>
              ))}
            </div>

            <div className="font-syne-mono text-[13px] mb-[20px] leading-[1.5] mt-[28px]">
              <span className="text-port-teal select-none">$ </span>
              <span className="text-port-text-dim">status</span>
            </div>
            <div className="font-syne-mono text-[13px] leading-[1.5] md:pl-[16px]">
              <span className="text-port-teal">→ </span>
              <span className="text-[#8A9BB5]">Currently exploring: game development and new technologies.</span>
              <span className="inline-block w-[8px] h-[14px] bg-port-teal align-[-2px] animate-blink" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="relative z-10 py-[100px]" id="contact">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="font-syne-mono text-[11px] tracking-[0.2em] uppercase text-port-teal mb-[28px] flex items-center justify-center gap-[12px] after:content-[''] after:block after:h-px after:w-[60px] after:bg-port-teal after:opacity-40 before:content-[''] before:block before:h-px before:w-[60px] before:bg-port-teal before:opacity-40 reveal-item" data-delay="0">
            05 / Contact
          </p>
          <h2 className="font-syne text-[clamp(36px,5vw,72px)] font-[800] tracking-[-3px] leading-[0.95] text-port-text-primary mb-[28px] reveal-item" data-delay="100">
            Let's build something
            <br />
            <span className="text-port-teal">worth shipping.</span>
          </h2>
          <p className="text-[14px] text-port-text-dim leading-[1.8] mb-[48px] max-w-[480px] mx-auto reveal-item" data-delay="200">
            Have a project idea, an AI feature to discuss, or a tricky engineering
            problem? Send me a message.
          </p>
          <div className="flex justify-center gap-[16px] flex-wrap reveal-item" data-delay="300">
            <a href="mailto:lintanganggowo@gmail.com" className="font-syne-mono text-[12px] tracking-[0.12em] bg-port-teal text-port-bg py-[14px] px-[28px] font-[500] inline-block transition-all duration-200 hover:opacity-85 hover:-translate-y-px" style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
              [ Send a message ]
            </a>
            <a href="https://github.com/Apexionn" target="_blank" rel="noreferrer" className="font-syne-mono text-[12px] tracking-[0.12em] bg-transparent text-port-text-primary border border-port-grid py-[14px] px-[28px] inline-flex items-center gap-[8px] transition-all duration-200 hover:border-port-teal hover:text-port-teal hover:-translate-y-px">
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
    <footer className="relative z-10 border-t border-port-grid py-[32px] px-6 md:px-[60px] flex flex-col md:flex-row justify-between items-center gap-[16px] text-center md:text-left">
      <p className="font-syne-mono text-[11px] text-port-text-muted tracking-[0.05em]">
        © 2026 Lintang Anggowoyuono. Designed &amp; engineered from scratch.
      </p>
      <ul className="flex gap-[24px] list-none">
        <li><a href="https://github.com/Apexionn" target="_blank" rel="noreferrer" className="font-syne-mono text-[11px] text-port-text-muted tracking-[0.08em] hover:text-port-teal transition-colors duration-200">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/lintang-anggowoyuono/" target="_blank" rel="noreferrer" className="font-syne-mono text-[11px] text-port-text-muted tracking-[0.08em] hover:text-port-teal transition-colors duration-200">LinkedIn</a></li>
        <li><a href="mailto:lintanganggowo@gmail.com" className="font-syne-mono text-[11px] text-port-text-muted tracking-[0.08em] hover:text-port-teal transition-colors duration-200">Email</a></li>
      </ul>
    </footer>
  );
}

// ROOT APP
export default function App() {
  useScrollReveal();

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen">
      <div className="fixed inset-0 opacity-45 pointer-events-none z-0" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(#1A2235 1px, transparent 1px), linear-gradient(90deg, #1A2235 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, #080B10 100%)' }} />

      <Nav />
      <main>
        <HeroSection />
        <div className="h-px bg-gradient-to-r from-transparent via-port-grid to-transparent m-0" />
        <AboutSection />
        <div className="h-px bg-gradient-to-r from-transparent via-port-grid to-transparent m-0" />
        <ProjectsSection />
        <div className="h-px bg-gradient-to-r from-transparent via-port-grid to-transparent m-0" />
        <ExperienceSection />
        <div className="h-px bg-gradient-to-r from-transparent via-port-grid to-transparent m-0" />
        <ArsenalSection />
        <div className="h-px bg-gradient-to-r from-transparent via-port-grid to-transparent m-0" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
