import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from "three";

export default function OrbScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap) return;

    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      canvas.hidden = true;
      return;
    }

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 30);
    camera.position.set(0, 0, 5.4);

    const orbGroup = new Group();
    orbGroup.position.set(0.15, 0, 0);
    scene.add(orbGroup);

    const coreGeometry = new SphereGeometry(1.12, 40, 32);
    const coreMaterial = new MeshStandardMaterial({
      color: 0x102b31,
      emissive: 0x007d72,
      emissiveIntensity: 0.45,
      metalness: 0.42,
      roughness: 0.32,
    });
    orbGroup.add(new Mesh(coreGeometry, coreMaterial));

    const shellGeometry = new SphereGeometry(1.18, 32, 24);
    const shellMaterial = new MeshBasicMaterial({
      color: 0x00f5c4,
      wireframe: true,
      transparent: true,
      opacity: 0.055,
    });
    orbGroup.add(new Mesh(shellGeometry, shellMaterial));

    const haloGeometry = new SphereGeometry(1.38, 24, 18);
    const haloMaterial = new MeshBasicMaterial({
      color: 0x00bfa5,
      side: BackSide,
      transparent: true,
      opacity: 0.075,
      depthWrite: false,
    });
    orbGroup.add(new Mesh(haloGeometry, haloMaterial));

    const ringMaterial = new MeshBasicMaterial({ color: 0x00dabb, transparent: true, opacity: 0.34 });
    const ringGroup = new Group();
    ringGroup.rotation.set(0.92, 0.22, -0.28);
    orbGroup.add(ringGroup);
    const ringGeometry = new TorusGeometry(1.62, 0.009, 6, 96);
    ringGroup.add(new Mesh(ringGeometry, ringMaterial));

    const outerRing = new Mesh(
      new TorusGeometry(1.88, 0.005, 5, 96),
      new MeshBasicMaterial({ color: 0x6b5ce7, transparent: true, opacity: 0.23 })
    );
    outerRing.rotation.set(1.12, -0.24, 0.38);
    orbGroup.add(outerRing);

    const particleCount = 110;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.05 + Math.random() * 1.0;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.1;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius - 0.5;
    }
    const particleGeometry = new BufferGeometry();
    particleGeometry.setAttribute("position", new BufferAttribute(particlePositions, 3));
    const particleMaterial = new PointsMaterial({
      color: 0x62e8d0,
      size: 0.018,
      transparent: true,
      opacity: 0.58,
      sizeAttenuation: true,
      depthWrite: false,
    });
    scene.add(new Points(particleGeometry, particleMaterial));

    scene.add(new AmbientLight(0x9ccdc8, 1.2));
    const keyLight = new PointLight(0x00f5c4, 32, 9);
    keyLight.position.set(-2, 2.5, 3);
    scene.add(keyLight);
    const rimLight = new PointLight(0x6655e8, 24, 8);
    rimLight.position.set(2, -1.5, -2);
    scene.add(rimLight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    const resize = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    let targetX = 0;
    let targetY = 0;
    let frameId = null;
    let lastFrameTime = 0;
    let elapsed = 0;
    let inView = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canAnimate = () => inView && document.visibilityState === "visible" && !reducedMotion.matches;
    const scheduleFrame = () => {
      if (frameId === null && canAnimate()) frameId = requestAnimationFrame(animate);
    };
    const animate = (time) => {
      frameId = null;
      if (!canAnimate()) return;
      if (time - lastFrameTime < 32) {
        scheduleFrame();
        return;
      }
      const delta = Math.min((time - (lastFrameTime || time)) / 1000, 0.05);
      lastFrameTime = time;
      elapsed += delta;
      orbGroup.rotation.y += delta * 0.08;
      ringGroup.rotation.z += delta * 0.035;
      outerRing.rotation.y += delta * 0.045;
      orbGroup.rotation.x += (targetY * 0.08 - orbGroup.rotation.x) * 0.035;
      orbGroup.rotation.z += (targetX * 0.08 - orbGroup.rotation.z) * 0.035;
      keyLight.position.x = -2 + Math.sin(elapsed * 0.2) * 0.28;
      renderer.render(scene, camera);
      scheduleFrame();
    };
    const onVisibilityChange = () => {
      if (!canAnimate() && frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      } else {
        scheduleFrame();
      }
    };
    const onPointerMove = (event) => {
      const bounds = wrap.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetY = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };
    const onMotionPreferenceChange = () => {
      if (reducedMotion.matches) {
        orbGroup.rotation.set(0, 0, 0);
        ringGroup.rotation.set(0.92, 0.22, -0.28);
        outerRing.rotation.set(1.12, -0.24, 0.38);
        renderer.render(scene, camera);
      }
      onVisibilityChange();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      onVisibilityChange();
    });
    intersectionObserver.observe(wrap);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener?.("change", onMotionPreferenceChange);
    resize();
    scheduleFrame();

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener?.("change", onMotionPreferenceChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      coreGeometry.dispose();
      coreMaterial.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      outerRing.geometry.dispose();
      outerRing.material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="w-full h-full block" />;
}
