import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// DATA
const PROJECTS = [
  {
    num: "01",
    name: "CineMate",
    subtitle: "Cinema Booking System",
    tags: ["Full Stack", "MVVM", "React"],
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
    stack: "Python · Scikit learn · React · Supabase",
    desc: "Web based AI application that takes environmental sensor data and outputs crop yield predictions with precision fertilizer recommendations. Real machine learning in production, not a demo.",
    featured: false,
    link: "https://github.com/Apexionn/frontend_ai",
  },
  {
    num: "03",
    name: "IndoBERT vs GPT",
    subtitle: "NLP Research Few Shot Prompting",
    tags: ["AI Research", "NLP", "LLMs"],
    stack: "Python · IndoBERT · OpenAI API · HuggingFace · Jupyter",
    desc: "A rigorous comparative analysis of IndoBERT and OpenAI models on Indonesian language detection tasks. Explored few shot prompting limits, cross model accuracy deltas, and what it means to build AI for non English corpora.",
    featured: false,
    link: "https://github.com/Apexionn/AI-Detection-Gambling-Promotion",
  },
];

const SKILLS = {
  core: ["React", "Node.js", "Supabase", "PostgreSQL", "Railway", "REST APIs", "Git", "TypeScript"],
  ai: ["Large Language Models", "NLP", "IndoBERT", "Prompt Engineering", "Python", "HuggingFace", "Scikit learn"],
  tools: ["Figma", "Three.js", "Game Development", "Unity", "Vite", "Docker"],
};

// THREE.JS NEURAL MESH (Hero)
// Menggunakan isDesktop sebagai dependency agar animasi menyala kembali saat layar dilebarkan
function useNeuralMesh(canvasRef, isDesktop) {
  useEffect(() => {
    if (!isDesktop) return; // Matikan total eksekusi 3D jika di mobile untuk hemat baterai
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.clientWidth || 560;
    const H = canvas.clientHeight || 480;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
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
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

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
      renderer.dispose();
    };
  }, [isDesktop]); // <--- KUNCI PERBAIKAN BUG 1: Memantau perubahan isDesktop
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

  // Mencegah scroll layar belakang saat menu mobile terbuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-[60px] py-4 md:py-5 border-b border-port-grid bg-port-bg/80 backdrop-blur-md">
        {/* LOGO */}
        <a href="#" className="font-syne font-[800] text-[20px] text-port-text-primary tracking-[-0.5px] no-underline relative z-[110]" onClick={() => setIsMenuOpen(false)}>
          LA<span className="text-port-teal">.</span>
        </a>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-9 list-none">
          {['About', 'Work', 'Arsenal', 'Contact'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="font-syne-mono text-[11px] tracking-[0.12em] uppercase text-port-text-muted hover:text-port-teal transition-colors duration-200 no-underline">
                {item}
              </a>
            </li>
          ))}
        </ul>
        
        {/* DESKTOP STATUS */}
        <div className="hidden md:flex items-center gap-2 font-syne-mono text-[11px] text-port-text-muted">
          <div className="w-2 h-2 rounded-full bg-port-teal shadow-[0_0_10px_#00F5C4] animate-pulse-glow" />
          Available for work
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button 
          className="md:hidden relative z-[110] flex flex-col justify-center items-center w-[32px] h-[32px] gap-[6px] cursor-pointer bg-transparent border-none outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`w-[24px] h-[2px] bg-port-text-primary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <div className={`w-[24px] h-[2px] bg-port-text-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-[24px] h-[2px] bg-port-text-primary transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </nav>

      {/* MOBILE FULLSCREEN MENU - Dikeluarkan dari <nav> agar posisinya mutlak dan tidak terpotong */}
      <div className={`fixed inset-0 bg-[#080B10]/98 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 md:hidden z-[105] ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <ul className="flex flex-col gap-[36px] list-none text-center p-0 m-0">
          {['About', 'Work', 'Arsenal', 'Contact'].map((item, idx) => (
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
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // Cek ukuran saat baru pertama kali memuat web
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useNeuralMesh(canvasRef, isDesktop); // Panggil efek dengan mengirimkan status ukuran layar

  return (
    <section className="relative z-10 min-h-screen flex flex-col justify-center pt-[80px]" id="hero">
      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-[60px] flex flex-col md:flex-row items-center justify-between gap-[60px]">
        
        {/* LEFT CONTENT */}
        <div className={`w-full pt-10 md:pt-0 ${isDesktop ? 'flex-1' : 'flex-none'}`}>
          <p className="font-syne-mono text-[12px] text-port-teal tracking-[0.15em] uppercase mb-[24px] opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.3s]">
            // Full Stack · AI · Game Dev
          </p>
          <h1 className="font-syne text-[clamp(36px,4.5vw,48px)] font-[800] leading-[1.0] tracking-[-2px] mb-[24px] opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.5s]">
            <span className="text-port-text-muted font-normal text-[0.7em] tracking-[-1px]">&lt; </span>
            Building at the
            <br />
            intersection of
            <br />
            <span className="text-port-teal">Systems &amp;</span>
            <br />
            <span className="text-port-teal">Intelligence</span>
            <span className="text-port-text-muted font-normal text-[0.7em] tracking-[-1px]"> /&gt;</span>
          </h1>
          <p className="text-[14px] text-port-text-dim leading-[1.8] max-w-[440px] mb-[44px] opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.7s]">
            CS student at BINUS University. Shipping production-ready apps and training language models
          </p>
          
          {/* ACTION AREA */}
          <div className="relative w-full">
            
            {/* ROW 1: Buttons (Left) and NEURAL MESH (Right) */}
            <div className="flex items-center opacity-0 animate-[fadeUp_0.6s_ease_forwards_0.9s]">
              <div className="flex gap-[16px] flex-wrap">
                <a href="#projects" className="font-syne-mono text-[12px] tracking-[0.12em] bg-port-teal text-port-bg py-[14px] px-[28px] font-[500] inline-block transition-all duration-200 hover:opacity-85 hover:-translate-y-px" style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
                  [ View My Work ]
                </a>
                <a href="https://github.com/Apexionn" target="_blank" rel="noreferrer" className="font-syne-mono text-[12px] tracking-[0.12em] bg-transparent text-port-text-primary border border-port-grid py-[14px] px-[28px] inline-flex items-center gap-[8px] transition-all duration-200 hover:border-port-teal hover:text-port-teal hover:-translate-y-px">
                  GitHub ↗
                </a>
              </div>

              {/* Teks khusus Desktop */}
              {isDesktop && (
                <p className="absolute top-1/2 -translate-y-1/2 font-syne-mono text-[10px] text-port-text-muted text-right leading-[1.6] tracking-[0.08em]" style={{ right: 'calc(-100% - 60px)' }}>
                  NEURAL MESH
                  <br />
                  INTERACTIVE · REAL-TIME
                </p>
              )}
            </div>

            {/* KUNCI PERBAIKAN BUG 2: Gunakan {isDesktop && ...} agar React benar-benar menghapusnya dari HP */}
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

        {/* RIGHT CANVAS - Hanya di-render jika ukuran layar Desktop */}
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
                { label: "Community", value: "HIMTI & Binus Game Dev Club" },
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

            {/* TEXT CONTENT */}
            <div className="text-[15px] text-port-text-dim leading-[1.9] space-y-[20px]">
              <p>
                I'm Lintang Anggowoyuono, a Computer Science student at{" "}
                <strong className="text-port-text-primary font-[500]">BINUS University</strong> with a passion for building technology that transforms ideas into meaningful digital experiences.
              </p>
              <p>
                My journey began in elementary school through a <strong className="text-port-text-primary font-[500]">game development</strong> club, where I discovered how software could bring creativity and logic together. That curiosity led me to pursue <strong className="text-port-text-primary font-[500]">Software Engineering</strong> in vocational high school and eventually Computer Science at BINUS University, where I continue to explore the intersection of software engineering, artificial intelligence, and user centered design.
              </p>
              <p>
                Over the years, I have worked on projects ranging from interactive web applications and organizational platforms to <span className="text-port-teal">AI powered solutions</span> in agriculture and natural language processing. Whether I'm developing <strong className="text-port-text-primary font-[500]">React frontends</strong>, integrating <strong className="text-port-text-primary font-[500]">machine learning models</strong>, or designing intuitive user experiences, I enjoy creating products that are both technically reliable and easy to use.
              </p>
              <p>
                I believe the best technology is not only functional but also <strong className="text-port-text-primary font-[500]">accessible, impactful, and built with people in mind</strong>.
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

function ArsenalSection() {
  return (
    <section className="relative z-10 py-[100px]" id="arsenal">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="font-syne-mono text-[11px] tracking-[0.2em] uppercase text-port-teal mb-[16px] flex items-center gap-[12px] after:content-[''] after:block after:h-px after:w-[60px] after:bg-port-teal after:opacity-40 reveal-item" data-delay="0">
          03 / Tech Arsenal
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
              <span className="text-[#8A9BB5]">Always learning. Currently exploring: Agents & RAG pipelines. </span>
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
            04 / Contact
          </p>
          <h2 className="font-syne text-[clamp(36px,5vw,72px)] font-[800] tracking-[-3px] leading-[0.95] text-port-text-primary mb-[28px] reveal-item" data-delay="100">
            Let's build something
            <br />
            <span className="text-port-teal">worth shipping.</span>
          </h2>
          <p className="text-[14px] text-port-text-dim leading-[1.8] mb-[48px] max-w-[480px] mx-auto reveal-item" data-delay="200">
            Whether it's a system architecture, an AI feature, or just a
            conversation about hard problems my inbox is open.
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
    <>
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
        <ArsenalSection />
        <div className="h-px bg-gradient-to-r from-transparent via-port-grid to-transparent m-0" />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}