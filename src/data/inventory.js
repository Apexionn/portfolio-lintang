export const INVENTORY_CATEGORIES = [
  { id: "Frontend", title: "Frontend", filter: "Frontend" },
  { id: "Backend", title: "Backend & Data", filter: "Backend" },
  { id: "AI/ML", title: "AI / ML", filter: "AI/ML" },
  { id: "Game Dev", title: "Game Dev", filter: "Game Dev" },
  { id: "Tools", title: "Tools & Deploy", filter: "Tools" },
];

export const INVENTORY_FILTERS = ["All", "Frontend", "Backend", "AI/ML", "Game Dev", "Tools"];

// REVIEW: draft levels, edit to match reality.
export const INVENTORY_ITEMS = [
  { id: "react", name: "React", category: "Frontend", icon: "react", level: 4, draftFields: ["level"] },
  { id: "nodejs", name: "Node.js", category: "Backend", icon: "node", level: 3, draftFields: ["level"] },
  { id: "mysql", name: "MySQL", category: "Backend", icon: "database", level: 3, draftFields: ["level"] },
  { id: "postgresql", name: "PostgreSQL", category: "Backend", icon: "database", level: 2, draftFields: ["level"] },
  { id: "railway", name: "Railway", category: "Tools", icon: "cloud", level: 2, draftFields: ["level"] },
  { id: "rest-apis", name: "REST APIs", category: "Backend", icon: "braces", level: 3, draftFields: ["level"] },
  { id: "git", name: "Git", category: "Tools", icon: "branch", level: 3, draftFields: ["level"] },
  { id: "typescript", name: "TypeScript", category: "Frontend", icon: "code", level: 4 },
  { id: "large-language-models", name: "Large Language Models", category: "AI/ML", icon: "spark", level: 2, draftFields: ["level"] },
  { id: "natural-language-processing", name: "Natural Language Processing", category: "AI/ML", icon: "text", level: 2, draftFields: ["level"] },
  { id: "machine-learning", name: "Machine Learning", category: "AI/ML", icon: "nodes", level: 2, draftFields: ["level"] },
  { id: "speech-recognition", name: "Speech Recognition", category: "AI/ML", icon: "audio", level: 1 },
  { id: "huggingface", name: "HuggingFace", category: "AI/ML", icon: "hug", level: 2, draftFields: ["level"] },
  { id: "python", name: "Python", category: "AI/ML", icon: "python", level: 3, draftFields: ["level"] },
  { id: "computer-vision", name: "Computer Vision", category: "AI/ML", icon: "eye", level: 1, draftFields: ["level"] },
  { id: "figma", name: "Figma", category: "Tools", icon: "figma", level: 3, draftFields: ["level"] },
  { id: "threejs", name: "Three.js", category: "Game Dev", icon: "cube", level: 1, draftFields: ["level"] },
  { id: "unity", name: "Unity", category: "Game Dev", icon: "gamepad", level: 1, draftFields: ["level"] },
  { id: "vite", name: "Vite", category: "Frontend", icon: "bolt", level: 3, draftFields: ["level"] },
  { id: "docker", name: "Docker", category: "Tools", icon: "container", level: 1, draftFields: ["level"] },
];

export const INVENTORY_SIDE_QUEST = {
  text: "UI X AI Project",
};
