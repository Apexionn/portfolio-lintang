import { ABOUT_FACTS } from "../../data/about";

export default function AboutSection() {
  return (
    <section className="game-section relative z-10 py-20 md:py-28" id="about">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="game-section-label font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-4 reveal-item" data-delay="0">
          <span className="game-label-icon">01</span> Character Profile
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-[80px] items-start">
          <div className="reveal-item" data-delay="100">
            <h2 className="game-section-title font-syne text-[clamp(32px,4vw,52px)] font-[800] leading-[1.02] mb-8">
              Meet the<br />player.
            </h2>
            <div className="game-profile-stats mt-8">
              {ABOUT_FACTS.map((item) => (
                <div className="game-stat-row flex flex-col gap-1 py-3" key={item.label}>
                  <span className="game-pixel-label">{item.label}</span>
                  <span className="font-syne text-[15px] font-[700]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-item" data-delay="200">
            <div className="game-panel game-about-copy text-[14px] sm:text-[15px] leading-[1.9] space-y-4 p-5 sm:p-7">
              <p>
                My interest in software began in an elementary school <strong className="text-port-text-primary font-[500]">game development</strong> club, where I saw how code could bring creativity and logic together. I went on to study <strong className="text-port-text-primary font-[500]">Software Engineering</strong> in vocational high school and now study Computer Science at BINUS University, exploring software engineering, artificial intelligence, and user-centered design.
              </p>
              <p>
                I have worked on interactive web applications, organizational platforms, and <span className="game-highlight">AI projects</span> in agriculture and natural language processing. I enjoy developing <strong>React interfaces</strong>, integrating <strong>machine learning models</strong>, and designing products that are reliable and easy to use.
              </p>
              <p>
                I believe technology works best when it is <strong>accessible, useful, and built with people in mind</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
