import { gsap } from "gsap";

export const INTRO_CONFIG = Object.freeze({
  reveal: 0.48,
  journey: 2.72,
  rollDuration: 1.8,
  rollExitDuration: 0.4,
  shortOutro: 0.7,
  skipToCastle: 0.14,
  reducedCrossfade: 0.35,
  rollMinDiameter: 6,
  rollMaxDiameter: 70,
  rollMaxDiameterMobile: 44,
  easing: "power2.out",
  travelEase: "sine.inOut",
  rollEase: "power3.inOut",
  rollExitEase: "power2.in",
});

function waitForImage(image) {
  if (image.complete) return Promise.resolve();
  return new Promise((resolve) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  });
}

function waitForWorldCanvas(canvas) {
  if (!canvas || canvas.dataset.worldReady === "true") return Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => {
      window.clearTimeout(timeout);
      window.removeEventListener("portfolio-world-ready", finish);
      resolve();
    };
    const timeout = window.setTimeout(finish, 5000);
    window.addEventListener("portfolio-world-ready", finish, { once: true });
  });
}

export function waitForHeroAssets(page) {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const images = [...(page?.querySelectorAll("#hero img") ?? [])].map(waitForImage);
  const canvas = waitForWorldCanvas(page?.querySelector(".adventure-world-canvas"));
  return Promise.allSettled([fonts, ...images, canvas]);
}

export function makeIntroTimeline() {
  return gsap.timeline({ paused: true, defaults: { ease: INTRO_CONFIG.easing } });
}
