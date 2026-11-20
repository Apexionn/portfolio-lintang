import { gsap } from "gsap";

export const INTRO_CONFIG = Object.freeze({
  reveal: 0.48,
  journey: 2.72,
  outro: 2.4,
  shortOutro: 0.62,
  skipToCastle: 0.14,
  reducedCrossfade: 0.35,
  cameraZoom: 1.62,
  cameraZoomDuration: 0.9,
  parchmentMoveDuration: 0.9,
  heroStart: 1.6,
  easing: "power2.out",
  travelEase: "sine.inOut",
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
