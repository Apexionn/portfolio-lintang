import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  FogExp2,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const terrainHeight = (x, z) =>
  0.22 * Math.sin(x * 0.24 + z * 0.12) +
  0.13 * Math.cos(x * 0.43 - z * 0.11) +
  0.08 * Math.sin(z * 0.34);
const pathCenter = (z) => Math.sin(z * 0.14) * 2.15 + Math.sin(z * 0.31) * 0.52;

export default function AdventureScene() {
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
        stencil: false,
        depth: true,
      });
    } catch {
      canvas.hidden = true;
      return;
    }

    const scene = new Scene();
    scene.fog = new FogExp2(0x829da0, 0.018);
    const camera = new PerspectiveCamera(48, 1, 0.1, 100);
    const cameraPosition = new Vector3(0, 5.1, 12.8);
    const cameraTarget = new Vector3(0, 0.2, -5.4);
    camera.position.copy(cameraPosition);
    camera.lookAt(cameraTarget);

    const geometries = new Set();
    const materials = new Set();
    const ownGeometry = (geometry) => (geometries.add(geometry), geometry);
    const ownMaterial = (material) => (materials.add(material), material);
    const standard = (color, roughness = 1) => ownMaterial(new MeshStandardMaterial({ color, roughness, metalness: 0 }));

    scene.add(new AmbientLight(0xe0e1d1, 2));
    const sunLight = new DirectionalLight(0xffe0b0, 2.1);
    sunLight.position.set(-8, 14, 6);
    scene.add(sunLight);
    const fillLight = new DirectionalLight(0xb1c7c2, 0.9);
    fillLight.position.set(8, 8, -20);
    scene.add(fillLight);

    // Gently uneven valley floor: one shared low-resolution mesh keeps the scene inexpensive.
    const terrainGeometry = ownGeometry(new BufferGeometry());
    const terrainPositions = [];
    const terrainIndices = [];
    const columns = 56;
    const rows = 92;
    for (let row = 0; row <= rows; row++) {
      const z = 15 - (row / rows) * 103;
      for (let column = 0; column <= columns; column++) {
        const x = -32 + (column / columns) * 64;
        terrainPositions.push(x, terrainHeight(x, z), z);
        if (row < rows && column < columns) {
          const a = row * (columns + 1) + column;
          const b = a + columns + 1;
          terrainIndices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    }
    terrainGeometry.setAttribute("position", new BufferAttribute(new Float32Array(terrainPositions), 3));
    terrainGeometry.setIndex(terrainIndices);
    terrainGeometry.computeVertexNormals();
    const ground = new Mesh(terrainGeometry, standard(0x526c58));
    ground.frustumCulled = false;
    scene.add(ground);

    // A single tessellated ribbon gives the eye a calm route through the landscape.
    const makeRibbon = (halfWidth, lift, startZ = 15, endZ = -53, segments = 160) => {
      const geometry = ownGeometry(new BufferGeometry());
      const positions = [];
      const indices = [];
      for (let i = 0; i <= segments; i++) {
        const z = startZ + (endZ - startZ) * (i / segments);
        const x = pathCenter(z);
        const taper = 0.08 + 0.92 * Math.sin((i / segments) * Math.PI);
        const width = halfWidth * taper;
        positions.push(x - width, terrainHeight(x - width, z) + lift, z);
        positions.push(x + width, terrainHeight(x + width, z) + lift, z);
        if (i < segments) {
          const a = i * 2;
          indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
      }
      geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      return geometry;
    };
    const trailBed = new Mesh(makeRibbon(1.42, 0.11), standard(0x514738));
    trailBed.frustumCulled = false;
    scene.add(trailBed);
    const trailSurface = new Mesh(makeRibbon(1.2, 0.13), standard(0x9a805d));
    trailSurface.frustumCulled = false;
    scene.add(trailSurface);

    // Distant layered ridges and a few nearer rock forms establish scale and depth.
    const mountainGeometry = ownGeometry(new ConeGeometry(1, 1, 6, 1));
    const mountainMats = [standard(0x708486), standard(0x647a7e), standard(0x859595)];
    const rockGeometry = ownGeometry(new SphereGeometry(1, 7, 5));
    const rockMat = standard(0x596052);
    const seeded = (seed) => {
      let n = seed >>> 0;
      return () => {
        n = (n * 1664525 + 1013904223) >>> 0;
        return n / 4294967296;
      };
    };
    const random = seeded(31841);
    for (let i = 0; i < 12; i++) {
      const side = i % 2 ? 1 : -1;
      const slot = Math.floor((i % 6) / 2);
      const x = side * (9 + slot * 8 + random() * 0.5);
      const z = -64 - Math.floor(i / 6) * 11 - random() * 2;
      const height = 8 + random() * 5;
      const baseY = terrainHeight(x, z);
      const mountain = new Mesh(mountainGeometry, mountainMats[i % mountainMats.length]);
      mountain.position.set(x, baseY + height * 0.5, z);
      mountain.scale.set(3.2 + random() * 0.7, height, 3 + random() * 1.2);
      mountain.rotation.y = random() * Math.PI;
      scene.add(mountain);
    }
    for (let i = 0; i < 14; i++) {
      const z = 5 - random() * 60;
      const side = i % 2 ? 1 : -1;
      const x = pathCenter(z) + side * (11 + random() * 4.5);
      const rock = new Mesh(rockGeometry, rockMat);
      const scale = 0.35 + random() * 0.7;
      rock.position.set(x, terrainHeight(x, z) + scale * 0.55, z);
      rock.scale.set(scale * 1.25, scale * 0.55, scale);
      rock.rotation.y = random() * Math.PI;
      scene.add(rock);
    }

    // Low-poly pines share the same geometry/material through instancing.
    const treeCount = 44;
    const trunkGeometry = ownGeometry(new CylinderGeometry(0.1, 0.15, 1, 5));
    const crownGeometry = ownGeometry(new ConeGeometry(0.46, 1.12, 5, 1));
    const trunkMaterial = standard(0x51463a);
    const crownMaterials = [standard(0x41674f), standard(0x4d7457), standard(0x587b5d)];
    const trunks = new InstancedMesh(trunkGeometry, trunkMaterial, treeCount);
    const crowns = crownMaterials.map((material) => new InstancedMesh(crownGeometry, material, treeCount));
    const dummy = new Group();
    const matrix = new Matrix4();
    let placed = 0;
    for (let i = 0; i < treeCount; i++) {
      const row = Math.floor(i / 2);
      const side = i % 2 ? 1 : -1;
      const z = 7 - row * 2.15 + (side > 0 ? -0.75 : 0);
      const distance = 5.8 + (row % 5 === 0 ? 2.4 : 0) + random() * 0.7;
      if (side > 0 && Math.abs(z + 12) < 3.2) continue;
      const x = pathCenter(z) + side * distance;
      const height = 1.45 + random() * 0.8;
      const scale = 0.76 + random() * 0.22;
      const y = terrainHeight(x, z);
      dummy.position.set(x, y + height * 0.24, z);
      dummy.scale.set(scale, height * 0.5, scale);
      dummy.rotation.set(0, random() * Math.PI, 0);
      dummy.updateMatrix();
      trunks.setMatrixAt(placed, matrix.copy(dummy.matrix).multiply(new Matrix4().makeScale(0.34, 1.2, 0.34)));
      for (let layer = 0; layer < crowns.length; layer++) {
        const layerGroup = new Group();
        layerGroup.position.set(x, y + height * (0.34 + layer * 0.24), z);
        layerGroup.scale.set(scale * (1.02 - layer * 0.14), height * 0.31, scale * (1.02 - layer * 0.14));
        layerGroup.rotation.y = dummy.rotation.y;
        layerGroup.updateMatrix();
        crowns[layer].setMatrixAt(placed, layerGroup.matrix);
      }
      placed++;
    }
    trunks.count = placed;
    trunks.instanceMatrix.needsUpdate = true;
    trunks.frustumCulled = false;
    scene.add(trunks);
    crowns.forEach((mesh) => {
      mesh.count = placed;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
      scene.add(mesh);
    });

    // A modest roadside ruin serves as one quiet environmental landmark.
    const stoneMaterial = standard(0x74705c);
    const pillarGeometry = ownGeometry(new CylinderGeometry(0.24, 0.32, 2.2, 6));
    const lintelGeometry = ownGeometry(new CylinderGeometry(0.2, 0.2, 2.9, 6));
    const ruin = new Group();
    ruin.position.set(pathCenter(-12) + 5.3, terrainHeight(pathCenter(-12) + 5.3, -12), -12);
    const leftPillar = new Mesh(pillarGeometry, stoneMaterial);
    leftPillar.position.set(-1.25, 1.1, 0);
    leftPillar.rotation.z = 0.06;
    const rightPillar = new Mesh(pillarGeometry, stoneMaterial);
    rightPillar.position.set(1.25, 0.88, -0.06);
    rightPillar.rotation.z = -0.14;
    const lintel = new Mesh(lintelGeometry, stoneMaterial);
    lintel.position.set(0, 2.2, 0);
    lintel.rotation.z = Math.PI / 2;
    ruin.add(leftPillar, rightPillar, lintel);
    scene.add(ruin);

    // A warm, small sun is placed behind the distant ridge; no bloom or postprocessing.
    const sun = new Mesh(
      ownGeometry(new SphereGeometry(1.15, 12, 8)),
      ownMaterial(new MeshBasicMaterial({ color: 0xd7aa77 }))
    );
    sun.position.set(-14, 13, -61);
    scene.add(sun);

    const moteCount = 38;
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePositions[i * 3] = (random() - 0.5) * 26;
      motePositions[i * 3 + 1] = 0.7 + random() * 6;
      motePositions[i * 3 + 2] = 8 - random() * 78;
    }
    const moteGeometry = ownGeometry(new BufferGeometry());
    moteGeometry.setAttribute("position", new BufferAttribute(motePositions, 3));
    const motes = new Points(moteGeometry, ownMaterial(new PointsMaterial({
      color: 0xe5c99d,
      size: 0.055,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      sizeAttenuation: true,
    })));
    scene.add(motes);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.25));
    renderer.setClearColor(new Color(0x18253a), 0);

    const resize = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };

    let targetTravel = 0;
    let travel = 0;
    let frameId = null;
    let lastFrameTime = 0;
    let inView = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canRender = () => inView && document.visibilityState === "visible";
    const render = () => renderer.render(scene, camera);
    const scheduleFrame = () => {
      if (frameId === null && canRender() && !reducedMotion.matches) frameId = requestAnimationFrame(animate);
      else if (reducedMotion.matches && canRender()) animateCamera();
    };
    const updateTravel = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetTravel = maxScroll <= 0 ? 0 : clamp01(window.scrollY / maxScroll);
      if (reducedMotion.matches) {
        travel = targetTravel;
        animateCamera();
        return;
      }
      scheduleFrame();
    };
    const animate = (time) => {
      frameId = null;
      if (!canRender()) return;
      if (time - lastFrameTime < 32) {
        scheduleFrame();
        return;
      }
      const delta = Math.min((time - (lastFrameTime || time)) / 1000, 0.06);
      lastFrameTime = time;
      travel += (targetTravel - travel) * (1 - Math.exp(-delta * 4.2));

      const targetZ = 12.8 - travel * 52;
      const targetX = Math.sin(travel * Math.PI * 2.15) * 1.15;
      const targetY = 5.1 + Math.sin(travel * Math.PI) * 0.55;
      cameraPosition.set(targetX, targetY, targetZ);
      cameraTarget.set(targetX * 0.58 + pathCenter(targetZ - 18.2) * 0.28, 0.2, targetZ - 18.2);
      camera.position.copy(cameraPosition);
      camera.lookAt(cameraTarget);
      render();

      if (Math.abs(targetTravel - travel) > 0.0007) scheduleFrame();
    };

    const onVisibilityChange = () => {
      if (!canRender() && frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      } else if (canRender()) {
        updateTravel();
        render();
      }
    };
    const onMotionPreferenceChange = () => {
      if (reducedMotion.matches) {
        travel = targetTravel;
        animateCamera();
      } else scheduleFrame();
    };
    const animateCamera = () => {
      const targetZ = 12.8 - travel * 52;
      const targetX = Math.sin(travel * Math.PI * 2.15) * 1.15;
      camera.position.set(targetX, 5.1 + Math.sin(travel * Math.PI) * 0.55, targetZ);
      camera.lookAt(targetX * 0.58 + pathCenter(targetZ - 18.2) * 0.28, 0.2, targetZ - 18.2);
      render();
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
    animateCamera();

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateTravel);
      window.removeEventListener("resize", updateTravel);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener?.("change", onMotionPreferenceChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="w-full h-full block" />;
}
