import AdventureWorld from "../AdventureWorld";

export default function GameWorldBackground() {
  return (
    <div className="game-world-background fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <AdventureWorld />
      <div className="game-world-vignette absolute inset-0" />
    </div>
  );
}
