import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { INTRO_CONFIG, makeIntroTimeline, waitForHeroAssets } from "./journey/introController";
import "./journey-intro.css";

const ROUTE = "M 146 510 C 190 475 224 458 264 464 C 306 469 319 420 366 409 C 415 397 436 439 474 416 C 513 393 510 335 555 315 C 596 297 621 342 655 354 C 696 369 724 407 767 414 C 814 422 842 438 878 427 C 916 416 932 397 958 388 C 984 379 1000 388 1017 398";
const WAYPOINTS = [
  { id: "about", t: 0.04, label: "The Wayfarer's Village", section: "About", dx: -15, dy: 28, anchor: "end", width: 58 },
  { id: "skills", t: 0.27, label: "Whispering Wood", section: "Skills", dx: -16, dy: 27, anchor: "end", width: 53 },
  { id: "projects", t: 0.49, label: "The Old King's Pass", section: "Projects", dx: 18, dy: 25, anchor: "start", width: 66 },
  { id: "contact", t: 0.75, label: "The Forgotten Ruins", section: "Contact", dx: 20, dy: 28, anchor: "start", width: 58 },
  { id: "portfolio", t: 1, label: "Emberfall Keep", section: "Portfolio", dx: -20, dy: 65, anchor: "end", width: 72 },
];

function Tree({ x, y, size = 1, pale = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`} className="journey-ink-tree">
      <ellipse cx="0" cy="12" rx="17" ry="8" fill="#403b2c" opacity=".12" />
      <path d="M-2 14 0-16 3 14Z" fill="#755638" stroke="#443b2c" strokeWidth="1.6" />
      <path d="M0-24C-7-20-12-12-8-7C-15-4-12 4-5 5C-8 13 8 14 9 5C17 2 14-5 9-8C14-16 8-22 4-22C3-29 0-29 0-24Z" fill={pale ? "#71805b" : "#536b4b"} stroke="#3f4936" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M-6-13Q0-18 5-13M-7-2Q0-7 8-2M-4 7Q2 2 7 7" fill="none" stroke="#a58b58" strokeWidth="1.2" opacity=".75" />
      <circle cx="-2" cy="-15" r="1.3" fill="#d5c28b" opacity=".8" />
    </g>
  );
}

function Cottage({ x, y, scale = 1, roof = "#854d3c", roofStyle = "gable", chimney = false }) {
  const roofPath = roofStyle === "hip"
    ? "M-31 2 0-21 31 2 25 6 0-12-25 6Z"
    : roofStyle === "steep"
      ? "M-31 2 0-30 31 2 24 5 0-18-24 5Z"
      : "M-31 2 0-23 31 2 26 5 0-15-26 6Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#473a2c" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M-26 1 0-19 27 1V25H-26Z" fill="#ddc58e" />
      <path d={roofPath} fill={roof} />
      <path d="M-5 8H5V25H-5Z" fill="#70513b" />
      <path d="M-20 7H-12V14H-20ZM12 7H20V14H12Z" fill="#f0cd79" />
      <path d="M-19 8V14M-13 8V14M13 8V14M19 8V14" stroke="#70513b" strokeWidth="1" />
      {chimney && <path d="M18-13V-27H24V-10" fill="#94704a" />}
      <path d="M-28 26H30" fill="none" stroke="#765b3b" strokeWidth="2" />
    </g>
  );
}

function Mountain({ x, y, scale = 1, back = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#574b3a" strokeWidth="2" strokeLinejoin="round">
      <path d="M-80 50-29-18-7 7 25-48 86 50Z" fill={back ? "#b4a17a" : "#8e8067"} />
      <path d="m-29-18 11 19-17-3-9 16-13 4ZM25-48 40-14 25-20 12-3 5-7Z" fill="#e8dbb9" stroke="#75664f" strokeWidth="1.5" />
      <path d="M-80 50-29-18-7 7 25-48 86 50M-57 32-31 23-17 30M27 19l20-10 25 18" fill="none" stroke="#655b48" strokeWidth="1.4" opacity=".75" />
      <path d="M-75 49Q-44 38-15 47T45 45L86 50" fill="none" stroke="#526247" strokeWidth="5" />
    </g>
  );
}

function Ruins() {
  return (
    <g className="journey-ruins" stroke="#635744" strokeWidth="3" strokeLinejoin="round">
      <path d="M742 399V354Q742 337 758 337Q774 337 774 354V401M798 405V343L811 339V404M849 396V363Q849 347 865 347Q881 347 881 363V382" fill="#b8a57e" />
      <path d="M735 352H780M792 342 818 336V349L792 355ZM842 360H884M733 404l39-2 9 10-53 3ZM790 410l31-8 8 11-42 7ZM855 391l38-7 6 9-48 11Z" fill="#9e8c68" />
      <path d="M753 365V390M861 367V380M809 358V390" stroke="#dfd0a8" strokeWidth="2" />
      <path d="M725 417q12-20 20-6m78 8q14-20 24-7m32-21q9-13 17-6" fill="none" stroke="#586448" strokeWidth="3" />
    </g>
  );
}

function Castle({ gateGlowRef }) {
  return (
    <g className="journey-castle" stroke="#493d32" strokeWidth="2.2" strokeLinejoin="round">
      <ellipse cx="1013" cy="416" rx="144" ry="17" fill="#594a37" opacity=".17" stroke="none" />
      <path d="M869 414Q902 387 944 400T1015 394Q1070 390 1110 404T1157 420L1149 438Q1091 450 1036 439T926 446L876 432Z" fill="#b3a17b" stroke="#645842" />
      <path d="M888 428l20-13m-8 19 21-16m4 17 18-15m14 16 19-14m-1 16 20-16m16 17 19-16m8 17 18-14m6 14 16-13m-167 5 18-11m210 6 13-9" fill="none" stroke="#78684c" strokeWidth="1" opacity=".65" />
      <path d="M891 410Q947 390 1007 405T1126 404" fill="none" stroke="#7b6b4c" strokeWidth="1.2" strokeDasharray="2 5" />

      {/* Curtain wall and crenellations */}
      <path d="M886 319H1138V408H886Z" fill="#c7b389" />
      <path d="M886 320V304H902V319H919V304H935V319H953V304H969V319H986V304H1002V319H1020V304H1036V319H1054V304H1070V319H1087V304H1103V319H1121V304H1138V320Z" fill="#d3c096" />
      <path d="M897 337H1126M897 354H986M1048 354H1126M897 371H985M1049 371H1126M897 389H986M1048 389H1126" fill="none" stroke="#897756" strokeWidth="1" opacity=".72" />
      <path d="M903 328v9m18-9v9m18-9v9m18-9v9m18-9v9m18-9v9m18-9v9m18-9v9m18-9v9m18-9v9m18-9v9m18-9v9m18-9v9" stroke="#e6d5af" strokeWidth="1" />

      {/* Three uneven towers with pointed roofs */}
      <path d="M874 320V244H930V320ZM944 320V213H994V320ZM1080 320V250H1139V320Z" fill="#c8b58b" />
      <path d="M868 246 902 186 937 246ZM938 216 969 158 1000 216ZM1073 252 1109 193 1146 252Z" fill="#865344" />
      <path d="M868 246H937M938 216H1000M1073 252H1146" fill="none" stroke="#604333" strokeWidth="2.4" />
      <path d="M902 187v-18m67-12v-17m140 54v-17" fill="none" stroke="#554636" strokeWidth="2" />
      <path d="M903 168 927 175 903 183ZM969 140 994 147 969 155ZM1109 174 1133 181 1109 189Z" fill="#9c5943" stroke="#493d32" strokeWidth="1.4" />
      <path className="journey-castle-window" d="M890 270Q902 250 914 270V287H890ZM956 244Q969 221 982 244V267H956ZM1093 276Q1108 252 1123 276V294H1093Z" fill="#efd18a" stroke="#70563b" strokeWidth="1.5" />
      <path d="M902 257V287M969 230V267M1108 261V294" stroke="#8c6743" strokeWidth="1.2" />

      {/* Gatehouse, arched entrance and illuminated inner passage */}
      <path d="M981 408V353Q1017 298 1053 353V408Z" fill="#b7a27a" />
      <path d="M974 354Q1017 290 1060 354" fill="none" stroke="#745d41" strokeWidth="5" />
      <path ref={gateGlowRef} className="journey-castle-gate-glow" d="M991 406V365Q1017 324 1043 365V406Z" fill="#f3d47e" opacity="0" stroke="none" />
      <path d="M994 408V367Q1017 332 1040 367V408Z" fill="#604735" stroke="#45352b" strokeWidth="2.6" />
      <path d="M994 408V367Q1017 332 1040 367V408Z" fill="none" stroke="#d1b77d" strokeWidth="2" />
      <path d="M1017 352V408M999 384H1013M1022 384H1036" fill="none" stroke="#967346" strokeWidth="1.4" />
      <circle cx="1012" cy="383" r="1.7" fill="#d4b46d" stroke="none" />
      <circle cx="1022" cy="383" r="1.7" fill="#d4b46d" stroke="none" />
      <path d="M988 336h-17v-15h17m58 0h18v15h-18" fill="#cdb98e" />
      <path d="M969 321v-13h13v13m61 0v-13h13v13" fill="#d6c397" />

      {/* Masonry joints, arrow slits and weathered ink marks */}
      <path d="M879 291h10m44 10h10m53-75h8m95 25h10m-10 65h10m-209 38h8m176 28h9" fill="none" stroke="#7b694c" strokeWidth="1.1" />
      <path d="M883 278v13m59-56v13m65 18v14m64-4v13m-183 63v12m206-18v12" stroke="#705a40" strokeWidth="1.3" />
      <path d="M878 320Q1017 326 1141 320" fill="none" stroke="#685841" strokeWidth="2.5" />
    </g>
  );
}

function Windmill({ x, y }) {
  return (
    <g className="journey-windmill" transform={`translate(${x} ${y})`} stroke="#493d32" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M-16 3 0-34 16 3 11 17H-11Z" fill="#d8c393" />
      <path d="M-20 3H20M-11 10H11M-7 17H7" fill="none" stroke="#806747" strokeWidth="1" />
      <g transform="translate(0 -34)">
        <g className="journey-windmill-blades">
          <path d="M0 0-3-33 3-34ZM0 0 30-14 33-9ZM0 0 3 31-3 32ZM0 0-30 14-33 9Z" fill="#9d7651" />
          <circle r="3.5" fill="#e6d5ae" />
        </g>
      </g>
    </g>
  );
}

function VillageWell({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#554533" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M-14-2Q0-10 14-2V13H-14Z" fill="#9b896a" />
      <path d="M-18-3 0-12 18-3M-16 2H16M-12 8H12" fill="none" stroke="#6e5b42" />
      <path d="M-15-5V-22M15-5V-22M-17-22H17M0-17V-4" fill="none" stroke="#725338" strokeWidth="2" />
      <path d="M-7-1Q0-5 7-1" fill="none" stroke="#8ca5a0" strokeWidth="2" />
    </g>
  );
}

function BardMini({ refNode }) {
  return (
    <g ref={refNode} className="journey-bard" transform="translate(146 510) rotate(0)">
      <g className="journey-bard-bob" transform="scale(1.28)">
      <ellipse cx="0" cy="5" rx="13" ry="7" fill="#453727" opacity=".23" />
      <path d="M-7 1Q-10-7-6-15L0-18 7-14 8 1Z" fill="#3e6245" stroke="#3f362b" strokeWidth="1.6" />
      <path d="M-5-1 0-5 5-1 4 4H-4Z" fill="#d1b27a" stroke="#51412f" strokeWidth="1.2" />
      <path d="M-5-14Q0-22 6-14L5-10H-5Z" fill="#49694a" stroke="#403a2d" strokeWidth="1.5" />
      <path d="M-3-14Q0-17 4-14L3-11H-3Z" fill="#a96e4e" />
      <path d="M7-11 12-6 7 0 3-5Z" fill="#97613f" stroke="#40372c" strokeWidth="1.4" />
      <path d="M-4 1-5 7M4 1 5 7" stroke="#554235" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M-7-9Q-11-4-8 0" fill="none" stroke="#d9bd7f" strokeWidth="1.3" />
      </g>
    </g>
  );
}

function FantasyMap({ reduced = false, short = false, onEnter, rootRef, skipRef }) {
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  const labelRefs = useRef(new Map());
  const traveledRef = useRef(null);
  const bardRef = useRef(null);
  const cameraRef = useRef(null);
  const sheetRef = useRef(null);
  const parallaxRef = useRef(null);
  const pulseRef = useRef(null);
  const gateGlowRef = useRef(null);
  const wrapRef = useRef(null);
  const rollRef = useRef(null);
  const [activeLandmark, setActiveLandmark] = useState(-1);
  const [waypointPoints, setWaypointPoints] = useState([]);
  const [debugLabelBoxes, setDebugLabelBoxes] = useState([]);
  const debugMap = new URLSearchParams(window.location.search).get("debug") === "map";

  useEffect(() => {
    if (!debugMap || !waypointPoints.length) return undefined;
    const frame = requestAnimationFrame(() => setDebugLabelBoxes(WAYPOINTS.flatMap(({ id }) => {
      const label = labelRefs.current.get(id);
      if (!label) return [];
      const { x, y, width, height } = label.getBBox();
      return [{ id, x: x - 3, y: y - 2, width: width + 6, height: height + 4 }];
    })));
    return () => cancelAnimationFrame(frame);
  }, [debugMap, waypointPoints]);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    const traveled = traveledRef.current;
    const bard = bardRef.current;
    const camera = cameraRef.current;
    const sheet = sheetRef.current;
    const parallax = parallaxRef.current;
    const pulse = pulseRef.current;
    const gateGlow = gateGlowRef.current;
    const stage = wrapRef.current;
    const roll = rollRef.current;
    const root = rootRef.current;
    const skipButton = skipRef.current;
    const page = document.querySelector(".game-page");
    const nav = page?.querySelector(".game-nav");
    const eyebrow = page?.querySelector(".game-eyebrow");
    const nameLines = page?.querySelectorAll(".hero-name-line");
    const copy = page?.querySelector(".game-hero-copy");
    const buttons = page?.querySelectorAll(".hero-enter-button");
    const proofStrip = page?.querySelector(".hero-proof-strip");
    const cardStage = page?.querySelector(".game-avatar-stage");
    const copyLines = copy?.querySelectorAll(".hero-subtitle, .hero-description");
    if (!path || !svg || !bard || !traveled || !camera || !sheet || !stage || !root || !roll || !page) return undefined;
    const length = path.getTotalLength();
    const updateWaypointPoints = () => {
      const points = WAYPOINTS.map(({ id, t }) => {
        const point = path.getPointAtLength(length * t);
        return { id, x: point.x, y: point.y };
      });
      const arrival = points[points.length - 1];
      if (arrival && pulseRef.current) {
        pulseRef.current.setAttribute("cx", arrival.x);
        pulseRef.current.setAttribute("cy", arrival.y);
      }
      setWaypointPoints(points);
    };
    updateWaypointPoints();
    const mapResizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateWaypointPoints);
    mapResizeObserver?.observe(svg);
    if (!mapResizeObserver) window.addEventListener("resize", updateWaypointPoints);
    const progress = { value: 0 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let reachedLandmark = -1;
    let assetsReady = false;
    let atHandoff = false;
    let outroStarted = false;
    let entranceSpeed = 1;
    let skipRequested = false;
    let skipTween = null;
    let stageSettled = false;
    let rollProgress = { value: 0 };
    let rollExit = { value: 0 };
    let rollTargets = [];
    let rollResizeHandler = null;
    const entranceTweens = [];
    const master = makeIntroTimeline();
    const heroVisibilityTargets = [nav, eyebrow, ...(nameLines ?? []), copy, ...(copyLines ?? []), ...(buttons ?? []), proofStrip, cardStage].filter(Boolean);

    root.dataset.phase = "journey";
    document.body.classList.remove("hero-world-active");
    gsap.set(heroVisibilityTargets, { autoAlpha: 0, y: 16 });
    gsap.set(stage, { opacity: 1, clipPath: "inset(0% 0 0% 0 round 0%)" });
    gsap.set(sheet, { x: 0, y: 0, scaleX: 1, scaleY: 1, transformOrigin: "top left" });
    gsap.set(roll, { autoAlpha: 0 });
    gsap.set(parallax, { x: 0, y: 0 });
    gsap.set(traveled, { strokeDasharray: length, strokeDashoffset: length });

    const updateBard = () => {
      const point = path.getPointAtLength(length * progress.value);
      const before = path.getPointAtLength(Math.max(0, length * progress.value - 2));
      const after = path.getPointAtLength(Math.min(length, length * progress.value + 2));
      const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI + 90;
      bard.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
      const narrow = window.innerWidth / window.innerHeight < 1.35;
      const follow = narrow ? 1 : Math.max(0, Math.min(1, (progress.value - 0.13) / 0.72));
      const zoom = narrow ? 1.08 : 1 + follow * 0.13;
      const visibleWidth = narrow ? Math.max(250, 760 * window.innerWidth / window.innerHeight) : 1200;
      const targetX = narrow ? (1200 - visibleWidth) / 2 + visibleWidth * 0.4 : 600;
      const targetY = narrow ? 500 : 380;
      const tx = narrow
        ? targetX - (600 + (point.x - 600) * zoom)
        : -follow * Math.max(0, point.x - 465) * 0.2;
      const ty = narrow
        ? targetY - (380 + (point.y - 380) * zoom)
        : -follow * Math.max(0, point.y - 360) * 0.13;
      camera.setAttribute("transform", `translate(${tx} ${ty}) translate(600 380) scale(${zoom}) translate(-600 -380)`);
      traveled.setAttribute("stroke-dashoffset", String(length * (1 - progress.value)));
      const landmark = WAYPOINTS.reduce((active, waypoint, index) => progress.value >= waypoint.t ? index : active, -1);
      if (landmark !== reachedLandmark) {
        reachedLandmark = landmark;
        setActiveLandmark(landmark);
      }
    };
    const finish = () => {
      if (stageSettled) return;
      stageSettled = true;
      root.querySelector(".journey-sr-only")?.replaceChildren("Portfolio ready.");
      entranceTweens.forEach((tween) => tween.kill());
      gsap.set(heroVisibilityTargets, { autoAlpha: 1, y: 0, clearProps: "clipPath" });
      root.dataset.phase = "complete";
      document.body.classList.add("hero-world-active");
      onEnter();
    };
    const startOutro = (compressed = false) => {
      if (outroStarted || !assetsReady) return;
      outroStarted = true;
      root.dataset.phase = "outro";
      root.querySelector(".journey-sr-only")?.replaceChildren("The map is rolling away; entering the portfolio.");
      document.body.classList.add("hero-world-active");
      window.dispatchEvent(new Event("portfolio-world-enter"));
      rollTargets = [
        { element: nav, enter: () => gsap.fromTo(nav, { autoAlpha: 0, y: -28 }, { autoAlpha: 1, y: 0, duration: .38, ease: "power2.out", overwrite: true }) },
        { element: eyebrow, enter: () => gsap.fromTo(eyebrow, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .32, ease: "power2.out", overwrite: true }) },
        ...(nameLines ? [...nameLines].map((line, index) => ({ element: line, enter: () => gsap.fromTo(line, { autoAlpha: 0, y: 22, clipPath: "inset(0 0 100% 0)" }, { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: .38, delay: index * .09, ease: "power3.out", overwrite: true }) })) : []),
        { element: copy, enter: () => gsap.fromTo(copy, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .34, ease: "power2.out", overwrite: true }) },
        ...(copyLines ? [...copyLines].map((line, index) => ({ element: line, enter: () => gsap.fromTo(line, { autoAlpha: 0, y: 9 }, { autoAlpha: 1, y: 0, duration: .26, delay: index * .07, ease: "power2.out", overwrite: true }) })) : []),
        ...(buttons ? [...buttons].map((button, index) => ({ element: button, enter: () => gsap.fromTo(button, { autoAlpha: 0, scale: .88, y: 10 }, { autoAlpha: 1, scale: 1, y: 0, duration: .28, delay: index * .07, ease: "back.out(1.8)", overwrite: true }) })) : []),
        { element: proofStrip, enter: () => gsap.fromTo(proofStrip, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .3, ease: "power2.out", overwrite: true }) },
        { element: cardStage, enter: () => gsap.fromTo(cardStage, { autoAlpha: 0, y: 22, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .46, ease: "back.out(1.4)", overwrite: true, onComplete: () => cardStage?.classList.add("hero-card-idle") }) },
      ].filter((target) => target.element).map((target) => ({ ...target, y: 0, entered: false }));
      const measureRollTargets = () => {
        rollTargets.forEach((target) => { target.y = Math.max(0, Math.min(window.innerHeight, target.element.getBoundingClientRect().top + target.element.getBoundingClientRect().height / 2)); });
      };
      const updateRoll = () => {
        const p = rollProgress.value;
        const edgeY = window.innerHeight * (1 - p);
        const mobile = window.innerWidth <= 700;
        const diameter = mobile ? INTRO_CONFIG.rollMaxDiameterMobile : INTRO_CONFIG.rollMaxDiameter;
        const size = INTRO_CONFIG.rollMinDiameter + (diameter - INTRO_CONFIG.rollMinDiameter) * p;
        const exitY = rollExit.value * (diameter + 12);
        stage.style.clipPath = `inset(0px 0px ${p * 100}% 0px)`;
        roll.style.setProperty("--roll-y", `${edgeY - size / 2 - exitY}px`);
        roll.style.setProperty("--roll-scale-y", String(size / diameter));
        roll.style.setProperty("--roll-scale-x", String(1 + Math.sin(p * Math.PI * 5) * .004));
        roll.style.setProperty("--roll-tilt", `${Math.sin(p * Math.PI * 7) * .35}deg`);
        roll.style.opacity = String(1 - rollExit.value);
        roll.style.setProperty("--roll-hero-shadow", `${Math.max(0, 1 - rollExit.value) * 0.28}`);
        rollTargets.forEach((target) => {
          if (!target.entered && edgeY <= target.y) {
            target.entered = true;
            const tween = target.enter();
            tween.timeScale(entranceSpeed);
            entranceTweens.push(tween);
          }
        });
      };
      measureRollTargets();
      rollResizeHandler = measureRollTargets;
      window.addEventListener("resize", rollResizeHandler);
      gsap.set(roll, { autoAlpha: 1 });
      master.to(rollProgress, { value: 1, duration: INTRO_CONFIG.rollDuration, ease: INTRO_CONFIG.rollEase, onUpdate: updateRoll }, master.labels.handoff);
      master.to(rollExit, { value: 1, duration: INTRO_CONFIG.rollExitDuration, ease: INTRO_CONFIG.rollExitEase, onUpdate: updateRoll }, master.labels.handoff + INTRO_CONFIG.rollDuration);
      master.call(finish, null, master.labels.handoff + INTRO_CONFIG.rollDuration + INTRO_CONFIG.rollExitDuration);
      entranceSpeed = compressed ? (INTRO_CONFIG.rollDuration + INTRO_CONFIG.rollExitDuration) / INTRO_CONFIG.shortOutro : 1;
      master.timeScale(entranceSpeed);
      master.play();
    };
    const arriveAtHandoff = () => {
      atHandoff = true;
      master.pause();
      if (assetsReady) window.setTimeout(() => startOutro(skipRequested || short), 0);
    };
    const onSkip = () => {
      if (stageSettled) return;
      skipRequested = true;
      if (reducedMotion) {
        if (assetsReady) master.timeScale(1).play();
        return;
      }
      if (outroStarted) {
        const remaining = Math.max(.01, master.duration() - master.time());
        const speed = remaining / INTRO_CONFIG.shortOutro;
        entranceSpeed = speed;
        master.timeScale(speed);
        entranceTweens.forEach((tween) => tween.timeScale(speed));
        return;
      }
      if (atHandoff) {
        if (assetsReady) startOutro(true);
        return;
      }
      master.removePause("handoff");
      skipTween?.kill();
      skipTween = master.tweenTo("handoff", {
        duration: INTRO_CONFIG.skipToCastle,
        ease: "power2.inOut",
        onComplete: arriveAtHandoff,
      });
    };
    const onPointerMove = (event) => {
      if (reducedMotion || event.pointerType !== "mouse" || outroStarted) return;
      const bounds = root.getBoundingClientRect();
      gsap.to(parallax, {
        x: ((event.clientX - bounds.left) / bounds.width - 0.5) * -5,
        y: ((event.clientY - bounds.top) / bounds.height - 0.5) * -4,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    const onPointerLeave = () => gsap.to(parallax, { x: 0, y: 0, duration: 0.7, ease: "power2.out" });
    const onVisibilityChange = () => {
      root.dataset.paused = document.visibilityState === "visible" ? "false" : "true";
    };

    skipButton?.addEventListener("click", onSkip);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    onVisibilityChange();
    skipButton?.focus({ preventScroll: true });

    if (reducedMotion || reduced) {
      progress.value = 0.72;
      updateBard();
      gsap.set(traveled, { strokeDashoffset: 0 });
      master.fromTo(root, { opacity: 1 }, { opacity: 0, duration: INTRO_CONFIG.reducedCrossfade, ease: "power1.inOut" });
      master.call(finish);
      master.addLabel("handoff", 0);
      master.addPause("handoff", arriveAtHandoff);
    } else {
      master.fromTo(stage, { clipPath: "inset(50% 0 50% 0 round 48%)", opacity: 0.72 }, { clipPath: "inset(0% 0 0% 0 round 0%)", opacity: 1, duration: short ? 0.12 : INTRO_CONFIG.reveal, ease: "power2.out" });
      master.fromTo(".journey-heading", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: short ? 0.1 : 0.28 }, "-=0.12");
      if (short) {
        progress.value = 1;
        updateBard();
        gsap.set(traveled, { strokeDashoffset: 0 });
      } else {
        master.to(progress, { value: 1, duration: INTRO_CONFIG.journey, ease: INTRO_CONFIG.travelEase, onUpdate: updateBard });
      }
      master.addLabel("handoff");
      master.addPause("handoff", arriveAtHandoff);
    }

    const handoffTime = master.labels.handoff;
    if (!reducedMotion && !reduced) {
      master.fromTo(pulse, { attr: { r: 9 }, opacity: .95 }, { attr: { r: 30 }, opacity: 0, duration: .78, ease: "power2.out", repeat: 1 }, handoffTime);
      master.fromTo(gateGlow, { opacity: 0 }, { opacity: .76, duration: .4, ease: "sine.inOut", repeat: 2, yoyo: true }, handoffTime);
      master.to(".journey-castle-window", { attr: { fill: "#fff0a8" }, duration: .45, ease: "sine.inOut" }, handoffTime);
    } else {
      master.addLabel("outro", handoffTime);
    }

    const startAtHandoff = () => {
      if (!assetsReady || stageSettled || !atHandoff) return;
      if (reducedMotion || reduced) {
        master.play();
        return;
      }
      startOutro(skipRequested || short);
    };
    waitForHeroAssets(page).then(() => {
      assetsReady = true;
      startAtHandoff();
    });
    master.play(0);

    return () => {
      skipTween?.kill();
      if (rollResizeHandler) window.removeEventListener("resize", rollResizeHandler);
      master.kill();
      entranceTweens.forEach((tween) => tween.kill());
      gsap.killTweensOf([progress, parallax, sheet, stage, root, roll, rollProgress, rollExit]);
      skipButton?.removeEventListener("click", onSkip);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      mapResizeObserver?.disconnect();
      if (!mapResizeObserver) window.removeEventListener("resize", updateWaypointPoints);
      document.body.classList.remove("journey-lock-scroll");
    };
  }, [reduced, short, onEnter, rootRef, skipRef]);

  return (
    <>
    <div className="journey-map-stage" ref={wrapRef}>
      <div className="journey-map-sheet" ref={sheetRef}>
      <div className="journey-parallax-layer" ref={parallaxRef}>
      <svg ref={svgRef} className="journey-map-art" viewBox="0 0 1200 760" role="img" aria-label="A fantasy map showing Lintang's journey from a village through misty peaks and ruins to Emberfall Keep">
        <defs>
          <pattern id="journey-paper-grain" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M4 23q17-5 30 1M67 94q13-3 22 0M31 112l10-2M96 30q8 2 15-1" fill="none" stroke="#6c4d31" strokeWidth=".55" opacity=".18" />
            <circle cx="19" cy="69" r=".8" fill="#775b39" opacity=".22" /><circle cx="82" cy="17" r=".6" fill="#775b39" opacity=".2" />
          </pattern>
          <pattern id="journey-hatch" width="8" height="8" patternTransform="rotate(35)" patternUnits="userSpaceOnUse"><path d="M0 0V8" stroke="#6f583d" strokeWidth=".8" opacity=".25" /></pattern>
          <filter id="journey-paper-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="13" floodColor="#090d17" floodOpacity=".34" /></filter>
          <clipPath id="journey-map-clip"><rect x="22" y="20" width="1156" height="720" rx="5" /></clipPath>
        </defs>
        <rect x="24" y="22" width="1152" height="716" rx="4" fill="#d7bd88" filter="url(#journey-paper-shadow)" />
        <g clipPath="url(#journey-map-clip)">
          <rect x="27" y="25" width="1146" height="710" fill="#e6d5aa" />
          <path d="M25 25H1175V735H25Z" fill="url(#journey-paper-grain)" />
          <g className="journey-graticule" fill="none" stroke="#8d7551" strokeWidth=".65">
            <path d="M150 26V734M300 26V734M450 26V734M600 26V734M750 26V734M900 26V734M1050 26V734M27 150H1173M27 300H1173M27 450H1173M27 600H1173" />
          </g>
          <path className="journey-paper-fold journey-paper-fold-v" d="M603 27Q600 190 604 372T600 734" />
          <path className="journey-paper-fold journey-paper-fold-h" d="M28 380Q290 377 600 381T1172 378" />
          <g className="journey-age-stains" fill="#9b7650">
            <ellipse cx="136" cy="120" rx="47" ry="29" /><ellipse cx="1080" cy="665" rx="53" ry="36" />
            <ellipse cx="340" cy="650" rx="28" ry="18" /><ellipse cx="906" cy="90" rx="32" ry="19" />
          </g>
          <g className="journey-fog journey-fog-east" transform="translate(0 0)">
            <ellipse cx="690" cy="285" rx="82" ry="13" /><ellipse cx="730" cy="294" rx="46" ry="8" />
          </g>
          <g className="journey-fog journey-fog-west" transform="translate(0 0)">
            <ellipse cx="836" cy="382" rx="62" ry="11" /><ellipse cx="805" cy="390" rx="34" ry="7" />
          </g>
          <g ref={cameraRef}>
            {/* Lower-right lake and inked coast */}
            <path d="M822 566Q869 534 913 550T1001 548Q1053 531 1101 551T1174 546V735H823Q849 700 830 670T822 566Z" fill="#96aaa1" stroke="#6f8580" strokeWidth="2" />
            <path d="M822 566Q869 534 913 550T1001 548Q1053 531 1101 551T1174 546" fill="none" stroke="#655a43" strokeWidth="2.3" />
            <path d="M842 575q33-14 62-2m39-12q29-13 55 1m58 14q34-12 62-2m-237 32q30-12 58 0m67-6q26-12 53 0m-84 58q39-13 69 0m35 28q33-13 61 0" fill="none" stroke="#d9dfca" strokeWidth="1.5" opacity=".62" />
            <path d="M854 591q30-9 58 0m120-8q27-8 48 1m-200 37q25-8 44 1m97 31q30-9 53 1m-12 34q31-10 52 2" className="journey-water-shimmer" fill="none" stroke="#e3e2c9" strokeWidth="2" />
            <g transform="translate(1064 630) rotate(-8)" className="journey-ship" stroke="#51483b" strokeWidth="1.6" strokeLinejoin="round">
              <path d="M-29 10H31L20 23H-18Z" fill="#76533a" />
              <path d="M0 8V-25M-2-20-24 4H-2ZM3-14 23 5H3Z" fill="#e4d5b3" />
              <path d="M-33 28q17-6 32 0t32 0" fill="none" stroke="#dce0cd" strokeWidth="1.2" />
            </g>
            <g transform="translate(935 590)" className="journey-sea-creature" fill="#607d70" stroke="#455e54" strokeWidth="1.6">
              <path d="M-20 13Q-8-4 0-23Q9-4 20 13Q3 7-20 13Z" />
              <path d="M-2 8Q-12 1-15 10M4 8Q14 0 17 9" fill="none" />
            </g>

            {/* Main river sits below the title and crosses the route at an old bridge */}
            <path d="M650 333Q695 341 730 370T786 427Q805 467 840 502T891 553" fill="none" stroke="#718f8b" strokeWidth="18" opacity=".32" />
            <path d="M650 333Q695 341 730 370T786 427Q805 467 840 502T891 553" fill="none" stroke="#91aaa0" strokeWidth="12" opacity=".63" />
            <path d="M650 331Q695 339 730 368T786 425Q805 465 840 500T891 551" fill="none" stroke="#d4dfcc" strokeWidth="1.8" opacity=".72" />
            <path d="M670 340q16 3 26 10m38 26q15 8 22 17m36 34q10 15 13 28m20 36q14 16 26 22m19 19q16 11 26 14" fill="none" stroke="#e1e0c9" strokeWidth="1.3" opacity=".8" />
            {/* Mountain pass: layered ridges, ink hatching, and connected foothills */}
            <path d="M282 340Q324 312 362 331T425 324L447 350Q404 363 363 351T292 358Z" fill="#b7b186" stroke="#777353" strokeWidth="1.2" opacity=".58" />
            <path d="M294 345Q329 325 365 340T424 333M305 352Q339 337 371 349T430 343" fill="none" stroke="#817953" strokeWidth="1" opacity=".56" />
            <Tree x={361} y={331} size={.46} pale /><Tree x={402} y={336} size={.42} />
            <Mountain x={526} y={259} scale={1.02} back />
            <Mountain x={628} y={267} scale={1.23} />
            <Mountain x={714} y={278} scale={.76} back />
            <path d="M426 369Q466 345 507 359T584 350Q627 340 668 359T748 351Q791 361 828 388L841 415Q794 430 746 414T652 421Q601 407 552 420T451 411Z" fill="#aaa083" stroke="#6d624d" strokeWidth="1.5" />
            <path d="M429 377Q472 354 509 369T584 361Q628 350 668 369T748 361Q791 371 830 394L834 406Q790 418 749 405T652 411Q602 399 553 412T454 403Z" fill="url(#journey-hatch)" opacity=".62" />
            <path d="M438 380Q483 358 530 372T615 365Q662 357 701 375T782 371M453 397Q496 380 535 392T620 387Q660 376 707 393T817 394M481 409Q525 398 564 408T641 404Q694 393 733 408" fill="none" stroke="#776b53" strokeWidth="1.15" opacity=".76" />
            <path d="M472 366l11 13m-1-15 13 14m88-20 12 13m-1-16 13 15m53-11 12 14m-1-16 13 15m51-7 12 14m-1-16 13 14" fill="none" stroke="#665941" strokeWidth="1" opacity=".64" />
            <path d="M461 421q-7-18-12-4m35 3q-7-20-12-7m282-8q10-21 14-8m25 13q9-18 14-6" fill="none" stroke="#49563e" strokeWidth="3" />

            {/* Village */}
            <path d="M72 501Q119 488 159 500T246 492L270 524Q225 537 184 527T93 532Z" fill="#b7b47f" opacity=".24" />
            <Cottage x={112} y={459} scale={.78} roofStyle="steep" chimney />
            <Cottage x={174} y={445} scale={.9} roof="#9a6746" roofStyle="hip" chimney />
            <Cottage x={139} y={394} scale={.68} roof="#7d5141" roofStyle="steep" />
            <g transform="translate(192 417)" className="journey-smoke-stack" fill="#857d68">
              <circle className="journey-smoke-puff smoke-one" cx="0" cy="0" r="4" />
              <circle className="journey-smoke-puff smoke-two" cx="2" cy="-7" r="3.5" />
              <circle className="journey-smoke-puff smoke-three" cx="-1" cy="-13" r="3" />
            </g>
            <path d="M81 476q62-23 110-4t111-6" fill="none" stroke="#7b6244" strokeWidth="2.4" strokeDasharray="2 5" />
            <path d="M101 438h23m63-22h18m-41 105h25" stroke="#eee0ba" strokeWidth="1.7" />
            <path d="M231 471v-22m-5 5h10" stroke="#624b35" strokeWidth="2" />
            <path d="M226 448q9-5 18 0v11q-9 5-18 0Z" fill="#c9a869" stroke="#5a4934" strokeWidth="1.5" />
            <Tree x={78} y={433} size={.65} pale /><Tree x={257} y={427} size={.82} /><Tree x={86} y={546} size={.7} />
            <path d="M159 484h5m11-6h4m30-43h4" stroke="#b38e57" strokeWidth="2" />
            <Windmill x={316} y={572} />
            <VillageWell x={282} y={516} />
            <g className="journey-market-stall" transform="translate(246 502)" stroke="#554633" strokeWidth="1.5" strokeLinejoin="round">
              <path d="M-20-5H20V15H-20ZM-25-5 0-20 25-5Z" fill="#d7c18e" />
              <path d="M-25-5Q-14 2-6-5Q3 2 12-5Q19 1 25-5" fill="#9d5943" />
              <path d="M-12 2V15M0 2V15M12 2V15" fill="none" stroke="#75563b" />
            </g>
            <g className="journey-village-lanterns" fill="#e8c976" stroke="#775438" strokeWidth="1.2">
              <path d="M164 466h8v14h-8zM239 454h7v12h-7z" />
              <path d="M166 462h4v4h-4zM241 450h3v4h-3z" fill="#f3d989" />
            </g>
            <path d="M92 557q40-18 82-2t79-4M102 565q41-17 78-2t61-4M131 539v25m25-31v32m25-29v28m23-27v28" fill="none" stroke="#8d7149" strokeWidth="1.2" opacity=".7" />
            <path d="M737 428 780 421 804 428 792 441 750 449Z" fill="#9b7b53" stroke="#574733" strokeWidth="1.8" />
            <path d="M744 430 783 424 797 430M751 438 791 431M760 443 787 438" fill="none" stroke="#d2ba88" strokeWidth="1.5" />

            {/* Enchanted wood: deliberate clusters with a small clearing */}
            <path d="M309 478q27-38 66-19t66-15q39-38 79-6t-1 75q-44 26-92 7t-91 12q-49-4-27-54Z" fill="#b1ad7b" opacity=".29" />
            <Tree x={334} y={410} size={1.04} /><Tree x={386} y={389} size={1.2} pale /><Tree x={438} y={402} size={1.03} />
            <Tree x={315} y={465} size={.86} pale /><Tree x={468} y={466} size={1.1} /><Tree x={365} y={490} size={.92} />
            <Tree x={428} y={497} size={.78} pale /><Tree x={487} y={449} size={.83} />
            <path d="M327 445q25-10 38 1m91 9q15-10 28 0m-95 48q12-8 21 0" fill="none" stroke="#8f7147" strokeWidth="1.4" />
            <path d="M354 477q3-9 7 0m4 2q3-7 6 0m67-48q3-8 6 0" fill="none" stroke="#9b5940" strokeWidth="2" />
            <path d="M290 544q31-24 64-14t64-6q34-12 64 8" fill="none" stroke="#856c48" strokeWidth="1.5" strokeDasharray="2 7" opacity=".7" />
            <path d="M502 578Q535 551 576 567T649 562Q682 569 705 590L696 608Q655 599 613 610T526 602Z" fill="#b5b080" stroke="#7f7552" strokeWidth="1.2" opacity=".42" />
            <path d="M519 582Q553 565 583 579T649 574Q675 580 693 592M532 596Q570 582 604 596T662 591" fill="none" stroke="#827653" strokeWidth="1" opacity=".68" />
            <g className="journey-extra-forest"><Tree x={550} y={514} size={.68} /><Tree x={578} y={521} size={.52} pale /><Tree x={522} y={526} size={.48} /></g>
            <g className="journey-signpost" transform="translate(481 548)" stroke="#55422f" strokeWidth="1.6" strokeLinejoin="round">
              <path d="M0 2v30m-2-21h19l-3 7H-2Z" fill="#c5a875" /><path d="M1-3v-4m-4 4h8" fill="none" />
            </g>
            <text x="394" y="594" className="journey-dragon-note">Here be dragons</text>

            {/* Ruins */}
            <path d="M718 435q24-42 62-15t61-10q38-27 71 9l-13 41q-49 13-97 3t-87 8Z" fill="#64714b" opacity=".18" />
            <Ruins />
            <Tree x={738} y={440} size={.72} /><Tree x={890} y={423} size={.8} pale />
            <path d="M733 411q17-16 28-1m102 20q14-17 24-4" fill="none" stroke="#536044" strokeWidth="2.5" />

            {/* Keep and approach */}
            <Castle gateGlowRef={gateGlowRef} />
            <path d="M1017 399Q994 426 966 434T926 451" fill="none" stroke="#806344" strokeWidth="12" opacity=".18" />
            <path d="M1017 399Q994 426 966 434T926 451" fill="none" stroke="#876c48" strokeWidth="2.5" strokeDasharray="3 5" />
            <Tree x={858} y={433} size={.68} /><Tree x={1151} y={356} size={.62} pale />

            <g className="journey-place-names" aria-hidden="true">
              <text x="175" y="350">The Wayfarer's Village</text>
              <text x="615" y="228">Misty Peaks</text>
              <text x="803" y="321">Forgotten Ruins</text>
              <text x="1050" y="489">Emberfall Keep</text>
            </g>

            {/* Hand-inked route, drawn over the geography */}
            <path ref={pathRef} d={ROUTE} fill="none" stroke="#efe2bd" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity=".88" />
            <path d={ROUTE} fill="none" stroke="#8b4e39" strokeWidth="2.3" strokeDasharray="1 9" strokeLinecap="round" opacity=".68" />
            <path ref={traveledRef} d={ROUTE} fill="none" stroke="#8b4e39" strokeWidth="3.6" strokeLinecap="round" strokeDasharray="1 1" opacity=".92" />
            <g className="journey-waypoints" aria-hidden="true">
              <circle ref={pulseRef} className="journey-arrival-pulse" r="9" fill="none" stroke="#a14e36" strokeWidth="2.5" opacity="0" />
              {WAYPOINTS.map((waypoint, index) => {
                const point = waypointPoints.find(({ id }) => id === waypoint.id);
                return point && <g key={waypoint.id} className={activeLandmark >= index ? "is-reached" : ""} transform={`translate(${point.x} ${point.y})`}>
                  <circle r="9" fill="#eadbb7" stroke="#784b37" strokeWidth="1.8" />
                  <circle r="3" fill="#a45e43" />
                </g>;
              })}
            </g>
            <g className="journey-landmark-labels" aria-hidden="true">
              {WAYPOINTS.map((waypoint, index) => {
                const point = waypointPoints.find(({ id }) => id === waypoint.id);
                if (!point) return null;
                const labelX = waypoint.dx;
                const labelY = waypoint.dy;
                const paperX = waypoint.anchor === "end" ? -waypoint.width : waypoint.anchor === "middle" ? -waypoint.width / 2 : 0;
                return <g key={waypoint.id} ref={(node) => node ? labelRefs.current.set(waypoint.id, node) : labelRefs.current.delete(waypoint.id)} className={activeLandmark >= index ? "is-visible" : ""} transform={`translate(${point.x + labelX} ${point.y + labelY})`}>
                  <rect className="journey-waypoint-label-paper" x={paperX} y="-13" width={waypoint.width} height="18" rx="2" />
                  <text textAnchor={waypoint.anchor} y="0">{waypoint.section}</text>
                </g>;
              })}
            </g>
            {debugMap && <g className="journey-map-debug" aria-hidden="true">
              {waypointPoints.map(({ id, x, y }) => <g key={`point-${id}`}><circle cx={x} cy={y} r="12" /><circle cx={x} cy={y} r="2.5" /><text x={x + 14} y={y - 12}>{id}</text></g>)}
              {debugLabelBoxes.map(({ id, x, y, width, height }) => {
                const point = waypointPoints.find((entry) => entry.id === id);
                const waypoint = WAYPOINTS.find((entry) => entry.id === id);
                return <rect key={`label-${id}`} x={point.x + waypoint.dx + x} y={point.y + waypoint.dy + y} width={width} height={height} />;
              })}
            </g>}
            <BardMini refNode={bardRef} />
          </g>

          {/* Cartographic marginalia */}
          <g className="journey-compass" transform="translate(1110 480)" stroke="#725638">
            <circle r="43" fill="none" strokeWidth="1.2" /><circle r="34" fill="none" strokeWidth=".8" />
            <path d="M0-38 7-5 0 0-7-5ZM0 38-7 5 0 0 7 5ZM-38 0-5-7 0 0-5 7ZM38 0 5 7 0 0 5-7Z" fill="#9b7145" strokeWidth="1" />
            <circle r="4" fill="#ead9b4" strokeWidth="1.5" /><text x="-4" y="-51">N</text>
          </g>
          <g className="journey-map-key" transform="translate(54 583)" fill="#59452f" stroke="#80623e" strokeWidth="1">
            <path d="M0 0H202V104H0Z" fill="#eadbb7" opacity=".9" />
            <path d="M6 6H196V98H6Z" fill="none" stroke="#9a7b4e" strokeWidth=".8" />
            <text x="13" y="20" stroke="none">MAP KEY</text>
            <path d="M14 37h18" stroke="#718f8b" strokeWidth="4" /><text x="38" y="40" stroke="none">River</text>
            <path d="M111 37 118 27 125 37Z" fill="#8e8067" /><text x="130" y="40" stroke="none">Peaks</text>
            <path d="M14 58V47l8-6 8 6v11zM12 47l10-8 10 8" fill="#d1b37d" /><text x="38" y="56" stroke="none">Village</text>
            <path d="M111 58V47h15v11m-18-11 10-8 11 8m-12 0v11" fill="#b9a47d" /><text x="130" y="56" stroke="none">Castle</text>
            <circle cx="21" cy="78" r="6" fill="#eadbb7" /><circle cx="21" cy="78" r="2" fill="#a45e43" /><text x="38" y="82" stroke="none">Waypoint</text>
            <path d="M111 78h16" stroke="#8b4e39" strokeWidth="2" strokeDasharray="2 4" /><text x="130" y="82" stroke="none">Old road</text>
          </g>
          <g className="journey-scale" transform="translate(482 645)" fill="#614a31" stroke="#73583a">
            <path d="M0 0H138" strokeWidth="2" /><path d="M0-5V5M69-5V5M138-5V5" strokeWidth="1.5" />
            <text x="-3" y="17" stroke="none">0</text><text x="63" y="17" stroke="none">3</text><text x="132" y="17" stroke="none">6 leagues</text>
          </g>
          <g className="journey-map-border" fill="none" stroke="#80623e">
            <rect x="38" y="37" width="1124" height="686" strokeWidth="2" />
            <rect x="45" y="44" width="1110" height="672" strokeWidth=".75" />
            <path d="M38 91h17M38 91v-17M1162 91h-17M1162 91V74M38 669h17M38 669v17M1162 669h-17M1162 669v17" strokeWidth="2.2" />
          </g>
          <path d="M102 91h14v14h-14zM1090 654h14v14h-14zM500 688h11v11h-11z" fill="#a78a5d" opacity=".65" />
        </g>
      </svg>
      </div>
      </div>
      <div className="journey-heading" aria-live="off">
        <p className="journey-kicker">A PERSONAL ADVENTURE · CHAPTER I</p>
        <h1>Lintang’s Journey</h1>
        <p className="journey-subtitle">An adventure begins with a single step.</p>
        <span className="journey-rule" aria-hidden="true"><i /></span>
      </div>
      <p key={activeLandmark} className="journey-current-location" aria-live="polite" aria-atomic="true">{WAYPOINTS[activeLandmark]?.label}</p>
      <div className="journey-arrival" aria-hidden="true">THE KEEP AWAITS</div>
    </div>
    <div className="journey-scroll-roll" ref={rollRef} aria-hidden="true" />
    </>
  );
}

export default function JourneyIntro({ onEnter, short = false }) {
  const rootRef = useRef(null);
  const skipRef = useRef(null);
  const [isReduced, setIsReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.body.classList.add("journey-lock-scroll");
    const restore = () => document.body.classList.remove("journey-lock-scroll");
    const handleChange = (event) => setIsReduced(event.matches);
    query.addEventListener?.("change", handleChange);
    return () => { restore(); query.removeEventListener?.("change", handleChange); };
  }, []);

  return (
    <section ref={rootRef} className={`journey-intro ${isReduced ? "journey-static" : ""}`} aria-label="Lintang's Journey introduction">
      <FantasyMap reduced={isReduced} short={short} onEnter={onEnter} rootRef={rootRef} skipRef={skipRef} />
      <button ref={skipRef} type="button" className="journey-skip">{isReduced ? "Enter the portfolio" : "Skip intro"}<span className="journey-skip-arrow" aria-hidden="true"> ↗</span></button>
      <p className="journey-sr-only" aria-live="polite">{isReduced ? "Static fantasy map. Enter the portfolio when ready." : "The Bard is traveling across the map toward Emberfall Keep."}</p>
    </section>
  );
}
