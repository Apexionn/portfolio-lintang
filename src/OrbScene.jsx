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
  Vector3,
  WebGLRenderer,
} from "three";

const clamp01 = (value) => Math.max(0, Math.min(1, value));

export default function OrbScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap) return;

    let renderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      canvas.hidden = true;
      return;
    }

    const scene = new Scene();
    const camera = new PerspectiveCamera(48, 1, 0.1, 40);
    const startCamera = new Vector3(0, 0, 9.4);
    const startFocus = new Vector3(0, 0, 0);
    const cameraGoal = new Vector3();
    const focusGoal = new Vector3();
    const currentFocus = new Vector3();
    const focusPosition = new Vector3();
    camera.position.copy(startCamera);
    camera.lookAt(startFocus);

    const solarSystem = new Group();
    solarSystem.position.set(0.45, 0, 0);
    solarSystem.rotation.set(-0.28, 0.08, 0.08);
    scene.add(solarSystem);

    const sunGeometry = new SphereGeometry(0.56, 28, 20);
    const sunMaterial = new MeshBasicMaterial({ color: 0xffc36e });
    solarSystem.add(new Mesh(sunGeometry, sunMaterial));

    const sunHaloGeometry = new SphereGeometry(0.72, 20, 16);
    const sunHaloMaterial = new MeshBasicMaterial({
      color: 0xff9a4a,
      side: BackSide,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    solarSystem.add(new Mesh(sunHaloGeometry, sunHaloMaterial));

    const orbitGeometry = [];
    const orbitMaterials = [];
    const planetGeometries = [];
    const planetMaterials = [];
    const satelliteGroups = [];
    const createOrbit = (radius, color = 0x547477) => {
      const geometry = new TorusGeometry(radius, 0.006, 4, 112);
      const material = new MeshBasicMaterial({ color, transparent: true, opacity: 0.24 });
      orbitGeometry.push(geometry);
      orbitMaterials.push(material);
      solarSystem.add(new Mesh(geometry, material));
    };
    const createPlanet = ({ radius, size, color, emissive, speed, phase = 0, focus = false, ring = false }) => {
      const orbitGroup = new Group();
      orbitGroup.rotation.z = phase;
      orbitGroup.rotation.x = focus ? 0.06 : Math.random() * 0.12 - 0.06;
      solarSystem.add(orbitGroup);

      const geometry = new SphereGeometry(size, 24, 18);
      const material = new MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: 0.18,
        roughness: 0.68,
        metalness: 0.08,
      });
      const planet = new Mesh(geometry, material);
      planet.position.set(radius, focus ? 0.08 : 0, 0);
      orbitGroup.add(planet);
      planetGeometries.push(geometry);
      planetMaterials.push(material);

      if (ring) {
        const ringGeometry = new TorusGeometry(size * 1.5, 0.012, 4, 48);
        const ringMaterial = new MeshBasicMaterial({ color: 0xb8a0ff, transparent: true, opacity: 0.42 });
        const planetaryRing = new Mesh(ringGeometry, ringMaterial);
        planetaryRing.rotation.x = Math.PI * 0.36;
        planet.add(planetaryRing);
        orbitGeometry.push(ringGeometry);
        orbitMaterials.push(ringMaterial);
      }

      satelliteGroups.push({ group: orbitGroup, speed, planet, focus });
      if (focus) return planet;
      return null;
    };

    const planetSpecs = [
      { radius: 1.15, size: 0.13, color: 0xc5a783, emissive: 0x51361e, speed: 0.035, phase: 2.35 },
      { radius: 1.82, size: 0.22, color: 0x7d86c9, emissive: 0x252d71, speed: 0.022, phase: 4.1 },
      { radius: 2.65, size: 0.43, color: 0x1d877b, emissive: 0x064e49, speed: 0.014, phase: 0.48, focus: true },
      { radius: 3.55, size: 0.31, color: 0xc77f63, emissive: 0x63321e, speed: 0.01, phase: 2.9 },
      { radius: 4.4, size: 0.52, color: 0xb99469, emissive: 0x564020, speed: 0.007, phase: 5.1, ring: true },
    ];

    let focusPlanet = null;
    planetSpecs.forEach((planet) => {
      createOrbit(planet.radius);
      const group = createPlanet(planet);
      if (planet.focus) focusPlanet = group;
    });

    const starCount = 96;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 14;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      starPositions[i * 3 + 2] = -1.5 - Math.random() * 5;
    }
    const starGeometry = new BufferGeometry();
    starGeometry.setAttribute("position", new BufferAttribute(starPositions, 3));
    const starMaterial = new PointsMaterial({
      color: 0x7ca8a9,
      size: 0.018,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
      depthWrite: false,
    });
    scene.add(new Points(starGeometry, starMaterial));

    scene.add(new AmbientLight(0x9aabb8, 1.15));
    const sunLight = new PointLight(0xffc579, 38, 14);
    sunLight.position.set(0, 0, 1.4);
    solarSystem.add(sunLight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
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

    let targetTravel = 0;
    let travel = 0;
    let frameId = null;
    let lastFrameTime = 0;
    let inView = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canAnimate = () => inView && document.visibilityState === "visible";

    const updateTravel = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetTravel = maxScroll <= 0
        ? 0
        : clamp01(window.scrollY / (maxScroll * 0.64));
      if (reducedMotion.matches) travel = targetTravel;
      scheduleFrame();
    };

    const scheduleFrame = () => {
      if (frameId === null && canAnimate()) frameId = requestAnimationFrame(animate);
    };

    const animate = (time) => {
      frameId = null;
      if (!canAnimate()) return;
      if (time - lastFrameTime < 33) {
        scheduleFrame();
        return;
      }
      const delta = Math.min((time - (lastFrameTime || time)) / 1000, 0.05);
      lastFrameTime = time;

      if (!reducedMotion.matches) {
        satelliteGroups.forEach(({ group, speed, planet }) => {
          group.rotation.z += delta * speed;
          planet.rotation.y += delta * 0.16;
        });
        solarSystem.rotation.y = Math.sin(time * 0.00008) * 0.035;
        travel += (targetTravel - travel) * (1 - Math.exp(-delta * 2.2));
      }

      if (focusPlanet) focusPlanet.getWorldPosition(focusPosition);
      const zoomAmount = travel;
      cameraGoal.set(focusPosition.x + 0.55, focusPosition.y + 0.32, 2.55);
      focusGoal.copy(focusPosition);
      camera.position.lerpVectors(startCamera, cameraGoal, zoomAmount);
      currentFocus.lerpVectors(startFocus, focusGoal, zoomAmount);
      camera.lookAt(currentFocus);
      renderer.render(scene, camera);

      if (!reducedMotion.matches || Math.abs(targetTravel - travel) > 0.001) scheduleFrame();
    };

    const onVisibilityChange = () => {
      if (!canAnimate() && frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      } else if (canAnimate() && (!reducedMotion.matches || Math.abs(targetTravel - travel) > 0.001)) {
        scheduleFrame();
      }
    };
    const onMotionPreferenceChange = () => {
      if (reducedMotion.matches) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetTravel = maxScroll <= 0 ? 0 : clamp01(window.scrollY / (maxScroll * 0.64));
        travel = targetTravel;
      }
      scheduleFrame();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      onVisibilityChange();
    });
    intersectionObserver.observe(wrap);
    window.addEventListener("scroll", updateTravel, { passive: true });
    window.addEventListener("resize", updateTravel, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener?.("change", onMotionPreferenceChange);
    resize();
    updateTravel();
    scheduleFrame();

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateTravel);
      window.removeEventListener("resize", updateTravel);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener?.("change", onMotionPreferenceChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      sunGeometry.dispose();
      sunMaterial.dispose();
      sunHaloGeometry.dispose();
      sunHaloMaterial.dispose();
      orbitGeometry.forEach((geometry) => geometry.dispose());
      orbitMaterials.forEach((material) => material.dispose());
      planetGeometries.forEach((geometry) => geometry.dispose());
      planetMaterials.forEach((material) => material.dispose());
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="w-full h-full block" />;
}
