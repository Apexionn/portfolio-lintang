import { SKILLS, INVENTORY_CATEGORIES } from "../../data/skills";

export default function ArsenalSection() {
  return (
    <section className="game-section relative z-10 py-20 md:py-28" id="arsenal">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="game-section-label font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-4 reveal-item" data-delay="0">
          <span className="game-label-icon">04</span> Player Inventory
        </p>
        <h2 className="game-section-title font-syne text-[clamp(32px,4vw,52px)] font-[800] leading-[1.02] mb-8 reveal-item" data-delay="100">
          Tools equipped.
        </h2>

        <div className="game-panel game-inventory-panel overflow-hidden reveal-item" data-delay="200">
          <div className="game-panel-header py-3 px-4 sm:px-6 flex items-center justify-between gap-3">
            <span className="game-pixel-label">LINTANG.EXE / INVENTORY</span>
            <span className="game-count-badge font-syne-mono text-[8px] uppercase tracking-[0.08em]">{Object.values(SKILLS).flat().length} items</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 p-4 sm:p-6 md:p-7">
            {INVENTORY_CATEGORIES.map((category) => (
              <div className="game-inventory-category" key={category.key}>
                <h3 className="game-inventory-heading font-syne text-[17px] font-[800] mb-4 flex items-center gap-2">
                  <span aria-hidden="true">{category.icon}</span>{category.title}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {SKILLS[category.key].map((skill) => (
                    <span className="game-inventory-item font-syne-mono text-[9px] px-2.5 py-2" key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
            <div className="game-status-message md:col-span-3 flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="game-status-dot" />
              <span className="game-pixel-label">CURRENT SIDE QUEST</span>
              <span className="text-[12px]">Exploring game development and new technologies.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
