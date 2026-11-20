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

function stableNoise(index, seed = 0) {
  let value = Math.imul(index ^ seed, 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
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

function drawMountainRange(ctx, x, baseY, width, height, color, profileIndex, detail = 2, snow = true) {
  const profile = MOUNTAIN_PROFILES[profileIndex % MOUNTAIN_PROFILES.length];
  const peakPoints = profile.map(([position, rise]) => [x + position * width, baseY - rise * height]);
  const terrainBottom = ctx.canvas.height;
  fillPoly(ctx, [[x, terrainBottom], ...peakPoints, [x + width, terrainBottom]], color);

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
      const leftDx = summitX - previousX;
      const leftDy = summitY - previousY;
      const rightDx = nextX - summitX;
      const rightDy = nextY - summitY;
      fillPoly(ctx, [
        [previousX + leftDx * 0.08, previousY + leftDy * 0.08],
        [summitX, summitY],
        [previousX + leftDx * 0.6, previousY + leftDy * 0.6],
        [previousX + leftDx * 0.26, previousY + leftDy * 0.47],
      ], mixHex(color, "#d8d6c9", lightAmount));
      fillPoly(ctx, [
        [summitX, summitY],
        [summitX + rightDx * 0.86, summitY + rightDy * 0.86],
        [summitX + rightDx * 0.63, summitY + rightDy * 0.63],
        [summitX + rightDx * 0.22, summitY + rightDy * 0.42],
      ], mixHex(color, "#1c2934", shadeAmount));

      if (detail > 0) {
        const cluster = Math.max(2, Math.round(width * (detail === 1 ? 0.004 : 0.006)));
        const leftFaceX = previousX + (summitX - previousX) * 0.58;
        const leftFaceY = previousY + (summitY - previousY) * 0.58;
        const rightFaceX = summitX + (nextX - summitX) * 0.48;
        const rightFaceY = summitY + (nextY - summitY) * 0.48;
        const rockLight = mixHex(color, "#d5c8a6", detail === 1 ? 0.16 : 0.27);
        const rockMid = mixHex(color, "#697274", 0.23);
        const rockShade = mixHex(color, "#1d2933", detail === 1 ? 0.18 : 0.36);

        pixel(ctx, leftFaceX - cluster, leftFaceY, cluster * 1.5, Math.max(2, cluster * 0.3), rockLight);
        pixel(ctx, leftFaceX + cluster * 0.25, leftFaceY + cluster * 0.7, cluster, 2, rockMid);
        const ledgeX = previousX + (summitX - previousX) * 0.7;
        const ledgeY = previousY + (summitY - previousY) * 0.7;
        pixel(ctx, ledgeX, ledgeY, cluster * 1.6, 2, rockLight);
        pixel(ctx, ledgeX + cluster * 0.25, ledgeY + 2, cluster, 1, rockMid);
        pixel(ctx, rightFaceX, rightFaceY, cluster * 1.35, 2, rockShade);
        pixel(ctx, rightFaceX + cluster * 0.6, rightFaceY + 3, 1, Math.max(3, cluster * 0.75), rockShade);
        pixel(ctx, rightFaceX + cluster * 1.1, rightFaceY + cluster * 0.9, cluster * 0.9, 2, rockMid);
      }

      if (snow && rise >= 0.82) {
        const shoulderY = baseY - rise * height * 0.82;
        const capSide = width * (rise > 0.87 ? 0.008 : 0.006);
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
        ], "#cbd5d1");
        pixel(ctx, summitX - capSide * 1.1, shoulderY + 2, capSide * 0.8, 2, "#aebfc0");
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
  fillPoly(ctx, [[x, ctx.canvas.height], ...points, [x + width, ctx.canvas.height]], color);
}

function drawPineTier(ctx, centerX, topY, width, unit, palette, variant) {
  const rows = [0.28, 0.44, 0.62, 0.79, 0.94, 1, 0.9, 0.73, 0.5];
  rows.forEach((proportion, row) => {
    const rowWidth = width * proportion;
    const uneven = ((row + variant) % 3 - 1) * unit * 0.55;
    const left = centerX - rowWidth / 2 + uneven;
    const y = topY + row * unit * 1.65;
    pixel(ctx, left, y + unit * 0.5, rowWidth, unit * 1.8, palette[0]);
    pixel(ctx, left + unit, y, Math.max(unit, rowWidth - unit * 2), unit * 1.6, palette[1]);
    if (row < 6) {
      const highlightX = left + rowWidth * (0.16 + (variant % 2) * 0.08);
      pixel(ctx, highlightX, y, Math.max(unit, rowWidth * 0.28), unit, palette[2]);
    }
  });
}

function drawLeafMass(ctx, centerX, topY, width, unit, palette, variant = 0) {
  const rows = [0.38, 0.63, 0.84, 1, 0.94, 0.76, 0.51];
  rows.forEach((proportion, row) => {
    const rowWidth = width * proportion;
    const irregular = ((row * 2 + variant) % 3 - 1) * unit * 0.65;
    const left = centerX - rowWidth / 2 + irregular;
    const y = topY + row * unit * 1.8;
    pixel(ctx, left, y + unit * 0.5, rowWidth, unit * 2, palette[0]);
    pixel(ctx, left + unit, y, Math.max(unit, rowWidth - unit * 2), unit * 1.6, palette[1]);
    if (row < 5) {
      const shineWidth = Math.max(unit, rowWidth * (row % 2 ? 0.22 : 0.32));
      pixel(ctx, left + rowWidth * 0.17, y, shineWidth, unit, palette[2]);
    }
    if (row === 3 || row === 4) {
      pixel(ctx, left + rowWidth * 0.66, y + unit, rowWidth * 0.2, unit, palette[0]);
    }
  });
}

function drawTree(ctx, x, baseY, scale, palette, pine = true, variant = 0) {
  const unit = scale;
  const trunkX = x + (pine ? 10 : 10 + (variant % 2)) * unit;
  const trunkWidth = (pine ? 4 : 5) * unit;
  const crownHeight = (pine ? 43 : 39 + (variant % 3) * 3) * unit;
  const crownTop = baseY - crownHeight;
  const bark = "#574638";
  const barkLight = "#866348";

  pixel(ctx, trunkX, crownTop + crownHeight * (pine ? 0.32 : 0.48), trunkWidth, baseY - (crownTop + crownHeight * (pine ? 0.32 : 0.48)), bark);
  pixel(ctx, trunkX + unit, crownTop + crownHeight * (pine ? 0.36 : 0.52), unit, baseY - (crownTop + crownHeight * (pine ? 0.36 : 0.52)), barkLight);

  if (pine) {
    const centerX = trunkX + trunkWidth / 2;
    const tierGap = 10 * unit;
    const tierWidths = [13, 18 + (variant % 2) * 2, 23 + (variant % 3) * 2];
    for (let tier = 0; tier < 3; tier++) {
      const tierTop = crownTop + tier * tierGap;
      const tierWidth = tierWidths[tier] * unit;
      const branchY = tierTop + 9 * unit;
      pixel(ctx, centerX - tierWidth * 0.34, branchY, tierWidth * 0.34, unit, barkLight);
      pixel(ctx, centerX, branchY + unit, tierWidth * 0.37, unit, bark);
      drawPineTier(ctx, centerX, tierTop, tierWidth, unit, palette, variant + tier);
    }
    pixel(ctx, centerX - unit, baseY - 10 * unit, trunkWidth + 2 * unit, 2 * unit, barkLight);
    return;
  }

  const centerX = trunkX + trunkWidth / 2;
  const branchStart = crownTop + crownHeight * 0.78;
  pixel(ctx, centerX - 6 * unit, branchStart + 7 * unit, 7 * unit, 2 * unit, barkLight);
  pixel(ctx, centerX - 6 * unit, branchStart + 3 * unit, 2 * unit, 5 * unit, bark);
  pixel(ctx, centerX + 2 * unit, branchStart + 4 * unit, 7 * unit, 2 * unit, barkLight);
  pixel(ctx, centerX + 7 * unit, branchStart, 2 * unit, 6 * unit, bark);
  pixel(ctx, centerX - 2 * unit, crownTop + crownHeight * 0.48, 2 * unit, 7 * unit, barkLight);

  const lobes = [
    [-8, 10, 15, 0], [-1, 2, 18, 1], [8, 9, 16, 2],
    [-7, 19, 17, 1], [2, 20, 18, 0], [10, 18, 14, 2],
  ];
  lobes.forEach(([offsetX, offsetY, width, lobeVariant], index) => {
    drawLeafMass(ctx, centerX + (offsetX + ((variant + index) % 2)) * unit,
      crownTop + (offsetY + ((variant + index) % 3 === 0 ? 1 : 0)) * unit,
      width * unit, unit, palette, variant + lobeVariant);
  });
}

function drawGrassTuft(ctx, centerX, surfaceY, scale, colors, variant = 0) {
  const unit = scale;
  pixel(ctx, centerX - 5 * unit, surfaceY - unit, 12 * unit, 2 * unit, colors[0]);
  pixel(ctx, centerX - 3 * unit, surfaceY - 2 * unit, 8 * unit, unit, colors[1]);
  const blades = [
    [-4, 5 + (variant % 2), -1, 2], [-2, 3 + (variant % 3), -1, 1],
    [0, 6, 0, 2], [2, 4 + ((variant + 1) % 3), 1, 1], [4, 3 + (variant % 2), 1, 2],
  ];
  blades.forEach(([offset, height, bend, tone], index) => {
    const x = centerX + offset * unit;
    const bladeColor = tone === 2 ? colors[2] : colors[1];
    pixel(ctx, x, surfaceY - height * unit, 1.5 * unit, height * unit, bladeColor);
    if (bend) pixel(ctx, x + bend * unit, surfaceY - (height + 1) * unit, 1.5 * unit, unit, index % 2 ? colors[2] : colors[1]);
  });
}

function drawGround(ctx, cameraX, width, viewportHeight, groundY, groundColor, reducedDetails) {
  const surfaceY = groundY - 10;
  const groundGradient = ctx.createLinearGradient(0, surfaceY, 0, viewportHeight);
  groundGradient.addColorStop(0, mixHex(groundColor, "#a39162", 0.2));
  groundGradient.addColorStop(1, mixHex(groundColor, "#332f32", 0.42));
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, surfaceY, width, viewportHeight - surfaceY);
  pixel(ctx, 0, surfaceY, width, 2, mixHex(groundColor, "#89956a", 0.38));

  const grassColors = [
    mixHex(groundColor, "#283c35", 0.45),
    mixHex(groundColor, "#78965c", 0.46),
    mixHex(groundColor, "#b3ad68", 0.42),
  ];
  const firstTuft = Math.floor(cameraX / 39) - 1;
  const lastTuft = Math.ceil((cameraX + width) / 39) + 1;
  for (let index = firstTuft; index <= lastTuft; index++) {
    const noise = stableNoise(index, 41);
    const x = index * 39 + 7 + noise * 18 - cameraX;
    const surface = surfaceY + 1 + (stableNoise(index, 12) > 0.72 ? 1 : 0);
    if (noise > 0.16) drawGrassTuft(ctx, x, surface, 0.72 + stableNoise(index, 72) * 0.34, grassColors, index);

    if (reducedDetails) continue;
    if (noise > 0.78) {
      const shrubX = x + 13;
      const shrubY = surfaceY - 2;
      const smallPalette = [grassColors[0], grassColors[1], grassColors[2]];
      drawLeafMass(ctx, shrubX - 3, shrubY - 4, 8, 0.7, smallPalette, index);
      drawLeafMass(ctx, shrubX + 3, shrubY - 3, 8, 0.7, smallPalette, index + 1);
    } else if (noise < 0.08) {
      pixel(ctx, x + 1, surfaceY + 7, 4, 2, mixHex(groundColor, "#aa8960", 0.28));
      pixel(ctx, x + 4, surfaceY + 9, 3, 1, mixHex(groundColor, "#c0a171", 0.22));
    }

    const detailRoll = stableNoise(index, 93);
    if (detailRoll < 0.18) {
      const rockX = x + (detailRoll > 0.09 ? -9 : 10);
      const rockColor = mixHex(groundColor, "#c1b28a", 0.2);
      pixel(ctx, rockX, surfaceY + 5, 4, 2, mixHex(rockColor, "#383a39", 0.24));
      pixel(ctx, rockX + 1, surfaceY + 4, 2, 1, rockColor);
    } else if (detailRoll > 0.88) {
      pixel(ctx, x + 8, surfaceY + 5, 2, 3, "#728e56");
      pixel(ctx, x + 7, surfaceY + 4, 2, 2, "#d3b56c");
    } else if (detailRoll < 0.35) {
      pixel(ctx, x + 8, surfaceY + 8, 4, 1, mixHex(groundColor, "#b29468", 0.2));
      pixel(ctx, x + 11, surfaceY + 9, 3, 1, mixHex(groundColor, "#6d5949", 0.18));
    }
  }
}

function drawMushroom(ctx, x, y, color, scale = 1) {
  pixel(ctx, x + 4 * scale, y + 5 * scale, 3 * scale, 6 * scale, "#e0d4b0");
  pixel(ctx, x + 1 * scale, y + 2 * scale, 9 * scale, 4 * scale, color);
  pixel(ctx, x + 3 * scale, y, 5 * scale, 3 * scale, color);
  pixel(ctx, x + 3 * scale, y + 3 * scale, scale, scale, "#f1d8aa");
  pixel(ctx, x + 7 * scale, y + 4 * scale, scale, scale, "#f1d8aa");
}

const STONE_PALETTE = {
  outline: "#383b42",
  mortar: "#53565c",
  shadow: "#62666d",
  base: "#81858a",
  light: "#a9a598",
  moss: "#657650",
};

function drawMasonry(ctx, x, y, width, height, scale, palette = STONE_PALETTE, variant = 0) {
  const unit = scale;
  pixel(ctx, x - unit, y - unit, width + 2 * unit, height + 2 * unit, palette.outline);
  pixel(ctx, x, y, width, height, palette.base);
  pixel(ctx, x + width - 4 * unit, y + unit, 4 * unit, height - unit, palette.shadow);
  pixel(ctx, x + unit, y + unit, width - 6 * unit, 2 * unit, palette.light);

  const courseHeight = 7 * unit;
  const courses = Math.floor(height / courseHeight);
  for (let row = 1; row < courses; row++) {
    const courseY = y + row * courseHeight;
    pixel(ctx, x + unit, courseY, width - 5 * unit, unit, palette.mortar);
    const stagger = row % 2 ? 6 : 0;
    for (let col = 0; col < Math.ceil(width / (12 * unit)); col++) {
      const seamX = x + (stagger + col * 12) * unit;
      if (seamX > x + 3 * unit && seamX < x + width - 5 * unit) {
        pixel(ctx, seamX, courseY + unit, unit, 5 * unit, palette.mortar);
        if ((row + col + variant) % 3 === 0) {
          pixel(ctx, seamX + unit, courseY + unit, 3 * unit, unit, palette.light);
        }
      }
    }
    if ((row + variant) % 2 === 0) {
      pixel(ctx, x + width * 0.2, courseY + unit, width * 0.18, unit, palette.light);
    }
  }
}

function drawPitchedRoof(ctx, x, eavesY, width, scale, palette) {
  const unit = scale;
  const centerX = x + width / 2;
  const roofHeight = 18 * unit;
  const peakY = eavesY - roofHeight;
  fillPoly(ctx, [
    [x - 3 * unit, eavesY], [centerX, peakY], [x + width + 3 * unit, eavesY],
    [x + width + 2 * unit, eavesY + 4 * unit], [centerX, peakY + 5 * unit], [x - 2 * unit, eavesY + 4 * unit],
  ], palette.outline);
  fillPoly(ctx, [
    [x - unit, eavesY], [centerX, peakY + 2 * unit], [centerX, peakY + 5 * unit], [x + 2 * unit, eavesY + 3 * unit],
  ], palette.roofLight);
  fillPoly(ctx, [
    [centerX, peakY + 2 * unit], [x + width + unit, eavesY], [x + width - 2 * unit, eavesY + 3 * unit], [centerX, peakY + 5 * unit],
  ], palette.roof);
  pixel(ctx, x - 3 * unit, eavesY + 2 * unit, width + 6 * unit, 2 * unit, palette.roofShade);

  for (let row = 1; row <= 5; row++) {
    const t = row / 6;
    const half = width * t * 0.46;
    const tileY = peakY + roofHeight * t;
    pixel(ctx, centerX - half, tileY, half * 0.72, unit, row % 2 ? palette.roofTile : palette.roofLight);
    pixel(ctx, centerX + half * 0.28, tileY + unit, half * 0.68, unit, palette.roofShade);
  }
}

function drawHouseWindow(ctx, x, y, scale, frame = "#55483f", glass = "#e0b76f") {
  pixel(ctx, x - scale, y - scale, 8 * scale, 9 * scale, frame);
  pixel(ctx, x, y, 6 * scale, 7 * scale, glass);
  pixel(ctx, x + 2 * scale, y, scale, 7 * scale, frame);
  pixel(ctx, x, y + 3 * scale, 6 * scale, scale, frame);
}

function drawHouseDoor(ctx, x, baseY, scale, wood = "#704b39") {
  pixel(ctx, x - scale, baseY - 16 * scale, 10 * scale, 17 * scale, "#38363a");
  pixel(ctx, x + scale, baseY - 18 * scale, 6 * scale, 3 * scale, "#38363a");
  pixel(ctx, x, baseY - 16 * scale, 2 * scale, 2 * scale, "#38363a");
  pixel(ctx, x + 7 * scale, baseY - 16 * scale, 2 * scale, 2 * scale, "#38363a");
  pixel(ctx, x + scale, baseY - 14 * scale, 6 * scale, 14 * scale, wood);
  pixel(ctx, x + 2 * scale, baseY - 16 * scale, 4 * scale, 2 * scale, wood);
  pixel(ctx, x + 2 * scale, baseY - 14 * scale, scale, 14 * scale, "#a2764c");
  pixel(ctx, x + scale, baseY - 17 * scale, 6 * scale, 2 * scale, "#57483e");
  pixel(ctx, x + 6 * scale, baseY - 8 * scale, scale, scale, "#e5bd69");
}

function drawHouse(ctx, x, baseY, scale, variant = 0) {
  const styles = [
    { width: 38, wall: "#b79a6b", roof: "#77543b", roofLight: "#a7804d", roofShade: "#503d33", roofTile: "#91704b", timber: "#62483a", stone: false },
    { width: 44, wall: "#918f80", roof: "#704e4b", roofLight: "#a17158", roofShade: "#493d41", roofTile: "#87594d", timber: "#59473f", stone: true },
    { width: 40, wall: "#b89a70", roof: "#65585a", roofLight: "#8b7370", roofShade: "#403b43", roofTile: "#716469", timber: "#61483a", stone: false },
  ];
  const style = styles[variant % styles.length];
  const unit = scale;
  const width = style.width * unit;
  const wallTop = baseY - 23 * unit;
  const roofEaves = wallTop + 3 * unit;
  const roofPeak = roofEaves - 18 * unit;
  const bodyX = x + 4 * unit;
  const bodyWidth = width - 8 * unit;
  const masonryPalette = { ...STONE_PALETTE, base: style.wall, light: "#c5b798", shadow: "#6d716f", mortar: "#65645d" };

  pixel(ctx, x + 1 * unit, baseY - 3 * unit, width - 2 * unit, 4 * unit, "#473f3b");
  if (style.stone) {
    drawMasonry(ctx, bodyX, wallTop, bodyWidth, baseY - wallTop, unit, masonryPalette, variant);
  } else {
    pixel(ctx, bodyX - unit, wallTop - unit, bodyWidth + 2 * unit, baseY - wallTop + unit, "#463d39");
    pixel(ctx, bodyX, wallTop, bodyWidth, baseY - wallTop, style.wall);
    pixel(ctx, bodyX + bodyWidth - 5 * unit, wallTop, 5 * unit, baseY - wallTop, "#8b7355");
    pixel(ctx, bodyX + unit, wallTop + 2 * unit, bodyWidth - 7 * unit, 2 * unit, "#c6aa79");
    pixel(ctx, bodyX + 3 * unit, wallTop, 2 * unit, baseY - wallTop, style.timber);
    pixel(ctx, bodyX + bodyWidth - 8 * unit, wallTop, 2 * unit, baseY - wallTop, style.timber);
    pixel(ctx, bodyX + unit, baseY - 6 * unit, bodyWidth - 6 * unit, 2 * unit, style.timber);
  }

  fillPoly(ctx, [
    [bodyX, wallTop + unit], [x + width / 2, roofPeak + 15 * unit], [bodyX + bodyWidth, wallTop + unit],
  ], style.stone ? style.wall : "#c1a577");

  if (variant === 1) {
    pixel(ctx, x + width - 13 * unit, roofPeak + 4 * unit, 6 * unit, 14 * unit, "#4b4240");
    pixel(ctx, x + width - 14 * unit, roofPeak + 2 * unit, 8 * unit, 3 * unit, "#9a8e7b");
  }

  drawHouseWindow(ctx, x + 8 * unit, wallTop + 9 * unit, unit, style.timber);
  drawHouseDoor(ctx, x + (width - 8 * unit) / 2, baseY, unit, style.timber);
  if (variant !== 0) drawHouseWindow(ctx, x + width - 15 * unit, wallTop + 9 * unit, unit, style.timber);
  if (variant === 2) {
    pixel(ctx, x + 4 * unit, baseY - 2 * unit, width - 8 * unit, 2 * unit, "#704d3c");
    pixel(ctx, x + 2 * unit, baseY - 9 * unit, 2 * unit, 8 * unit, style.timber);
    pixel(ctx, x + width - 6 * unit, baseY - 9 * unit, 2 * unit, 8 * unit, style.timber);
    pixel(ctx, x + 2 * unit, baseY - 10 * unit, width - 6 * unit, 2 * unit, "#a67a4d");
    pixel(ctx, x + 7 * unit, baseY - 7 * unit, 6 * unit, 2 * unit, "#b45f55");
  }
  const roofPalette = { ...style, outline: "#443a39", roofShade: style.roofShade, roofTile: style.roofTile };
  drawPitchedRoof(ctx, x, roofEaves, width, unit, roofPalette);
}

function drawRuin(ctx, x, baseY, scale = 1, variant = 0) {
  const unit = scale;
  const palette = { ...STONE_PALETTE, base: "#828477", light: "#aaa58c", shadow: "#5d625b", mortar: "#54594f" };
  drawMasonry(ctx, x - unit, baseY - 6 * unit, 66 * unit, 6 * unit, unit, palette, 1);
  if (variant === 0) {
    drawMasonry(ctx, x + 3 * unit, baseY - 34 * unit, 10 * unit, 29 * unit, unit, palette, 0);
    drawMasonry(ctx, x + 48 * unit, baseY - 28 * unit, 10 * unit, 23 * unit, unit, palette, 1);
    drawMasonry(ctx, x + 9 * unit, baseY - 39 * unit, 10 * unit, 5 * unit, unit, palette, 0);
    drawMasonry(ctx, x + 18 * unit, baseY - 44 * unit, 10 * unit, 5 * unit, unit, palette, 1);
    drawMasonry(ctx, x + 28 * unit, baseY - 46 * unit, 10 * unit, 5 * unit, unit, palette, 2);
    drawMasonry(ctx, x + 38 * unit, baseY - 41 * unit, 10 * unit, 5 * unit, unit, palette, 0);
    pixel(ctx, x + 16 * unit, baseY - 23 * unit, 2 * unit, 8 * unit, "#444941");
    pixel(ctx, x + 43 * unit, baseY - 21 * unit, 2 * unit, 7 * unit, "#444941");
  } else {
    drawMasonry(ctx, x + 3 * unit, baseY - 29 * unit, 10 * unit, 24 * unit, unit, palette, 1);
    drawMasonry(ctx, x + 49 * unit, baseY - 22 * unit, 10 * unit, 17 * unit, unit, palette, 2);
    drawMasonry(ctx, x + 9 * unit, baseY - 30 * unit, 21 * unit, 7 * unit, unit, palette, 0);
    drawMasonry(ctx, x + 30 * unit, baseY - 25 * unit, 13 * unit, 6 * unit, unit, palette, 1);
    pixel(ctx, x + 21 * unit, baseY - 16 * unit, 12 * unit, 2 * unit, palette.mortar);
    pixel(ctx, x + 36 * unit, baseY - 12 * unit, 9 * unit, 2 * unit, palette.light);
  }
  pixel(ctx, x + 1 * unit, baseY - 4 * unit, 12 * unit, 2 * unit, palette.moss);
  pixel(ctx, x + 48 * unit, baseY - 4 * unit, 13 * unit, 2 * unit, palette.moss);
}

function drawRockFormation(ctx, x, baseY, scale = 1) {
  const unit = scale;
  const outline = "#3f4548";
  fillPoly(ctx, [
    [x, baseY], [x + 4 * unit, baseY - 9 * unit], [x + 14 * unit, baseY - 13 * unit],
    [x + 21 * unit, baseY - 25 * unit], [x + 30 * unit, baseY - 21 * unit],
    [x + 39 * unit, baseY - 11 * unit], [x + 49 * unit, baseY - 8 * unit], [x + 54 * unit, baseY],
  ], outline);
  fillPoly(ctx, [
    [x + 3 * unit, baseY - unit], [x + 7 * unit, baseY - 8 * unit],
    [x + 18 * unit, baseY - 12 * unit], [x + 23 * unit, baseY - 21 * unit],
    [x + 29 * unit, baseY - 18 * unit], [x + 24 * unit, baseY - 8 * unit], [x + 14 * unit, baseY - unit],
  ], "#87908a");
  fillPoly(ctx, [
    [x + 29 * unit, baseY - 18 * unit], [x + 38 * unit, baseY - 10 * unit],
    [x + 48 * unit, baseY - 7 * unit], [x + 51 * unit, baseY - unit], [x + 18 * unit, baseY - unit],
  ], "#596267");
  pixel(ctx, x + 21 * unit, baseY - 18 * unit, 3 * unit, 6 * unit, "#424b4e");
  pixel(ctx, x + 34 * unit, baseY - 10 * unit, 7 * unit, 2 * unit, "#454d50");
  pixel(ctx, x + 4 * unit, baseY - 2 * unit, 12 * unit, 2 * unit, "#66764e");
}

function drawTower(ctx, x, baseY, scale = 1) {
  const unit = scale;
  const stone = { ...STONE_PALETTE, base: "#706d82", light: "#a0919e", shadow: "#4e5062", mortar: "#535362" };
  drawMasonry(ctx, x + 5 * unit, baseY - 46 * unit, 40 * unit, 45 * unit, unit, stone, 0);
  drawMasonry(ctx, x + 9 * unit, baseY - 67 * unit, 32 * unit, 22 * unit, unit, stone, 1);
  pixel(ctx, x + 1 * unit, baseY - 7 * unit, 49 * unit, 8 * unit, "#4b4b59");
  drawPitchedRoof(ctx, x + 7 * unit, baseY - 65 * unit, 36 * unit, unit, {
    outline: "#393747", roof: "#51475f", roofLight: "#81718b", roofShade: "#3d394d", roofTile: "#685a77",
  });
  drawHouseWindow(ctx, x + 21 * unit, baseY - 55 * unit, unit, "#393849", "#edc67b");
  drawHouseWindow(ctx, x + 21 * unit, baseY - 33 * unit, unit, "#393849", "#e1b56d");
  pixel(ctx, x + 21 * unit, baseY - 17 * unit, 9 * unit, 17 * unit, "#393747");
  pixel(ctx, x + 23 * unit, baseY - 16 * unit, 5 * unit, 15 * unit, "#79584b");
  pixel(ctx, x + 27 * unit, baseY - 9 * unit, unit, unit, "#ebc675");
}

function drawCastleTower(ctx, x, baseY, scale, width, height, palette, variant = 0) {
  const unit = scale;
  const topY = baseY - height * unit;
  drawMasonry(ctx, x, topY, width * unit, height * unit, unit, palette, variant);
  drawPitchedRoof(ctx, x - unit, topY + 2 * unit, (width + 2) * unit, unit, {
    outline: "#353943", roof: variant ? "#5e4e50" : "#4c4e59", roofLight: "#91817a",
    roofShade: "#393c45", roofTile: "#76645d",
  });
  drawHouseWindow(ctx, x + width * 0.48 * unit, topY + 13 * unit, unit, "#343943", "#d8b36e");
  drawHouseWindow(ctx, x + width * 0.48 * unit, topY + 29 * unit, unit, "#343943", "#d8b36e");
}

function drawCastle(ctx, x, baseY, scale = 1) {
  const unit = scale;
  const palette = { ...STONE_PALETTE, base: "#737985", light: "#a4a39c", shadow: "#505663", mortar: "#4a4e59" };
  drawMasonry(ctx, x + 3 * unit, baseY - 9 * unit, 90 * unit, 9 * unit, unit, palette, 0);
  drawMasonry(ctx, x + 16 * unit, baseY - 39 * unit, 62 * unit, 32 * unit, unit, palette, 1);
  for (let merlon = 0; merlon < 5; merlon++) {
    pixel(ctx, x + (18 + merlon * 13) * unit, baseY - 46 * unit, 7 * unit, 8 * unit, palette.outline);
    pixel(ctx, x + (19 + merlon * 13) * unit, baseY - 45 * unit, 5 * unit, 7 * unit, palette.base);
  }
  drawCastleTower(ctx, x + 2 * unit, baseY, scale, 23, 51, palette, 0);
  drawCastleTower(ctx, x + 67 * unit, baseY, scale, 23, 46, palette, 1);

  pixel(ctx, x + 39 * unit, baseY - 23 * unit, 16 * unit, 24 * unit, "#343841");
  pixel(ctx, x + 42 * unit, baseY - 26 * unit, 10 * unit, 4 * unit, "#343841");
  pixel(ctx, x + 39 * unit, baseY - 23 * unit, 4 * unit, 4 * unit, "#343841");
  pixel(ctx, x + 51 * unit, baseY - 23 * unit, 4 * unit, 4 * unit, "#343841");
  pixel(ctx, x + 42 * unit, baseY - 20 * unit, 10 * unit, 21 * unit, "#60483f");
  pixel(ctx, x + 44 * unit, baseY - 23 * unit, 6 * unit, 3 * unit, "#60483f");
  pixel(ctx, x + 43 * unit, baseY - 22 * unit, 8 * unit, 2 * unit, "#a39a86");
  pixel(ctx, x + 49 * unit, baseY - 10 * unit, unit, unit, "#d8b36e");
  pixel(ctx, x + 31 * unit, baseY - 31 * unit, 5 * unit, 10 * unit, "#303740");
  pixel(ctx, x + 58 * unit, baseY - 31 * unit, 5 * unit, 10 * unit, "#303740");
  pixel(ctx, x + 32 * unit, baseY - 30 * unit, 3 * unit, 7 * unit, "#d8b36e");
  pixel(ctx, x + 59 * unit, baseY - 30 * unit, 3 * unit, 7 * unit, "#d8b36e");
}

function drawLanternPost(ctx, x, baseY, scale = 1) {
  pixel(ctx, x + 5 * scale, baseY - 29 * scale, 3 * scale, 29 * scale, "#4b423c");
  pixel(ctx, x + 6 * scale, baseY - 27 * scale, scale, 25 * scale, "#9a734b");
  pixel(ctx, x + 1 * scale, baseY - 31 * scale, 11 * scale, 2 * scale, "#5a4739");
  pixel(ctx, x + 2 * scale, baseY - 40 * scale, 9 * scale, 8 * scale, "#3d3c3d");
  pixel(ctx, x + 3 * scale, baseY - 39 * scale, 7 * scale, 6 * scale, "#e0b66d");
  pixel(ctx, x + 4 * scale, baseY - 38 * scale, 4 * scale, 4 * scale, "#f2d58a");
  pixel(ctx, x + scale, baseY - 42 * scale, 11 * scale, 2 * scale, "#5b483b");
  pixel(ctx, x + 4 * scale, baseY - 44 * scale, 5 * scale, 2 * scale, "#76583d");
  pixel(ctx, x + 3 * scale, baseY - 2 * scale, 7 * scale, 2 * scale, "#49403a");
}

function drawElderVillager(ctx, x, baseY, scale = 1) {
  const unit = scale;
  const outline = "#302f35";
  const coat = "#716254";
  const coatLight = "#a28a68";
  const hair = "#b9b7a7";
  pixel(ctx, x + 7 * unit, baseY - 2 * unit, 14 * unit, 2 * unit, "#49443c");
  pixel(ctx, x + 7 * unit, baseY - 8 * unit, 5 * unit, 7 * unit, outline);
  pixel(ctx, x + 15 * unit, baseY - 8 * unit, 5 * unit, 7 * unit, outline);
  pixel(ctx, x + 8 * unit, baseY - 7 * unit, 3 * unit, 5 * unit, "#78614b");
  pixel(ctx, x + 16 * unit, baseY - 7 * unit, 3 * unit, 5 * unit, "#78614b");
  pixel(ctx, x + 5 * unit, baseY - 23 * unit, 15 * unit, 16 * unit, outline);
  pixel(ctx, x + 7 * unit, baseY - 22 * unit, 11 * unit, 13 * unit, coat);
  pixel(ctx, x + 7 * unit, baseY - 20 * unit, 3 * unit, 10 * unit, coatLight);
  pixel(ctx, x + 16 * unit, baseY - 20 * unit, 2 * unit, 10 * unit, "#514a47");
  pixel(ctx, x + 10 * unit, baseY - 18 * unit, 6 * unit, unit, "#453d39");
  pixel(ctx, x + 11 * unit, baseY - 19 * unit, 2 * unit, 3 * unit, "#d2b26e");
  pixel(ctx, x + 17 * unit, baseY - 20 * unit, 4 * unit, 8 * unit, outline);
  pixel(ctx, x + 18 * unit, baseY - 19 * unit, 2 * unit, 6 * unit, "#9c7651");
  pixel(ctx, x + 9 * unit, baseY - 31 * unit, 10 * unit, 11 * unit, outline);
  pixel(ctx, x + 10 * unit, baseY - 30 * unit, 8 * unit, 8 * unit, "#d6b28d");
  pixel(ctx, x + 9 * unit, baseY - 32 * unit, 10 * unit, 4 * unit, hair);
  pixel(ctx, x + 8 * unit, baseY - 29 * unit, 3 * unit, 6 * unit, hair);
  pixel(ctx, x + 16 * unit, baseY - 29 * unit, 3 * unit, 5 * unit, hair);
  pixel(ctx, x + 11 * unit, baseY - 24 * unit, 6 * unit, 7 * unit, hair);
  pixel(ctx, x + 12 * unit, baseY - 27 * unit, unit, unit, outline);
  pixel(ctx, x + 16 * unit, baseY - 27 * unit, unit, unit, outline);
  pixel(ctx, x + 17 * unit, baseY - 25 * unit, 2 * unit, unit, "#a57959");
  pixel(ctx, x + 20 * unit, baseY - 18 * unit, 2 * unit, 14 * unit, "#493f37");
  pixel(ctx, x + 19 * unit, baseY - 18 * unit, 2 * unit, 2 * unit, "#896c4e");
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
      [90, 265, 480, 660].forEach((offset, i) => drawTree(ctx, xAt(offset), base + (i % 2) * 3, 0.82 + (i % 3) * 0.12, ["#24463f", "#31594b", "#78905a"], true, i));
      drawHouse(ctx, xAt(550), base, 0.6, 0);
    } else if (area === 1) {
      [110, 360, 620].forEach((offset, i) => drawTree(ctx, xAt(offset), base, 1.05 + i * 0.13, ["#283f50", "#3f5a64", "#71817a"], false, i + 1));
      if (!reducedDetails) {
        drawMushroom(ctx, xAt(245), base - 5, "#bc7773", 1.2);
        drawMushroom(ctx, xAt(285), base - 2, "#d9a65e", 0.9);
        pixel(ctx, xAt(465), base - 4, 120, 4, "#725f4a");
        pixel(ctx, xAt(465), base - 12, 4, 10, "#715d4a");
        pixel(ctx, xAt(580), base - 12, 4, 10, "#715d4a");
        pixel(ctx, xAt(466), base - 2, 118, 2, "#b38c5c");
      }
    } else if (area === 2) {
      [70, 665].forEach((offset, i) => drawTree(ctx, xAt(offset), base, 0.78 + i * 0.12, ["#354a40", "#53664c", "#899264"], true, i + 2));
      drawRuin(ctx, xAt(145), base, 0.9);
      drawRuin(ctx, xAt(470), base + 2, 0.72, 1);
      drawRockFormation(ctx, xAt(300), base, 0.9);
    } else if (area === 3) {
      [[46, 0.78, true], [278, 0.84, false], [710, 0.78, true]].forEach(([offset, scale, pine], i) => {
        drawTree(ctx, xAt(offset), base, scale, ["#354b3e", "#586b48", "#8e9860"], pine, i + 1);
      });
      drawElderVillager(ctx, xAt(455), base, 0.86);
      drawHouse(ctx, xAt(105), base, 0.72, 0);
      drawHouse(ctx, xAt(365), base + 2, 0.86, 1);
      drawHouse(ctx, xAt(625), base, 0.64, 2);
      if (!reducedDetails) {
        [220, 535].forEach((offset) => drawLanternPost(ctx, xAt(offset), base, 0.72));
        pixel(ctx, xAt(45), base - 2, 620, 3, "#6d513d");
        for (let fence = 0; fence < 8; fence++) pixel(ctx, xAt(55 + fence * 75), base - 14, 3, 14, "#806348");
      }
    } else if (area === 4) {
      [[92, 0.78, true], [230, 0.7, false], [625, 0.82, true]].forEach(([offset, scale, pine], i) => {
        drawTree(ctx, xAt(offset), base, scale, ["#333c45", "#4b5d56", "#82896a"], pine, i + 2);
      });
      drawTower(ctx, xAt(338), base, 1.05);
      if (!reducedDetails) {
        [[260, -58], [540, -73], [605, -45]].forEach(([offset, rise], i) => {
          const crystalX = xAt(offset);
          pixel(ctx, crystalX, base + rise, 3, 8, i % 2 ? "#c79ad0" : "#9dd2db");
          pixel(ctx, crystalX - 3, base + rise + 3, 9, 3, i % 2 ? "#9b79bb" : "#79aebe");
        });
      }
    } else {
      [[68, 0.78, true], [246, 0.72, true], [720, 0.84, false]].forEach(([offset, scale, pine], i) => {
        drawTree(ctx, xAt(offset), base, scale, ["#354b42", "#58664e", "#96946a"], pine, i);
      });
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
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return undefined;

    let viewportWidth = 1;
    let viewportHeight = 1;
    let waypoints = [];
    let targetWorldX = 64;
    let currentWorldX = 64;
    let cameraX = 0;
    let direction = 1;
    let lastFrame = 0;
    let lastWorldFrame = 0;
    let forceResizeRender = false;
    let worldReadyEmitted = false;
    let characterEnterStartedAt = null;
    let characterEnterOffset = 0;
    let lastScrollAt = 0;
    let animationFrame = null;
    let resizeFrame = null;
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
      if (resizeFrame !== null) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null;
        const bounds = canvas.getBoundingClientRect();
        const nextWidth = Math.max(1, Math.ceil(bounds.width / 3));
        const nextHeight = Math.max(1, Math.ceil(bounds.height / 3));
        const canvasSizeChanged = canvas.width !== nextWidth || canvas.height !== nextHeight;
        viewportWidth = nextWidth;
        viewportHeight = nextHeight;
        reducedDetails = viewportWidth < 155;
        if (canvasSizeChanged) {
          canvas.width = viewportWidth;
          canvas.height = viewportHeight;
          context.imageSmoothingEnabled = false;
        }
        readWaypoints();
        if (canvasSizeChanged) {
          if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
          animationFrame = null;
          forceResizeRender = true;
          render(performance.now());
        } else {
          requestRender();
        }
      });
    };

    const render = (time = performance.now()) => {
      animationFrame = null;
      if (document.visibilityState !== "visible") return;
      const reduced = reducedMotion.matches;
      const worldActive = document.body.classList.contains("hero-world-active");
      if (worldActive && !reduced && !forceResizeRender && time - lastWorldFrame < 33) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }
      forceResizeRender = false;
      if (worldActive) lastWorldFrame = time;
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
      const cloudDrift = worldActive && !reduced ? (time * 0.005) % 245 : 0;
      for (let i = cloudStart; i <= cloudEnd; i++) {
        drawCloud(context, i * 245 - cameraX * 0.1 - cloudDrift, 24 + ((i * 37) % 38), Math.abs(i) % 2);
      }

      const distantStart = Math.max(0, Math.floor((cameraX * 0.1) / AREA_WIDTH) - 1);
      const distantEnd = Math.min(AREAS.length - 1, Math.floor((cameraX * 0.1 + viewportWidth) / AREA_WIDTH) + 1);
      for (let area = distantStart; area <= distantEnd; area++) {
        const x = area * AREA_WIDTH - cameraX * 0.1;
        const hazeColor = mixHex(centerTheme.far, centerTheme.sky[1], 0.48);
        drawMountainRange(context, x, groundY - 112, AREA_WIDTH + 8, 66, hazeColor, area + 2, 0, false);
      }

      const mainStart = Math.max(0, Math.floor((cameraX * 0.22) / AREA_WIDTH) - 1);
      const mainEnd = Math.min(AREAS.length - 1, Math.floor((cameraX * 0.22 + viewportWidth) / AREA_WIDTH) + 1);
      for (let area = mainStart; area <= mainEnd; area++) {
        const x = area * AREA_WIDTH - cameraX * 0.22;
        drawMountainRange(context, x, groundY - 64, AREA_WIDTH + 8, 84, centerTheme.far, area, 2, true);
        drawHillRange(context, x, groundY - 27, AREA_WIDTH + 8, 28, centerTheme.hills);
      }

      const foregroundStart = Math.max(0, Math.floor((cameraX * 0.38) / AREA_WIDTH) - 1);
      const foregroundEnd = Math.min(AREAS.length - 1, Math.floor((cameraX * 0.38 + viewportWidth) / AREA_WIDTH) + 1);
      for (let area = foregroundStart; area <= foregroundEnd; area++) {
        const x = area * AREA_WIDTH - cameraX * 0.38;
        const rockColor = mixHex(centerTheme.hills, "#26383c", 0.38);
        drawMountainRange(context, x, groundY - 4, AREA_WIDTH + 8, 52, rockColor, area + 4, 2, false);
      }

      drawAreaObjects(context, cameraX, viewportWidth, groundY, reducedDetails);
      drawGround(context, cameraX, viewportWidth, viewportHeight, groundY, centerTheme.ground, reducedDetails);

      const playerScreenBias = viewportWidth < 230 ? 45 : 0;
      const characterScale = reducedDetails ? 0.72 : 0.84;
      let enteringFromLeft = false;
      if (characterEnterStartedAt !== null) {
        const progress = Math.min(1, Math.max(0, (time - characterEnterStartedAt) / 760));
        const easedProgress = progress * progress * (3 - 2 * progress);
        characterEnterOffset = -60 * (1 - easedProgress);
        enteringFromLeft = progress < 1;
        if (!enteringFromLeft) characterEnterStartedAt = null;
      }
      const playerX = currentWorldX - cameraX - (BARD_WIDTH / 2) * characterScale - playerScreenBias + characterEnterOffset;
      const isMoving = !reduced && (enteringFromLeft || Math.abs(targetWorldX - currentWorldX) > 0.35 || time - lastScrollAt < 110);
      const frameIndex = Math.floor(time / 190) % LIMB_FRAMES.length;
      drawBardScene(context, playerX, groundY + 1, direction, isMoving, frameIndex, idleBeat, characterScale);
      if (!worldReadyEmitted) {
        worldReadyEmitted = true;
        canvas.dataset.worldReady = "true";
        window.dispatchEvent(new Event("portfolio-world-ready"));
      }

      const stillMoving = enteringFromLeft || Math.abs(targetWorldX - currentWorldX) > 0.22 || Math.abs(targetCamera - cameraX) > 0.25;
      if (!reduced && (stillMoving || worldActive)) {
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
    const onWorldEnter = () => {
      lastWorldFrame = 0;
      characterEnterOffset = -60;
      characterEnterStartedAt = performance.now();
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
    resizeObserver.observe(canvas.parentElement || canvas);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("portfolio-world-enter", onWorldEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener?.("change", onMotionChange);
    resize();
    onScroll();

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("portfolio-world-enter", onWorldEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener?.("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="adventure-world-canvas absolute inset-0 h-full w-full" aria-hidden="true" />;
}
