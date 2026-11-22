export default function Footer() {
  return (
    <footer className="game-footer relative z-10 py-[32px] px-6 md:px-[60px] flex flex-col md:flex-row justify-between items-center gap-[16px] text-center md:text-left">
      <p className="font-syne-mono text-[11px] text-port-text-muted tracking-[0.05em]">
        © 2026 Lintang Anggowoyuono. Designed &amp; engineered from scratch.
      </p>
      <ul className="flex gap-[24px] list-none">
        <li><a href="https://github.com/Apexionn" target="_blank" rel="noreferrer" className="game-footer-link font-syne-mono text-[11px] tracking-[0.08em]">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/lintang-anggowoyuono/" target="_blank" rel="noreferrer" className="game-footer-link font-syne-mono text-[11px] tracking-[0.08em]">LinkedIn</a></li>
        <li><a href="mailto:lintanganggowo@gmail.com" className="game-footer-link font-syne-mono text-[11px] tracking-[0.08em]">Email</a></li>
      </ul>
    </footer>
  );
}
