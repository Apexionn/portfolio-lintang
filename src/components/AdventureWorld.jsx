import { useEffect, useRef } from "react";

const AREA_WIDTH = 620;
const SECTION_IDS = ["hero", "about", "work", "experience", "arsenal", "contact"];
const PALETTE = {
  transparent: null,
  outline: "#302d38",
  hat: "#426b50",
  hatLight: "#71905b",
  hair: "#694735",
  skin: "#e6b77f",
  skinShade: "#bd805f",
  shirt: "#e6d3a2",
  shirtShade: "#b6a077",
  leather: "#654a3c",
  leatherLight: "#a7794c",
  gold: "#d7ae62",
  boot: "#473b37",
  lute: "#a96b42",
  luteLight: "#d39a55",
  forest: "#294b43",
  forestLight: "#42684d",
  forestShade: "#1e3b39",
  grass: "#658356",
  dirt: "#81694b",
};

const AREAS = [
  { name: "Forest Entrance", sky: ["#6295aa", "#c4c6a2"], hills: "#647f70", ground: "#506d4d", far: "#627d7c" },
  { name: "Enchanted Forest", sky: ["#617b9b", "#b5afaa"], hills: "#536b67", ground: "#415d4d", far: "#647782" },
  { name: "Ancient Ruins", sky: ["#728b9a", "#cab08e"], hills: "#6d7c70", ground: "#5c694d", far: "#788786" },
  { name: "Medieval Village", sky: ["#7c9ba1", "#dfbf8d"], hills: "#78856b", ground: "#65724f", far: "#8a9580" },
  { name: "Wizard's Tower", sky: ["#564f78", "#b589a2"], hills: "#55576c", ground: "#454c54", far: "#77728e" },
  { name: "Final Camp", sky: ["#303d66", "#e9a071"], hills: "#4a5564", ground: "#414c4c", far: "#626d81" },
];

const MOUNTAIN_PROFILES = [
  [[0, 0], [0.08, 0.22], [0.17, 0.18], [0.29, 0.42], [0.36, 0.33], [0.45, 0.86], [0.51, 0.66], [0.58, 0.48], [0.7, 0.62], [0.79, 0.3], [0.9, 0.46], [1, 0]],
  [[0, 0], [0.12, 0.27], [0.22, 0.7], [0.28, 0.52], [0.36, 0.44], [0.48, 0.88], [0.54, 0.77], [0.62, 0.38], [0.73, 0.61], [0.84, 0.46], [0.93, 0.25], [1, 0]],
  [[0, 0], [0.11, 0.34], [0.2, 0.25], [0.31, 0.76], [0.39, 0.64], [0.48, 0.42], [0.58, 0.9], [0.64, 0.73], [0.72, 0.37], [0.82, 0.59], [0.92, 0.32], [1, 0]],
  [[0, 0], [0.1, 0.26], [0.2, 0.64], [0.27, 0.57], [0.34, 0.68], [0.41, 0.43], [0.53, 0.78], [0.6, 0.75], [0.68, 0.7], [0.78, 0.3], [0.87, 0.41], [1, 0]],
  [[0, 0], [0.13, 0.31], [0.25, 0.22], [0.35, 0.58], [0.42, 0.4], [0.5, 0.82], [0.57, 0.69], [0.65, 0.45], [0.76, 0.73], [0.83, 0.54], [0.91, 0.27], [1, 0]],
  [[0, 0], [0.09, 0.38], [0.16, 0.29], [0.27, 0.5], [0.33, 0.47], [0.43, 0.8], [0.48, 0.83], [0.54, 0.79], [0.62, 0.36], [0.75, 0.68], [0.86, 0.41], [1, 0]],
];

const HILL_PROFILE = [[0, 0], [0.12, 0.34], [0.27, 0.2], [0.43, 0.4], [0.58, 0.26], [0.75, 0.36], [0.9, 0.24], [1, 0]];
const FOREGROUND_PROFILE = [[0, 0], [0.09, 0.2], [0.18, 0.36], [0.25, 0.29], [0.36, 0.53], [0.44, 0.32], [0.55, 0.43], [0.66, 0.18], [0.78, 0.49], [0.86, 0.31], [0.94, 0.38], [1, 0]];

const BARD_WIDTH = 24;
const BARD_HEIGHT = 32;

const LIMB_FRAMES = [
  [
    [9, 23, 4, 4, "leather"], [14, 23, 4, 4, "leatherLight"],
    [8, 27, 4, 3, "leather"], [15, 27, 4, 3, "leatherLight"],
    [6, 30, 6, 2, "boot"], [15, 30, 6, 2, "boot"],
    [19, 15, 3, 4, "forestShade"], [20, 18, 3, 2, "skin"],
  ],
  [
    [8, 23, 4, 4, "leather"], [14, 23, 4, 4, "leatherLight"],
    [5, 27, 4, 3, "leather"], [16, 27, 4, 3, "leatherLight"],
    [2, 30, 6, 2, "boot"], [16, 30, 6, 2, "boot"],
    [19, 15, 3, 3, "forestShade"], [21, 16, 2, 3, "skin"],
  ],
  [
    [9, 23, 4, 4, "leather"], [14, 23, 4, 4, "leatherLight"],
    [9, 27, 4, 3, "leather"], [14, 27, 4, 3, "leatherLight"],
    [8, 30, 6, 2, "boot"], [14, 30, 6, 2, "boot"],
    [19, 15, 3, 4, "forestShade"], [20, 18, 3, 2, "skin"],
  ],
  [
    [9, 23, 4, 4, "leather"], [14, 23, 4, 4, "leatherLight"],
    [13, 27, 4, 3, "leatherLight"], [5, 27, 4, 3, "leather"],
    [13, 30, 6, 2, "boot"], [3, 30, 6, 2, "boot"],
    [19, 15, 3, 3, "forestShade"], [21, 16, 2, 3, "skin"],
  ],
];

const IDLE_FRAMES = [
  [[9, 23, 4, 4, "leather"], [14, 23, 4, 4, "leatherLight"], [8, 27, 4, 3, "leather"], [15, 27, 4, 3, "leatherLight"], [6, 30, 6, 2, "boot"], [15, 30, 6, 2, "boot"]],
];

const pixel = (ctx, x, y, width, height, color) => {
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
};

const fillPoly = (ctx, points, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(Math.round(points[0][0]), Math.round(points[0][1]));
  points.slice(1).forEach(([x, y]) => ctx.lineTo(Math.round(x), Math.round(y)));
  ctx.closePath();
  ctx.fill();
};

function mixHex(a, b, amount) {
  const from = Number.parseInt(a.slice(1), 16);
  const to = Number.parseInt(b.slice(1), 16);
  const channel = (shift) => Math.round(((from >> shift) & 255) + (((to >> shift) & 255) - ((from >> shift) & 255)) * amount);
  return `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, "0")).join("")}`;
}

function themeAt(worldX) {
  const segment = Math.max(0, Math.min(AREAS.length - 1, worldX / AREA_WIDTH));
  const index = Math.floor(segment);
  const next = Math.min(index + 1, AREAS.length - 1);
  const local = segment - index;
  const blend = Math.max(0, Math.min(1, (local - 0.58) / 0.42));
  return Object.fromEntries(["sky", "hills", "ground", "far"].map((key) => {
    if (key === "sky") return [key, [mixHex(AREAS[index][key][0], AREAS[next][key][0], blend), mixHex(AREAS[index][key][1], AREAS[next][key][1], blend)]];
    return [key, mixHex(AREAS[index][key], AREAS[next][key], blend)];
  }));
}

function drawBard(ctx, x, groundY, direction, animation, frame, idleBeat, scale = 1) {
  const spriteWidth = BARD_WIDTH * scale;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(groundY - BARD_HEIGHT * scale));
  if (direction < 0) {
    ctx.translate(spriteWidth, 0);
    ctx.scale(-1, 1);
  }
  ctx.scale(scale, scale);

  // Draw the lute and travel pack first so they sit naturally behind the Bard.
  pixel(ctx, 2, 15, 7, 12, PALETTE.outline);
  pixel(ctx, 3, 16, 5, 9, PALETTE.leather);
  pixel(ctx, 4, 17, 3, 7, PALETTE.lute);
  pixel(ctx, 5, 18, 1, 5, PALETTE.luteLight);
  pixel(ctx, 6, 10, 2, 13, PALETTE.outline);
  pixel(ctx, 7, 11, 1, 11, PALETTE.gold);
  pixel(ctx, 5, 14, 5, 8, PALETTE.outline);
  pixel(ctx, 6, 15, 3, 6, PALETTE.leather);
  pixel(ctx, 7, 16, 1, 4, PALETTE.leatherLight);

  // Cap, feather, hair, face and collar.
  pixel(ctx, 8, 5, 12, 2, PALETTE.outline);
  pixel(ctx, 9, 3, 10, 3, PALETTE.hat);
  pixel(ctx, 11, 1, 7, 3, PALETTE.hat);
  pixel(ctx, 15, 0, 2, 3, PALETTE.hatLight);
  pixel(ctx, 17, 1, 2, 4, PALETTE.gold);
  pixel(ctx, 10, 5, 9, 7, PALETTE.outline);
  pixel(ctx, 11, 5, 7, 6, PALETTE.hair);
  pixel(ctx, 11, 7, 8, 7, PALETTE.skin);
  pixel(ctx, 10, 8, 2, 5, PALETTE.hair);
  pixel(ctx, 17, 9, 3, 3, PALETTE.skinShade);
  pixel(ctx, 17, 8, 2, 2, PALETTE.skin);
  pixel(ctx, 16, 9, 1, 1, PALETTE.outline);
  pixel(ctx, 18, 11, 2, 1, PALETTE.skinShade);
  pixel(ctx, 11, 13, 8, 2, PALETTE.shirt);

  // Connected cloak, sleeves, belt and trousers create one readable silhouette.
  pixel(ctx, 7, 14, 15, 9, PALETTE.outline);
  pixel(ctx, 8, 14, 13, 8, PALETTE.forest);
  pixel(ctx, 7, 16, 3, 7, PALETTE.forestShade);
  pixel(ctx, 18, 15, 4, 7, PALETTE.forestLight);
  pixel(ctx, 10, 15, 2, 6, PALETTE.forestLight);
  pixel(ctx, 12, 15, 5, 7, PALETTE.shirt);
  pixel(ctx, 13, 17, 3, 4, PALETTE.shirtShade);
  pixel(ctx, 9, 21, 11, 2, PALETTE.gold);
  pixel(ctx, 14, 20, 2, 3, PALETTE.luteLight);
  pixel(ctx, 9, 23, 9, 4, PALETTE.leather);
  pixel(ctx, 10, 24, 7, 1, PALETTE.leatherLight);

  const limbs = animation === "walk" ? LIMB_FRAMES[frame % LIMB_FRAMES.length] : IDLE_FRAMES[idleBeat % IDLE_FRAMES.length];
  limbs.forEach(([px, py, width, height, color]) => pixel(ctx, px, py, width, height, PALETTE[color]));
  ctx.restore();
}

function drawCloud(ctx, x, y, variant = 0) {
  const color = variant ? "#dfe2d4" : "#e8e8dd";
  pixel(ctx, x + 4, y + 2, 18, 3, color);
  pixel(ctx, x + 1, y + 5, 26, 4, color);
  pixel(ctx, x + 6, y + 1, 8, 3, color);
  pixel(ctx, x + 22, y + 4, 8, 4, color);
  pixel(ctx, x + 5, y + 9, 18, 1, "#c3d0cb");
}

function drawMountainRange(ctx, x, baseY, width, height, color, profileIndex, detail = 2, snow = true, profileOverride = null) {
  const profile = profileOverride || MOUNTAIN_PROFILES[profileIndex % MOUNTAIN_PROFILES.length];
  const peakPoints = profile.map(([position, rise]) => [x + position * width, baseY - rise * height]);
  fillPoly(ctx, [[x, baseY], ...peakPoints, [x + width, baseY]], color);

  profile.forEach(([position, rise], index) => {
    if (index === 0 || index === profile.length - 1) return;
    const previous = profile[index - 1];
    const next = profile[index + 1];
    const summitX = x + position * width;
    const summitY = baseY - rise * height;
    const previousX = x + previous[0] * width;
    const previousY = baseY - previous[1] * height;
    const nextX = x + next[0] * width;
    const nextY = baseY - next[1] * height;
    const isPeak = rise > previous[1] && rise > next[1];
    const isValley = rise < previous[1] && rise < next[1];

    if (isPeak) {
      if (detail > 0 && rise < 0.5) return;
      const lightAmount = detail === 0 ? 0.07 : detail === 1 ? 0.12 : 0.2;
      const shadeAmount = detail === 0 ? 0.1 : detail === 1 ? 0.18 : 0.28;
      fillPoly(ctx, [[previousX, previousY], [summitX, summitY], [summitX, baseY], [previousX, baseY]], mixHex(color, "#d8d6c9", lightAmount));
      fillPoly(ctx, [[summitX, summitY], [nextX, nextY], [nextX, baseY], [summitX, baseY]], mixHex(color, "#1c2934", shadeAmount));

      if (detail > 0) {
        const cluster = Math.max(2, Math.round(width * (detail === 1 ? 0.008 : 0.014)));
        const leftFaceX = previousX + (summitX - previousX) * 0.58;
        const leftFaceY = previousY + (summitY - previousY) * 0.58;
        const rightFaceX = summitX + (nextX - summitX) * 0.48;
        const rightFaceY = summitY + (nextY - summitY) * 0.48;
        const rockLight = mixHex(color, "#d5c8a6", detail === 1 ? 0.16 : 0.27);
        const rockMid = mixHex(color, "#697274", 0.23);
        const rockShade = mixHex(color, "#1d2933", detail === 1 ? 0.18 : 0.36);

        pixel(ctx, leftFaceX - cluster, leftFaceY, cluster * 1.5, Math.max(2, cluster * 0.3), rockLight);
        pixel(ctx, leftFaceX + cluster * 0.25, leftFaceY + cluster * 0.7, cluster, 2, rockMid);
        pixel(ctx, rightFaceX, rightFaceY, cluster * 1.35, 2, rockShade);
        pixel(ctx, rightFaceX + cluster * 0.6, rightFaceY + 3, 1, Math.max(3, cluster * 0.75), rockShade);
        pixel(ctx, rightFaceX + cluster * 1.1, rightFaceY + cluster * 0.9, cluster * 0.9, 2, rockMid);
      }

      if (snow && rise >= 0.76) {
        const shoulderY = baseY - rise * height * 0.73;
        const capSide = width * (rise > 0.84 ? 0.012 : 0.009);
        fillPoly(ctx, [
          [summitX - capSide * 1.8, shoulderY],
          [summitX - capSide * 1.2, shoulderY - height * 0.04],
          [summitX - capSide * 0.78, shoulderY + height * 0.07],
          [summitX - capSide * 0.33, summitY + height * 0.08],
          [summitX, summitY],
          [summitX + capSide * 0.35, summitY + height * 0.14],
          [summitX + capSide * 0.76, shoulderY - height * 0.12],
          [summitX + capSide * 1.08, shoulderY + height * 0.04],
          [summitX + capSide * 1.7, shoulderY],
        ], "#d8ded8");
        pixel(ctx, summitX - capSide * 1.1, shoulderY + 2, capSide * 0.8, 2, "#b8c7c8");
      }
    } else if (isValley && detail > 0) {
      const valleyX = x + position * width;
      const valleyY = baseY - rise * height;
      pixel(ctx, valleyX - 3, valleyY + 1, 6, 2, mixHex(color, "#18252f", 0.32));
      if (detail === 2 && !snow) {
        const scrub = mixHex(color, "#52704c", 0.38);
        pixel(ctx, valleyX - width * 0.035, valleyY - height * 0.1, width * 0.025, 2, scrub);
        pixel(ctx, valleyX + width * 0.012, valleyY - height * 0.17, width * 0.02, 2, scrub);
      }
    }
  });
}

function drawHillRange(ctx, x, baseY, width, height, color) {
  const points = HILL_PROFILE.map(([position, rise]) => [x + position * width, baseY - rise * height]);
  fillPoly(ctx, [[x, baseY], ...points, [x + width, baseY]], color);
}

function drawTree(ctx, x, baseY, scale, palette, pine = true) {
  const unit = scale;
  pixel(ctx, x + 9 * unit, baseY - 11 * unit, 5 * unit, 12 * unit, "#574638");
  if (pine) {
    pixel(ctx, x + 4 * unit, baseY - 20 * unit, 15 * unit, 5 * unit, palette[0]);
    pixel(ctx, x + 6 * unit, baseY - 28 * unit, 11 * unit, 7 * unit, palette[1]);
    pixel(ctx, x + 8 * unit, baseY - 35 * unit, 7 * unit, 7 * unit, palette[2]);
    pixel(ctx, x + 10 * unit, baseY - 40 * unit, 3 * unit, 6 * unit, palette[2]);
    pixel(ctx, x + 8 * unit, baseY - 25 * unit, 3 * unit, 3 * unit, "#7d9662");
  } else {
    pixel(ctx, x + 4 * unit, baseY - 30 * unit, 16 * unit, 12 * unit, palette[0]);
    pixel(ctx, x + 1 * unit, baseY - 24 * unit, 22 * unit, 9 * unit, palette[1]);
    pixel(ctx, x + 6 * unit, baseY - 35 * unit, 12 * unit, 9 * unit, palette[2]);
    pixel(ctx, x + 3 * unit, baseY - 18 * unit, 6 * unit, 4 * unit, palette[2]);
  }
}

function drawMushroom(ctx, x, y, color, scale = 1) {
  pixel(ctx, x + 4 * scale, y + 5 * scale, 3 * scale, 6 * scale, "#e0d4b0");
  pixel(ctx, x + 1 * scale, y + 2 * scale, 9 * scale, 4 * scale, color);
  pixel(ctx, x + 3 * scale, y, 5 * scale, 3 * scale, color);
  pixel(ctx, x + 3 * scale, y + 3 * scale, scale, scale, "#f1d8aa");
  pixel(ctx, x + 7 * scale, y + 4 * scale, scale, scale, "#f1d8aa");
}

function drawHouse(ctx, x, baseY, scale, wall = "#a99875", roof = "#704d45") {
  pixel(ctx, x + 4 * scale, baseY - 20 * scale, 28 * scale, 20 * scale, wall);
  pixel(ctx, x + 1 * scale, baseY - 23 * scale, 34 * scale, 5 * scale, roof);
  pixel(ctx, x + 5 * scale, baseY - 28 * scale, 26 * scale, 6 * scale, roof);
  pixel(ctx, x + 11 * scale, baseY - 33 * scale, 14 * scale, 6 * scale, roof);
  pixel(ctx, x + 17 * scale, baseY - 39 * scale, 3 * scale, 7 * scale, roof);
  pixel(ctx, x + 14 * scale, baseY - 11 * scale, 7 * scale, 11 * scale, "#493d38");
  pixel(ctx, x + 7 * scale, baseY - 16 * scale, 5 * scale, 5 * scale, "#d9b46f");
  pixel(ctx, x + 25 * scale, baseY - 16 * scale, 5 * scale, 5 * scale, "#d9b46f");
  pixel(ctx, x + 9 * scale, baseY - 16 * scale, scale, 5 * scale, "#594a3d");
  pixel(ctx, x + 27 * scale, baseY - 16 * scale, scale, 5 * scale, "#594a3d");
  pixel(ctx, x + 1 * scale, baseY - 1 * scale, 34 * scale, 2 * scale, "#574739");
}

function drawRuin(ctx, x, baseY, scale = 1) {
  const stone = "#8b8b7b";
  pixel(ctx, x, baseY - 34 * scale, 7 * scale, 35 * scale, stone);
  pixel(ctx, x + 48 * scale, baseY - 27 * scale, 7 * scale, 28 * scale, stone);
  pixel(ctx, x - 3 * scale, baseY - 37 * scale, 13 * scale, 6 * scale, "#a3a18b");
  pixel(ctx, x + 44 * scale, baseY - 31 * scale, 14 * scale, 6 * scale, "#a3a18b");
  pixel(ctx, x + 7 * scale, baseY - 35 * scale, 13 * scale, 5 * scale, stone);
  pixel(ctx, x + 20 * scale, baseY - 31 * scale, 13 * scale, 5 * scale, stone);
  pixel(ctx, x + 33 * scale, baseY - 35 * scale, 12 * scale, 5 * scale, stone);
  pixel(ctx, x + 11 * scale, baseY - 20 * scale, 6 * scale, 2 * scale, "#626c68");
  pixel(ctx, x + 49 * scale, baseY - 17 * scale, 6 * scale, 2 * scale, "#626c68");
}

function drawTower(ctx, x, baseY, scale = 1) {
  pixel(ctx, x + 8 * scale, baseY - 48 * scale, 42 * scale, 49 * scale, "#665c79");
  pixel(ctx, x + 4 * scale, baseY - 52 * scale, 50 * scale, 6 * scale, "#9886a2");
  pixel(ctx, x + 11 * scale, baseY - 60 * scale, 36 * scale, 9 * scale, "#6e627f");
  pixel(ctx, x + 17 * scale, baseY - 68 * scale, 24 * scale, 9 * scale, "#82708f");
  pixel(ctx, x + 24 * scale, baseY - 79 * scale, 10 * scale, 12 * scale, "#594f72");
  pixel(ctx, x + 15 * scale, baseY - 37 * scale, 7 * scale, 11 * scale, "#e8c57d");
  pixel(ctx, x + 35 * scale, baseY - 37 * scale, 7 * scale, 11 * scale, "#e8c57d");
  pixel(ctx, x + 25 * scale, baseY - 17 * scale, 9 * scale, 17 * scale, "#3e3a4a");
  pixel(ctx, x + 28 * scale, baseY - 75 * scale, 2 * scale, 4 * scale, "#e7d7a2");
}

function drawCastle(ctx, x, baseY, scale = 1) {
  const stone = "#73778a";
  pixel(ctx, x + 12 * scale, baseY - 32 * scale, 66 * scale, 33 * scale, stone);
  pixel(ctx, x, baseY - 50 * scale, 22 * scale, 51 * scale, "#85879a");
  pixel(ctx, x + 68 * scale, baseY - 45 * scale, 20 * scale, 46 * scale, "#85879a");
  pixel(ctx, x - 3 * scale, baseY - 54 * scale, 28 * scale, 7 * scale, "#9c9aaa");
  pixel(ctx, x + 65 * scale, baseY - 50 * scale, 26 * scale, 7 * scale, "#9c9aaa");
  for (let i = 0; i < 4; i++) pixel(ctx, x + (8 + i * 20) * scale, baseY - 40 * scale, 6 * scale, 9 * scale, "#ecc77a");
  pixel(ctx, x + 38 * scale, baseY - 20 * scale, 14 * scale, 21 * scale, "#3d3941");
}

function drawCampfire(ctx, x, baseY, beat = 0) {
  pixel(ctx, x + 2, baseY - 2, 22, 4, "#57463b");
  pixel(ctx, x + 7, baseY - 5, 14, 3, "#78513c");
  pixel(ctx, x + 9, baseY - 11 - beat, 10, 9 + beat, "#e38c48");
  pixel(ctx, x + 12, baseY - 15 - beat, 5, 8 + beat, "#f4ca69");
  pixel(ctx, x + 13, baseY - 10, 3, 5, "#fff0ad");
}

function drawAreaObjects(ctx, cameraX, width, groundY, reducedDetails) {
  const first = Math.max(0, Math.floor(cameraX / AREA_WIDTH) - 1);
  const last = Math.min(AREAS.length - 1, Math.floor((cameraX + width) / AREA_WIDTH) + 1);
  for (let area = first; area <= last; area++) {
    const start = area * AREA_WIDTH;
    const xAt = (offset) => Math.round(start + offset - cameraX);
    const base = groundY - 9;
    if (area === 0) {
      [90, 265, 480, 660].forEach((offset, i) => drawTree(ctx, xAt(offset), base + (i % 2) * 3, 0.82 + (i % 3) * 0.12, ["#24463f", "#31594b", "#426a50"]));
      drawHouse(ctx, xAt(550), base, 0.6, "#94876d", "#664943");
    } else if (area === 1) {
      [110, 360, 620].forEach((offset, i) => drawTree(ctx, xAt(offset), base, 1.22 + i * 0.12, ["#283f50", "#3f5a64", "#536e70"], false));
      if (!reducedDetails) {
        drawMushroom(ctx, xAt(245), base - 5, "#bc7773", 1.2);
        drawMushroom(ctx, xAt(285), base - 2, "#d9a65e", 0.9);
        pixel(ctx, xAt(465), base - 4, 120, 4, "#725f4a");
        pixel(ctx, xAt(465), base - 12, 4, 10, "#715d4a");
        pixel(ctx, xAt(580), base - 12, 4, 10, "#715d4a");
        pixel(ctx, xAt(466), base - 2, 118, 2, "#b38c5c");
      }
    } else if (area === 2) {
      drawRuin(ctx, xAt(145), base, 0.9);
      drawRuin(ctx, xAt(470), base + 2, 0.72);
      pixel(ctx, xAt(300), base - 8, 38, 8, "#8b8b7b");
      pixel(ctx, xAt(313), base - 24, 9, 18, "#8b8b7b");
      pixel(ctx, xAt(326), base - 17, 8, 11, "#8b8b7b");
    } else if (area === 3) {
      drawHouse(ctx, xAt(105), base, 0.72, "#a99875", "#714e45");
      drawHouse(ctx, xAt(365), base + 2, 0.86, "#b0a17e", "#596254");
      drawHouse(ctx, xAt(625), base, 0.64, "#9b8c70", "#76554a");
      if (!reducedDetails) {
        [220, 510].forEach((offset) => {
          const x = xAt(offset);
          pixel(ctx, x, base - 27, 3, 25, "#57463b");
          pixel(ctx, x - 5, base - 29, 13, 3, "#8e6946");
          pixel(ctx, x - 2, base - 24, 7, 8, "#e0b467");
        });
        pixel(ctx, xAt(45), base - 2, 620, 3, "#6d513d");
        for (let fence = 0; fence < 8; fence++) pixel(ctx, xAt(55 + fence * 75), base - 14, 3, 14, "#806348");
      }
    } else if (area === 4) {
      drawTower(ctx, xAt(338), base, 1.05);
      if (!reducedDetails) {
        [[260, -58], [540, -73], [605, -45]].forEach(([offset, rise], i) => {
          const crystalX = xAt(offset);
          pixel(ctx, crystalX, base + rise, 3, 8, i % 2 ? "#c79ad0" : "#9dd2db");
          pixel(ctx, crystalX - 3, base + rise + 3, 9, 3, i % 2 ? "#9b79bb" : "#79aebe");
        });
      }
    } else {
      drawCastle(ctx, xAt(420), base, 0.9);
      drawCampfire(ctx, xAt(600), base, 0);
      pixel(ctx, xAt(555), base - 3, 22, 3, "#584a42");
    }
  }
}

function drawBardScene(ctx, x, groundY, direction, moving, frame, idleBeat, scale) {
  drawBard(ctx, x, groundY, direction, moving ? "walk" : "idle", frame, idleBeat, scale);
}

function getWorldX(scrollY, waypoints) {
  if (waypoints.length < 2) return 64;
  if (scrollY <= waypoints[0].scroll) return waypoints[0].worldX;
  for (let i = 1; i < waypoints.length; i++) {
    const next = waypoints[i];
    if (scrollY <= next.scroll) {
      const previous = waypoints[i - 1];
      const span = Math.max(1, next.scroll - previous.scroll);
      const t = Math.max(0, Math.min(1, (scrollY - previous.scroll) / span));
      return previous.worldX + (next.worldX - previous.worldX) * t;
    }
  }
  return waypoints.at(-1).worldX;
}

export default function AdventureWorld() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false, desynchronized: true });
    if (!canvas || !context) return undefined;

    let viewportWidth = 1;
    let viewportHeight = 1;
    let waypoints = [];
    let targetWorldX = 64;
    let currentWorldX = 64;
    let cameraX = 0;
    let direction = 1;
    let lastFrame = 0;
    let lastScrollAt = 0;
    let animationFrame = null;
    const idleBeat = 0;
    let reducedDetails = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const readWaypoints = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const sections = SECTION_IDS.map((id, index) => {
        const section = document.getElementById(id);
        const scroll = section ? section.getBoundingClientRect().top + window.scrollY : maxScroll * index / (SECTION_IDS.length - 1);
        return { scroll, worldX: 64 + index * AREA_WIDTH };
      }).filter((point) => Number.isFinite(point.scroll)).sort((a, b) => a.scroll - b.scroll);
      const finalPoint = { scroll: maxScroll, worldX: 64 + (AREAS.length - 1) * AREA_WIDTH + AREA_WIDTH * 0.74 };
      if (!sections.length || sections.at(-1).scroll < maxScroll) sections.push(finalPoint);
      else sections[sections.length - 1] = { ...sections.at(-1), ...finalPoint };
      waypoints = sections;
      targetWorldX = getWorldX(window.scrollY, waypoints);
      if (reducedMotion.matches) currentWorldX = targetWorldX;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      viewportWidth = Math.max(1, Math.ceil(bounds.width / 3));
      viewportHeight = Math.max(1, Math.ceil(bounds.height / 3));
      reducedDetails = viewportWidth < 155;
      canvas.width = viewportWidth;
      canvas.height = viewportHeight;
      context.imageSmoothingEnabled = false;
      readWaypoints();
      requestRender();
    };

    const render = (time = performance.now()) => {
      animationFrame = null;
      if (document.visibilityState !== "visible") return;
      const reduced = reducedMotion.matches;
      const delta = Math.min((time - (lastFrame || time)) / 1000, 0.06);
      lastFrame = time;
      if (reduced) currentWorldX = targetWorldX;
      else currentWorldX += (targetWorldX - currentWorldX) * (1 - Math.exp(-delta * 7));

      const cameraFollowOffset = viewportWidth * 0.42;
      const maxCamera = Math.max(0, 64 + (AREAS.length - 1) * AREA_WIDTH + AREA_WIDTH * 0.74 - cameraFollowOffset);
      const targetCamera = Math.max(0, Math.min(maxCamera, currentWorldX - cameraFollowOffset));
      if (reduced) cameraX = targetCamera;
      else cameraX += (targetCamera - cameraX) * (1 - Math.exp(-delta * 7.5));

      const centerTheme = themeAt(currentWorldX);
      const skyGradient = context.createLinearGradient(0, 0, 0, viewportHeight);
      skyGradient.addColorStop(0, centerTheme.sky[0]);
      skyGradient.addColorStop(0.63, centerTheme.sky[1]);
      skyGradient.addColorStop(1, centerTheme.far);
      context.fillStyle = skyGradient;
      context.fillRect(0, 0, viewportWidth, viewportHeight);

      const groundY = viewportHeight - 12;
      const cloudStart = Math.floor((cameraX * 0.1) / 245) - 1;
      const cloudEnd = Math.ceil((cameraX * 0.1 + viewportWidth) / 245) + 1;
      for (let i = cloudStart; i <= cloudEnd; i++) {
        drawCloud(context, i * 245 - cameraX * 0.1, 24 + ((i * 37) % 38), Math.abs(i) % 2);
      }

      const distantStart = Math.max(0, Math.floor((cameraX * 0.1) / AREA_WIDTH) - 1);
      const distantEnd = Math.min(AREAS.length - 1, Math.floor((cameraX * 0.1 + viewportWidth) / AREA_WIDTH) + 1);
      for (let area = distantStart; area <= distantEnd; area++) {
        const x = area * AREA_WIDTH - cameraX * 0.1;
        const hazeColor = mixHex(AREAS[area].far, centerTheme.sky[1], 0.48);
        drawMountainRange(context, x, groundY - 112, AREA_WIDTH + 8, 66, hazeColor, area + 2, 0, false);
      }

      const mainStart = Math.max(0, Math.floor((cameraX * 0.22) / AREA_WIDTH) - 1);
      const mainEnd = Math.min(AREAS.length - 1, Math.floor((cameraX * 0.22 + viewportWidth) / AREA_WIDTH) + 1);
      for (let area = mainStart; area <= mainEnd; area++) {
        const x = area * AREA_WIDTH - cameraX * 0.22;
        drawMountainRange(context, x, groundY - 64, AREA_WIDTH + 8, 84, AREAS[area].far, area, 2, true);
        drawHillRange(context, x, groundY - 27, AREA_WIDTH + 8, 28, AREAS[area].hills);
      }

      const foregroundStart = Math.max(0, Math.floor((cameraX * 0.38) / AREA_WIDTH) - 1);
      const foregroundEnd = Math.min(AREAS.length - 1, Math.floor((cameraX * 0.38 + viewportWidth) / AREA_WIDTH) + 1);
      for (let area = foregroundStart; area <= foregroundEnd; area++) {
        const x = area * AREA_WIDTH - cameraX * 0.38;
        const rockColor = mixHex(AREAS[area].hills, "#26383c", 0.38);
        drawMountainRange(context, x, groundY - 4, AREA_WIDTH + 8, 52, rockColor, area + 4, 2, false, FOREGROUND_PROFILE);
      }

      drawAreaObjects(context, cameraX, viewportWidth, groundY, reducedDetails);

      const groundGradient = context.createLinearGradient(0, groundY - 16, 0, viewportHeight);
      groundGradient.addColorStop(0, centerTheme.ground);
      groundGradient.addColorStop(1, mixHex(centerTheme.ground, "#26383c", 0.46));
      context.fillStyle = groundGradient;
      context.fillRect(0, groundY - 10, viewportWidth, viewportHeight - groundY + 10);
      pixel(context, 0, groundY - 11, viewportWidth, 4, "#82925e");
      pixel(context, 0, groundY - 7, viewportWidth, 3, "#b39a68");
      pixel(context, 0, groundY - 4, viewportWidth, 27, "#806849");
      pixel(context, 0, groundY - 4, viewportWidth, 3, "#9a8059");

      const grassStart = Math.floor(cameraX / 47) - 1;
      const grassEnd = Math.ceil((cameraX + viewportWidth) / 47) + 1;
      for (let i = grassStart; i <= grassEnd; i++) {
        const x = i * 47 - cameraX;
        pixel(context, x, groundY - 14 - (i % 3) * 2, 2, 5, "#a0a96a");
        pixel(context, x + 4, groundY - 12, 2, 4, "#708b55");
        if (!reducedDetails && i % 4 === 0) pixel(context, x + 8, groundY + 12, 2, 2, "#d5bd79");
      }

      const playerScreenBias = viewportWidth < 230 ? 45 : 0;
      const characterScale = reducedDetails ? 0.72 : 0.84;
      const playerX = currentWorldX - cameraX - (BARD_WIDTH / 2) * characterScale - playerScreenBias;
      const isMoving = !reduced && (Math.abs(targetWorldX - currentWorldX) > 0.35 || time - lastScrollAt < 110);
      const frameIndex = Math.floor(time / 190) % LIMB_FRAMES.length;
      drawBardScene(context, playerX, groundY + 1, direction, isMoving, frameIndex, idleBeat, characterScale);

      const stillMoving = Math.abs(targetWorldX - currentWorldX) > 0.22 || Math.abs(targetCamera - cameraX) > 0.25;
      if (!reduced && stillMoving) {
        requestRender();
      }
    };

    function requestRender() {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(render);
    }

    const onScroll = () => {
      const nextTarget = getWorldX(window.scrollY, waypoints);
      const movement = nextTarget - targetWorldX;
      if (Math.abs(movement) > 0.01) direction = Math.sign(movement);
      targetWorldX = nextTarget;
      lastScrollAt = performance.now();
      if (reducedMotion.matches) currentWorldX = targetWorldX;
      requestRender();
    };

    const onMotionChange = () => {
      if (reducedMotion.matches) {
        currentWorldX = targetWorldX;
      }
      requestRender();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        lastFrame = 0;
        requestRender();
      } else if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener?.("change", onMotionChange);
    resize();
    onScroll();

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener?.("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="adventure-world-canvas absolute inset-0 h-full w-full" aria-hidden="true" />;
}
