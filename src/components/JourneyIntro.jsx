import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { INTRO_CONFIG, makeIntroTimeline, waitForHeroAssets } from "./journey/introController";
import "./journey-intro.css";

const ROUTE = "M 146 510 C 190 475 224 458 264 464 C 306 469 319 420 366 409 C 415 397 436 439 474 416 C 513 393 510 335 555 315 C 596 297 621 342 655 354 C 696 369 724 407 767 414 C 814 422 842 380 878 348 C 916 314 935 264 978 246 C 1000 236 1022 239 1048 226";
const WAYPOINTS = [
  { at: 0.04, label: "The Wayfarer's Village", section: "About", x: 146, y: 549 },
  { at: 0.27, label: "Whispering Wood", section: "Skills", x: 366, y: 456 },
  { at: 0.49, label: "The Old King's Pass", section: "Projects", x: 555, y: 385 },
  { at: 0.75, label: "The Forgotten Ruins", section: "Contact", x: 767, y: 458 },
  { at: 0.98, label: "Emberfall Keep", section: "Portfolio", x: 1049, y: 344 },
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

function Cottage({ x, y, scale = 1, roof = "#854d3c" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#473a2c" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M-26 1 0-19 27 1V25H-26Z" fill="#ddc58e" />
      <path d="M-31 2 0-23 31 2 26 5 0-15-26 6Z" fill={roof} />
      <path d="M-5 8H5V25H-5Z" fill="#70513b" />
      <path d="M-20 7H-12V14H-20ZM12 7H20V14H12Z" fill="#f0cd79" />
      <path d="M-19 8V14M-13 8V14M13 8V14M19 8V14" stroke="#70513b" strokeWidth="1" />
      <path d="M18-13V-25H23V-9" fill="#94704a" />
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

function Castle() {
  return (
    <g className="journey-castle" stroke="#493d32" strokeWidth="2.2" strokeLinejoin="round">
      <path d="M954 241 968 210 983 241V294H954ZM1024 225 1040 188 1057 225V294H1024ZM977 251 1005 223 1030 251V303H977Z" fill="#c7b389" />
      <path d="M948 242 968 202 988 242H982L968 218 957 242ZM1018 226 1040 179 1063 226H1056L1040 195 1027 226Z" fill="#8a5441" />
      <path d="M968 210V197H976V221M1037 190V177H1045V204" fill="#d8c59d" />
      <path d="M954 267H1057V309H954Z" fill="#b7a27a" />
      <path d="M945 284 1004 269 1067 284V300H945Z" fill="#d0bd92" />
      <path d="M989 304Q1004 276 1019 304V309H989Z" fill="#684a37" />
      <path className="journey-castle-window" d="M962 257H969V267H962ZM1039 241H1047V253H1039ZM988 264H995V274H988ZM1020 264H1027V274H1020Z" fill="#f0d38a" stroke="#74573a" />
      <path d="M961 308H1051M948 294H1064" fill="none" stroke="#75644c" strokeWidth="1.4" />
      <path d="M1004 269V256" stroke="#873f35" />
      <circle cx="1004" cy="253" r="4" fill="#b44f3d" />
      <path d="M936 316Q1003 325 1075 315" fill="none" stroke="#6d694b" strokeWidth="5" />
      <path d="M948 318q-8-15-13-9m127 8q9-15 14-8" fill="none" stroke="#526246" strokeWidth="3" />
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
  const traveledRef = useRef(null);
  const bardRef = useRef(null);
  const cameraRef = useRef(null);
  const sheetRef = useRef(null);
  const parallaxRef = useRef(null);
  const pulseRef = useRef(null);
  const wrapRef = useRef(null);
  const rollRef = useRef(null);
  const [activeLandmark, setActiveLandmark] = useState(0);

  useEffect(() => {
    const path = pathRef.current;
    const traveled = traveledRef.current;
    const bard = bardRef.current;
    const camera = cameraRef.current;
    const sheet = sheetRef.current;
    const parallax = parallaxRef.current;
    const pulse = pulseRef.current;
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
    const cardStage = page?.querySelector(".game-avatar-stage");
    const copyLines = copy?.querySelectorAll(".hero-subtitle, .hero-description");
    if (!path || !bard || !traveled || !camera || !sheet || !stage || !root || !roll || !page) return undefined;
    const length = path.getTotalLength();
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
    const heroVisibilityTargets = [nav, eyebrow, ...(nameLines ?? []), copy, ...(copyLines ?? []), ...(buttons ?? []), cardStage].filter(Boolean);

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
      const landmark = WAYPOINTS.reduce((active, waypoint, index) => progress.value >= waypoint.at ? index : active, 0);
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

    skipButton?.addEventListener("click", onSkip);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
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
      document.body.classList.remove("journey-lock-scroll");
    };
  }, [reduced, short, onEnter, rootRef, skipRef]);

  return (
    <>
    <div className="journey-map-stage" ref={wrapRef}>
      <div className="journey-map-sheet" ref={sheetRef}>
      <div className="journey-parallax-layer" ref={parallaxRef}>
      <svg className="journey-map-art" viewBox="0 0 1200 760" role="img" aria-label="An illustrated fantasy map showing the Bard's route from a village, through forests, mountains, and ancient ruins, to a castle">
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
          <path d="M28 638Q151 608 274 635T505 621Q650 598 772 624T1001 604Q1105 592 1173 625V739H28Z" fill="#cbb386" opacity=".26" />
          <path d="M57 683q122-22 211-4t184-8q119-26 228-5t204 5q101-19 233 2" fill="none" stroke="#94774f" strokeWidth="1.3" opacity=".55" />
          <path d="M90 130Q190 102 267 141T425 125M620 110q97-23 167 9t141-5M80 580q89-31 174-5t171-6M893 575q105-27 205 7" fill="none" stroke="#a58c61" strokeWidth="1.1" opacity=".48" />
          <path d="M618 68Q579 116 603 166T587 245Q572 282 600 322T631 408Q672 446 695 489" fill="none" stroke="#879996" strokeWidth="17" opacity=".42" />
          <path d="M618 68Q579 116 603 166T587 245Q572 282 600 322T631 408Q672 446 695 489" fill="none" stroke="#d7ded0" strokeWidth="2" opacity=".85" />
          <g ref={cameraRef}>
            {/* Mountain pass: layered ridges, ink hatching, and connected foothills */}
            <Mountain x={526} y={259} scale={1.02} back />
            <Mountain x={628} y={267} scale={1.23} />
            <Mountain x={714} y={278} scale={.76} back />
            <path d="M460 325q46-16 77 4t68-1q36-20 68 0t87-4l37 35q-49 15-91 5t-79 9q-47 15-85-4t-93 2Z" fill="#a29372" stroke="#645943" strokeWidth="1.8" />
            <path d="M486 343q22-9 36 0m52-8q19-12 37-3m84 7q22-11 44-2m-224 35q24-13 51-3m63 9q23-15 48-6m54-2q19-9 37-2" fill="none" stroke="#6b614d" strokeWidth="1.2" opacity=".75" />
            <path d="M513 349q-9-19-13-5m39 9q-7-20-12-7m175-6q10-21 14-8m26 9q9-18 14-6" fill="none" stroke="#49563e" strokeWidth="3" />
            <path d="M590 378q28-18 56-9t50 1" fill="none" stroke="#66583f" strokeWidth="3" strokeDasharray="2 7" />

            {/* Village */}
            <path d="M84 523q52-18 96 4t72-8q30-19 54-4" fill="none" stroke="#88704a" strokeWidth="11" opacity=".28" />
            <Cottage x={112} y={459} scale={.78} />
            <Cottage x={198} y={445} scale={.9} roof="#9a6746" />
            <Cottage x={139} y={394} scale={.68} roof="#7d5141" />
            <path d="M81 476q62-23 110-4t111-6" fill="none" stroke="#7b6244" strokeWidth="2.4" strokeDasharray="2 5" />
            <path d="M101 438h23m63-22h18m-41 105h25" stroke="#eee0ba" strokeWidth="1.7" />
            <path d="M231 471v-22m-5 5h10" stroke="#624b35" strokeWidth="2" />
            <path d="M226 448q9-5 18 0v11q-9 5-18 0Z" fill="#c9a869" stroke="#5a4934" strokeWidth="1.5" />
            <Tree x={78} y={433} size={.65} pale /><Tree x={257} y={427} size={.82} /><Tree x={86} y={546} size={.7} />
            <path d="M159 484h5m11-6h4m30-43h4" stroke="#b38e57" strokeWidth="2" />

            {/* Enchanted wood: deliberate clusters with a small clearing */}
            <path d="M309 478q27-38 66-19t66-15q39-38 79-6t-1 75q-44 26-92 7t-91 12q-49-4-27-54Z" fill="#b1ad7b" opacity=".29" />
            <Tree x={334} y={410} size={1.04} /><Tree x={386} y={389} size={1.2} pale /><Tree x={438} y={402} size={1.03} />
            <Tree x={315} y={465} size={.86} pale /><Tree x={468} y={466} size={1.1} /><Tree x={365} y={490} size={.92} />
            <Tree x={428} y={497} size={.78} pale /><Tree x={487} y={449} size={.83} />
            <path d="M327 445q25-10 38 1m91 9q15-10 28 0m-95 48q12-8 21 0" fill="none" stroke="#8f7147" strokeWidth="1.4" />
            <path d="M354 477q3-9 7 0m4 2q3-7 6 0m67-48q3-8 6 0" fill="none" stroke="#9b5940" strokeWidth="2" />

            {/* Ruins */}
            <path d="M718 435q24-42 62-15t61-10q38-27 71 9l-13 41q-49 13-97 3t-87 8Z" fill="#64714b" opacity=".18" />
            <Ruins />
            <Tree x={738} y={440} size={.72} /><Tree x={890} y={423} size={.8} pale />
            <path d="M733 411q17-16 28-1m102 20q14-17 24-4" fill="none" stroke="#536044" strokeWidth="2.5" />

            {/* Keep and approach */}
            <Castle />
            <path d="M1020 319q-19 22-26 37t-26 16q-27 3-49 16" fill="none" stroke="#806344" strokeWidth="7" opacity=".2" />
            <path d="M1020 319q-19 22-26 37t-26 16q-27 3-49 16" fill="none" stroke="#876c48" strokeWidth="2" strokeDasharray="2 5" />
            <Tree x={925} y={326} size={.82} /><Tree x={1082} y={330} size={.9} pale />

            {/* Hand-inked route, drawn over the geography */}
            <path ref={pathRef} d={ROUTE} fill="none" stroke="#efe2bd" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity=".88" />
            <path d={ROUTE} fill="none" stroke="#8b4e39" strokeWidth="2.3" strokeDasharray="1 9" strokeLinecap="round" opacity=".68" />
            <path ref={traveledRef} d={ROUTE} fill="none" stroke="#8b4e39" strokeWidth="3.6" strokeLinecap="round" strokeDasharray="1 1" opacity=".92" />
            <g className="journey-waypoints" aria-hidden="true">
              {[[146,510],[366,409],[555,315],[767,414],[1048,226]].map(([x,y], index) => (
                <g key={x} className={activeLandmark >= index ? "is-reached" : ""} transform={`translate(${x} ${y})`}>
                  {index === 4 && <circle ref={pulseRef} className="journey-arrival-pulse" r="9" fill="none" stroke="#a14e36" strokeWidth="2.5" opacity="0" />}
                  <circle r="9" fill="#eadbb7" stroke="#784b37" strokeWidth="1.8" />
                  <circle r="3" fill="#a45e43" />
                </g>
              ))}
            </g>
            <g className="journey-landmark-labels" aria-hidden="true">
              {WAYPOINTS.map((waypoint, index) => (
                <g key={waypoint.section} className={activeLandmark >= index ? "is-visible" : ""} transform={`translate(${waypoint.x} ${waypoint.y})`}>
                  <path d="M-32 0h64" />
                  <text textAnchor="middle" y="15">{waypoint.section}</text>
                </g>
              ))}
            </g>
            <BardMini refNode={bardRef} />
          </g>

          {/* Cartographic marginalia */}
          <g className="journey-compass" transform="translate(1090 526)" stroke="#725638">
            <circle r="43" fill="none" strokeWidth="1.2" /><circle r="34" fill="none" strokeWidth=".8" />
            <path d="M0-38 7-5 0 0-7-5ZM0 38-7 5 0 0 7 5ZM-38 0-5-7 0 0-5 7ZM38 0 5 7 0 0 5-7Z" fill="#9b7145" strokeWidth="1" />
            <circle r="4" fill="#ead9b4" strokeWidth="1.5" /><text x="-4" y="-51">N</text>
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
        <h1>Lintang Journey</h1>
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
    <section ref={rootRef} className={`journey-intro ${isReduced ? "journey-static" : ""}`} aria-label="Lintang Journey introduction">
      <FantasyMap reduced={isReduced} short={short} onEnter={onEnter} rootRef={rootRef} skipRef={skipRef} />
      <button ref={skipRef} type="button" className="journey-skip">{isReduced ? "Enter the portfolio" : "Skip intro"}<span className="journey-skip-arrow" aria-hidden="true"> ↗</span></button>
      <p className="journey-sr-only" aria-live="polite">{isReduced ? "Static fantasy map. Enter the portfolio when ready." : "The Bard is traveling across the map toward Emberfall Keep."}</p>
    </section>
  );
}
