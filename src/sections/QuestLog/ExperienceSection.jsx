import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EXPERIENCE } from "../../data/experience";

export default function ExperienceSection() {
  const [modalState, setModalState] = useState({ isOpen: false, proofs: [], currentIndex: 0 });
  const [isModalImageLoading, setIsModalImageLoading] = useState(true);
  const closeButtonRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

  const openModal = (proofs) => {
    lastFocusedElementRef.current = document.activeElement;
    setIsModalImageLoading(true);
    setModalState({ isOpen: true, proofs: proofs, currentIndex: 0 });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setIsModalImageLoading(true);
    setModalState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex === prev.proofs.length - 1 ? 0 : prev.currentIndex + 1
    }));
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setIsModalImageLoading(true);
    setModalState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.proofs.length - 1 : prev.currentIndex - 1
    }));
  };

  // Mencegah scroll layar saat modal terbuka & Listener Keyboard
  useEffect(() => {
    if (modalState.isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Tab') {
          const focusable = document.querySelectorAll('[data-gallery-dialog] button:not([disabled])');
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
        lastFocusedElementRef.current?.focus();
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [modalState.isOpen, modalState.proofs]);

  return (
    <section className="game-section relative z-10 py-20 md:py-28" id="experience">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <p className="game-section-label font-syne-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase mb-4 reveal-item" data-delay="0">
          <span className="game-label-icon">03</span> Career / Milestones
        </p>
        <h2 className="game-section-title font-syne text-[clamp(32px,4vw,52px)] font-[800] leading-[1.02] mb-10 reveal-item" data-delay="100">
          Quest log.
        </h2>

        <div className="game-quest-list relative max-w-[1040px] pl-6 sm:pl-9">
          <div className="flex flex-col gap-[64px]">
            {EXPERIENCE.map((item, i) => (
              <div className="game-quest-entry relative reveal-item" data-delay={String(i * 100 + 150)} key={item.role}>
                <div className="game-panel game-quest-card flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8 p-5 sm:p-7">
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline flex-wrap gap-2 mb-[6px]">
                      <span className="game-card-title font-syne text-[21px] font-[700]">
                        {item.role}
                      </span>
                      <span className="game-period font-syne-mono text-[9px] tracking-[0.04em] whitespace-nowrap">
                        {item.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-[10px] mb-[18px]">
                      <span className="game-highlight text-[13px] font-[600]">{item.org}</span>
                      <span className="game-tag game-tag-coral font-syne-mono text-[8px] tracking-[0.08em] uppercase px-2 py-1">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-[13px] text-port-text-dim leading-[1.75] mb-4 max-w-[600px]">
                      {item.desc}
                    </p>

                    <ul className="flex flex-col gap-[10px]">
                      {item.bullets.map((b) => (
                        <li key={b} className="game-quest-bullet text-[12px] text-port-text-dim leading-[1.6] pl-5 relative">
                          <span className="absolute left-0 top-0 font-[800]">✦</span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    <p className="game-stack font-syne-mono text-[9px] mt-4 tracking-[0.04em]">
                      LOOT: {item.stack}
                    </p>
                  </div>

                  {item.proofs && item.proofs.length > 0 && (
                    <div className="flex flex-col items-start md:items-end gap-[12px] shrink-0 w-[200px]">
                      <button
                        type="button"
                        aria-label={`Open ${item.org} gallery`}
                        onClick={() => openModal(item.proofs)}
                        className="game-proof-button relative w-full h-[130px] md:w-[190px] rounded-lg flex items-center justify-center group cursor-pointer overflow-hidden transition-all duration-300"
                      >
                        <img
                          src={item.proofs[0].src}
                          alt={item.proofs[0].alt}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/200x130/1A2235/00F5C4?text=Missing+Image";
                          }}
                        />

                        {item.proofs.length > 1 && (
                          <div className="game-proof-count absolute bottom-2 left-2 px-2 py-1 rounded text-[9px] font-syne-mono z-10">
                            +{item.proofs.length - 1} files
                          </div>
                        )}

                        <svg className="absolute top-[10px] right-[10px] w-4 h-4 text-port-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </button>

                      <div className="game-proof-label flex items-center gap-[6px] font-syne-mono text-[9px] tracking-[0.08em] uppercase pl-1 md:pr-1">
                        <svg className="w-[14px] h-[14px] text-port-text-dim" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                        {item.proofs[0].label}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalState.isOpen && modalState.proofs.length > 0 && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modalState.proofs[modalState.currentIndex].label}
          data-gallery-dialog
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 bg-[#151d35]/95 backdrop-blur-xl transition-opacity duration-300"
          onClick={closeModal}
        >
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close image gallery"
            className="absolute top-6 right-6 md:top-10 md:right-10 text-port-text-muted hover:text-port-teal transition-colors duration-200 cursor-pointer p-2 z-[10000]"
            onClick={closeModal}
          >
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-w-6xl w-full max-h-[85vh] rounded-[4px] border border-port-grid bg-port-surface overflow-hidden shadow-[0_0_50px_rgba(0,245,196,0.05)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-[40px] bg-port-bg border-b border-port-grid flex items-center px-4 gap-2 z-10">
               <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
               <span className="font-syne-mono text-[10px] text-port-text-muted ml-3 uppercase tracking-widest">
                 {modalState.proofs[modalState.currentIndex].label}
               </span>

               {modalState.proofs.length > 1 && (
                  <span className="font-syne-mono text-[10px] text-port-teal ml-auto tracking-widest">
                    {modalState.currentIndex + 1} / {modalState.proofs.length}
                  </span>
               )}
            </div>

            <div className="relative w-full h-full bg-[#05070A] pt-[40px] flex items-center justify-center">

              {isModalImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center pt-[40px] z-0">
                  <div className="w-10 h-10 border-2 border-port-grid border-t-port-teal rounded-full animate-spin shadow-[0_0_15px_rgba(0,245,196,0.2)]" />
                </div>
              )}

              {modalState.proofs.length > 1 && (
                <button type="button" aria-label="Previous image" onClick={prevImage} className="absolute left-4 w-10 h-10 rounded-full bg-port-bg/80 border border-port-grid flex items-center justify-center text-port-text-primary hover:text-port-teal hover:border-port-teal transition-all duration-200 z-20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>
              )}

              <img
                key={modalState.currentIndex}
                src={modalState.proofs[modalState.currentIndex].src}
                alt={modalState.proofs[modalState.currentIndex].alt}
                onLoad={() => setIsModalImageLoading(false)}
                className={`relative z-10 w-full h-full object-contain max-h-[calc(85vh-40px)] transition-opacity duration-300 ${isModalImageLoading ? 'opacity-0' : 'opacity-100'}`}
                onError={(e) => {
                  e.target.onerror = null;
                  setIsModalImageLoading(false);
                  e.target.src = "https://via.placeholder.com/800x600/1A2235/00F5C4?text=Image+Not+Found";
                }}
              />

              {modalState.proofs.length > 1 && (
                <button type="button" aria-label="Next image" onClick={nextImage} className="absolute right-4 w-10 h-10 rounded-full bg-port-bg/80 border border-port-grid flex items-center justify-center text-port-text-primary hover:text-port-teal hover:border-port-teal transition-all duration-200 z-20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </button>
              )}

            </div>
          </div>

          {modalState.proofs.length > 1 && (
             <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3" onClick={(e) => e.stopPropagation()}>
                {modalState.proofs.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Show image ${idx + 1}`}
                    aria-current={modalState.currentIndex === idx ? "true" : undefined}
                    onClick={() => {
                      setIsModalImageLoading(true); // PERBAIKAN: Set loading di titik pagination
                      setModalState(prev => ({ ...prev, currentIndex: idx }))
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${modalState.currentIndex === idx ? 'bg-port-teal w-6' : 'bg-port-grid hover:bg-port-text-muted'}`}
                  />
                ))}
             </div>
          )}
        </div>,
        document.body
      )}
    </section>
  );
}
