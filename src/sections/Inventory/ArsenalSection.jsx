import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "../../data/projects";
import { INVENTORY_CATEGORIES, INVENTORY_FILTERS, INVENTORY_ITEMS, INVENTORY_SIDE_QUEST } from "../../data/inventory";
import "./inventory.css";

const ROLL_DURATION = 1200;
const HIGHLIGHT_DURATION = 4200;
const TECH_ALIASES = {
  "rest-apis": ["restapi", "restapis"],
  "large-language-models": ["largelanguagemodels", "llm", "llms"],
  "natural-language-processing": ["naturallanguageprocessing", "nlp"],
  huggingface: ["huggingface", "huggingfacehub"],
};

function normalizeTechnology(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getUsedInProjects(item) {
  const aliases = TECH_ALIASES[item.id] ?? [normalizeTechnology(item.name)];
  return PROJECTS.filter((project) => project.techStack?.some((tech) => aliases.includes(normalizeTechnology(tech))));
}

function randomInteger(min, max) {
  const range = max - min + 1;
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const limit = Math.floor(0x100000000 / range) * range;
    const bucket = new Uint32Array(1);
    do cryptoApi.getRandomValues(bucket); while (bucket[0] >= limit);
    return min + (bucket[0] % range);
  }
  return min + Math.floor(Math.random() * range);
}

function InventoryIcon({ type }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "square", strokeLinejoin: "miter" };
  const drawings = {
    react: <><ellipse cx="12" cy="12" rx="9" ry="3.7" /><ellipse cx="12" cy="12" rx="9" ry="3.7" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.7" transform="rotate(120 12 12)" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /></>,
    node: <><path d="m5 7 7-4 7 4v8l-7 4-7-4z" /><circle cx="5" cy="7" r="1.4" fill="currentColor" /><circle cx="19" cy="7" r="1.4" fill="currentColor" /><circle cx="12" cy="19" r="1.4" fill="currentColor" /></>,
    database: <><ellipse cx="12" cy="5" rx="7.5" ry="2.8" /><path d="M4.5 5v12c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8V5M4.5 10c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8" /></>,
    cloud: <><path d="M5 17h13a3 3 0 0 0 .2-6A6.2 6.2 0 0 0 6.6 9.7 3.7 3.7 0 0 0 5 17Z" /><path d="M12 12v7m-3-3 3 3 3-3" /></>,
    braces: <><path d="M9 4H7v5l-3 3 3 3v5h2m6-16h2v5l3 3-3 3v5h-2M13 6l-2 12" /></>,
    branch: <><path d="M7 5v8a4 4 0 0 0 4 4h5m-8-4 4-4h3" /><circle cx="7" cy="5" r="2" /><circle cx="7" cy="19" r="2" /><circle cx="17" cy="9" r="2" /><circle cx="17" cy="17" r="2" /></>,
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-12-2 14" /></>,
    spark: <><path d="M12 3 14 9l6 3-6 2-2 7-2-7-6-2 6-3z" /><path d="M19 3v4m-2-2h4M5 17v4m-2-2h4" /></>,
    text: <><path d="M4 5h16M4 10h11M4 15h16M4 20h10" /><path d="M18 8v4m-2-2h4" /></>,
    audio: <><path d="M3 10v4m4-7v10m4-14v18m4-13v8m4-11v14m4-10v6" /></>,
    nodes: <><path d="m6 6 6 6-6 6m6-6h6m0 0 3-3m-3 3 3 3" /><circle cx="6" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" /></>,
    wand: <><path d="m5 19 10-10m-6 8 2 2m2-7 2 2" /><path d="m17 4 .7 2.3L20 7l-2.3.7L17 10l-.7-2.3L14 7l2.3-.7zM7 3l.5 1.5L9 5l-1.5.5L7 7l-.5-1.5L5 5l1.5-.5z" /></>,
    hug: <><path d="M5 5h5v4H8v6h2v4H5zM19 5h-5v4h2v6h-2v4h5z" /><path d="M10 8h4m-4 8h4" /></>,
    python: <><path d="M6 4h8v7H8v4H5V7zM18 20h-8v-7h6V9h3v8z" /><circle cx="9" cy="7" r=".8" fill="currentColor" /><circle cx="15" cy="17" r=".8" fill="currentColor" /></>,
    eye: <><path d="M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z" /><circle cx="12" cy="12" r="3" /><path d="M12 9v6m-3-3h6" /></>,
    figma: <><path d="M9 3h6a3 3 0 0 1 0 6H9zm0 6h6a3 3 0 1 1 0 6H9zm0 6h3a3 3 0 1 1-3 3z" /><circle cx="18" cy="12" r="3" /></>,
    cube: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.7 8-4.7M12 12.2V21m-4-16 8 5" /></>,
    gamepad: <><path d="M7 8h10a4 4 0 0 1 3.8 5.3l-1 3.2a2 2 0 0 1-3.2 1l-2-1.5h-5l-2 1.5a2 2 0 0 1-3.2-1l-1-3.2A4 4 0 0 1 7 8Z" /><path d="M8 11v4m-2-2h4" /><circle cx="16" cy="11.5" r=".8" fill="currentColor" /><circle cx="18" cy="14" r=".8" fill="currentColor" /></>,
    bolt: <><path d="M13 2 5 13h6l-1 9 9-12h-6z" /></>,
    container: <><path d="M4 7h16v10H4zM7 7v10m5-10v10m5-10v10M3 19h18" /></>,
  };
  return (
    <svg className="inventory-item-icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {drawings[type] ?? <><rect x="4" y="4" width="6" height="6" fill="currentColor" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" fill="currentColor" /></>}
    </svg>
  );
}

function LevelPips({ level }) {
  return (
    <span className="inventory-level-pips" aria-label={`Level ${level} of 4`}>
      {[1, 2, 3, 4].map((pip) => <i key={pip} className={pip <= level ? "is-filled" : ""} />)}
    </span>
  );
}

function TwentySidedDie({ face, rolling, paused }) {
  return (
    <svg className={`inventory-d20${rolling ? " is-rolling" : ""}${paused ? " is-paused" : ""}`} viewBox="0 0 48 48" aria-hidden="true">
      <path className="inventory-d20__outline" d="M24 2 44 16l-4 23-16 7L8 39 4 16z" />
      <path className="inventory-d20__facet inventory-d20__facet--top" d="m24 2 8 14H16z" />
      <path className="inventory-d20__facet" d="m4 16 12 0 8 14-20-14Zm40 0-12 0-8 14 20-14ZM8 39l8-23 8 14-4 16zM40 39l-8-23-8 14 4 16z" />
      <path className="inventory-d20__facet" d="m16 16 16 0-8 14z" />
      <text x="24" y="25" textAnchor="middle" dominantBaseline="middle">{face}</text>
    </svg>
  );
}

export default function ArsenalSection() {
  const sectionRef = useRef(null);
  const filterTimerRef = useRef(null);
  const flickerTimerRef = useRef(null);
  const rollTimerRef = useRef(null);
  const highlightTimerRef = useRef(null);
  const isVisibleRef = useRef(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [pinnedItemId, setPinnedItemId] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const [dieFace, setDieFace] = useState(20);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const [rollResult, setRollResult] = useState(null);
  const [rollItemId, setRollItemId] = useState(null);
  const [rollHistory, setRollHistory] = useState([]);

  const usedInByItem = useMemo(() => new Map(INVENTORY_ITEMS.map((item) => [item.id, getUsedInProjects(item)])), []);
  const visibleItems = activeFilter === "All"
    ? INVENTORY_ITEMS
    : INVENTORY_ITEMS.filter((item) => item.category === activeFilter);
  const activeItem = INVENTORY_ITEMS.find((item) => item.id === activeItemId);
  const activeProjects = activeItem ? usedInByItem.get(activeItem.id) : [];
  const resultItem = INVENTORY_ITEMS.find((item) => item.id === rollItemId);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
      setIsInViewport(entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    window.clearTimeout(filterTimerRef.current);
    window.clearTimeout(rollTimerRef.current);
    window.clearTimeout(highlightTimerRef.current);
    window.clearInterval(flickerTimerRef.current);
  }, []);

  useEffect(() => {
    const dismissOnOutsideClick = (event) => {
      if (event.target.closest?.(".inventory-item-card, .inventory-detail-card, .inventory-roll-trigger")) return;
      setActiveItemId(null);
      setPinnedItemId(null);
      setRollResult(null);
      setRollItemId(null);
      setHighlightedItemId(null);
      window.clearTimeout(highlightTimerRef.current);
    };
    document.addEventListener("pointerdown", dismissOnOutsideClick);
    return () => document.removeEventListener("pointerdown", dismissOnOutsideClick);
  }, []);

  const chooseFilter = (filter) => {
    if (filter === activeFilter) return;
    window.clearTimeout(filterTimerRef.current);
    setIsFiltering(true);
    filterTimerRef.current = window.setTimeout(() => {
      setActiveFilter(filter);
      if (activeItemId && filter !== "All") {
        const item = INVENTORY_ITEMS.find((entry) => entry.id === activeItemId);
        if (item?.category !== filter) {
          setActiveItemId(null);
          setPinnedItemId(null);
          setRollResult(null);
          setHighlightedItemId(null);
        }
      }
      window.requestAnimationFrame(() => setIsFiltering(false));
    }, 90);
  };

  const openProject = (event, project) => {
    event.preventDefault();
    window.history.pushState({ quest: project.slug }, "", `#quest-${project.slug}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const rollDie = () => {
    if (isRolling) return;
    window.clearTimeout(rollTimerRef.current);
    window.clearTimeout(highlightTimerRef.current);
    window.clearInterval(flickerTimerRef.current);
    setRollResult(null);
    setRollItemId(null);
    setHighlightedItemId(null);
    setPinnedItemId(null);
    setActiveFilter("All");
    setIsFiltering(false);

    const result = randomInteger(1, 20);
    const item = INVENTORY_ITEMS[randomInteger(0, INVENTORY_ITEMS.length - 1)];
    const finishRoll = () => {
      window.clearInterval(flickerTimerRef.current);
      setDieFace(result);
      setIsRolling(false);
      setRollResult(result);
      setRollItemId(item.id);
      setActiveItemId(item.id);
      setPinnedItemId(item.id);
      setHighlightedItemId(item.id);
      setRollHistory((history) => [{ number: result, itemId: item.id }, ...history].slice(0, 3));
      highlightTimerRef.current = window.setTimeout(() => setHighlightedItemId(null), HIGHLIGHT_DURATION);
      document.getElementById(`inventory-item-${item.id}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest" });
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      finishRoll();
      return;
    }

    setIsRolling(true);
    flickerTimerRef.current = window.setInterval(() => {
      if (isVisibleRef.current) setDieFace(randomInteger(1, 20));
    }, 85);
    rollTimerRef.current = window.setTimeout(finishRoll, ROLL_DURATION);
  };

  const toggleItem = (item) => {
    if (pinnedItemId === item.id) {
      setActiveItemId(null);
      setPinnedItemId(null);
      setRollResult(null);
      setRollItemId(null);
      setHighlightedItemId(null);
      window.clearTimeout(highlightTimerRef.current);
      return;
    }
    setActiveItemId(item.id);
    setPinnedItemId(item.id);
    setRollResult(null);
    setRollItemId(null);
  };

  return (
    <section ref={sectionRef} className="game-section relative z-10 py-20 md:py-28" id="arsenal">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="game-section-label font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-4 reveal-item" data-delay="0">
          <span className="game-label-icon">04</span> Player Inventory
        </p>
        <h2 className="game-section-title font-syne text-[clamp(32px,4vw,52px)] font-[800] leading-[1.02] mb-8 reveal-item" data-delay="100">
          Tools equipped.
        </h2>

        <div className="game-panel game-inventory-panel overflow-hidden reveal-item" data-delay="200">
          <div className="game-panel-header inventory-window-header">
            <span className="game-pixel-label">LINTANG.EXE / INVENTORY</span>
            <div className="inventory-header-actions">
              <span className="game-count-badge font-syne-mono text-[8px] uppercase tracking-[0.08em]">{INVENTORY_ITEMS.length} items</span>
              <div className="inventory-roll-widget">
                <button className="inventory-roll-trigger" type="button" onClick={rollDie} disabled={isRolling} aria-label="Roll a d20 for a random skill" title="Roll a d20 for a random skill">
                  <span className="inventory-d20-wrap"><TwentySidedDie face={dieFace} rolling={isRolling} paused={!isInViewport} /></span>
                  <span className="inventory-roll-label">{isRolling ? "Rolling..." : "Roll for a skill check"}</span>
                </button>
                {rollHistory.length > 0 && (
                  <ol className="inventory-roll-history" aria-label="Last three skill-check rolls">
                    {rollHistory.map((entry, index) => <li key={`${entry.number}-${index}`} title={INVENTORY_ITEMS[entry.number - 1].name}>{String(entry.number).padStart(2, "0")}</li>)}
                  </ol>
                )}
              </div>
            </div>
          </div>

          <div className="inventory-content">
            <div className="inventory-filter-row" role="group" aria-label="Filter inventory by category">
              {INVENTORY_FILTERS.map((filter) => (
                <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => chooseFilter(filter)}>{filter}</button>
              ))}
            </div>

            <div className={`inventory-item-grid${isFiltering ? " is-filtering" : ""}`} aria-live="polite">
              {visibleItems.map((item) => (
                <button
                  id={`inventory-item-${item.id}`}
                  className={`inventory-item-card${activeItemId === item.id ? " is-selected" : ""}${highlightedItemId === item.id ? " is-highlighted" : ""}${rollResult === 20 && highlightedItemId === item.id ? " is-critical-hit" : ""}`}
                  type="button"
                  key={item.id}
                  aria-expanded={activeItemId === item.id}
                  aria-controls="inventory-item-inspector"
                  onClick={() => toggleItem(item)}
                  onMouseEnter={() => { if (!pinnedItemId) setActiveItemId(item.id); }}
                  onFocus={() => { if (!pinnedItemId || pinnedItemId === item.id) setActiveItemId(item.id); }}
                >
                  <span className="inventory-item-card__icon"><InventoryIcon type={item.icon} /></span>
                  <span className="inventory-item-card__copy">
                    <span className="inventory-item-card__name">{item.name}</span>
                    <span className="inventory-item-card__category">{INVENTORY_CATEGORIES.find((category) => category.id === item.category)?.title}</span>
                  </span>
                  <LevelPips level={item.level} />
                </button>
              ))}
            </div>

            <section id="inventory-item-inspector" className={`inventory-detail-card${activeItem ? " is-open" : ""}`} aria-label="Selected inventory item details" aria-live={rollResult ? "polite" : undefined}>
              {activeItem ? (
                <>
                  <div className="inventory-detail-card__heading">
                    <span className="inventory-item-card__icon"><InventoryIcon type={activeItem.icon} /></span>
                    <div><p>{INVENTORY_CATEGORIES.find((category) => category.id === activeItem.category)?.title} · LEVEL {activeItem.level}/4</p><h3>{activeItem.name}</h3></div>
                    <LevelPips level={activeItem.level} />
                  </div>
                  {rollResult && resultItem?.id === activeItem.id && (
                    <p className={`inventory-roll-result${rollResult === 20 ? " is-critical-hit" : ""}${rollResult === 1 ? " is-critical-fail" : ""}`} role="status">
                      {rollResult === 20 && <strong>Critical hit! </strong>}
                      {rollResult === 1 && <strong>Critical fail! </strong>}
                      You rolled {rollResult}. Skill check: {activeItem.name}
                      {rollResult === 1 && <span> The goblin hid your semicolon.</span>}
                    </p>
                  )}
                  <div className="inventory-detail-card__used-in">
                    <span>USED IN</span>
                    {activeProjects.length > 0 ? (
                      <ul>{activeProjects.map((project) => <li key={project.slug}><a href={`#quest-${project.slug}`} onClick={(event) => openProject(event, project)}>{project.title}<span aria-hidden="true"> ↗</span></a></li>)}</ul>
                    ) : <p>Not listed in the current project tech stacks.</p>}
                  </div>
                </>
              ) : <p className="inventory-detail-card__empty">Select a skill to view its level and projects using it.</p>}
            </section>

            <div className="game-status-message inventory-side-quest">
              <span className="game-status-dot" />
              <span className="game-pixel-label">CURRENT SIDE QUEST</span>
              <span>{INVENTORY_SIDE_QUEST.text}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
