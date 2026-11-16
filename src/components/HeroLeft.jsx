import React from 'react';
import { ChevronRight, Flame } from 'lucide-react';

export default function HeroLeft({
  burger,
  onAddToBag,
  buttonRef,
  t,
}) {
  return (
    <>
      <div className="fixed left-5 right-5 bottom-24 sm:bottom-auto sm:right-auto sm:left-12 lg:left-16 xl:left-20 sm:top-[54%] sm:-translate-y-1/2 z-30 sm:max-w-sm lg:max-w-md pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle text-[10px] font-bold tracking-[0.18em] uppercase text-amber-300 mb-3">
          <Flame className="w-3 h-3 text-amber-400" aria-hidden="true" />
          <span>{burger.badge}</span>
          <span aria-hidden="true" className="text-white/30">•</span>
          <span className="text-white font-black">{burger.price}</span>
          <span aria-hidden="true" className="text-white/30 hidden sm:inline">•</span>
          <span className="text-zinc-300 hidden sm:inline">{burger.calories}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white uppercase leading-[0.98] mb-2 font-outfit drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          <span className="block transition-all duration-300">{burger.titleLine1}</span>
          <span className="block text-white transition-all duration-300">{burger.titleLine2}</span>
        </h1>

        <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-300 mt-2 mb-5 max-w-[300px] leading-relaxed transition-all duration-300">
          {burger.subtitle}
        </p>

        <div>
          <button
            type="button"
            ref={buttonRef}
            onClick={() => onAddToBag(burger)}
            className="cta-pill-button group relative inline-flex items-center gap-3.5 pl-5 pr-1.5 py-1.5 rounded-full cursor-pointer min-h-[44px]"
          >
            <span className="text-[11px] sm:text-xs font-black tracking-[0.18em] text-white uppercase font-outfit">
              {t?.addToBag || 'ADD TO BAG'}
            </span>

            <span className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 shadow-md">
              <ChevronRight className="w-4 h-4 stroke-[3]" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>

      {/* Far-Left Vertical Social Icons Stack */}
      <aside
        aria-label="Social channels"
        className="hidden sm:flex fixed left-6 sm:left-12 lg:left-16 xl:left-20 bottom-6 sm:bottom-8 z-30 flex-col items-center gap-3 pointer-events-auto"
      >
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rocky's on Facebook"
          className="p-2 text-white/80 hover:text-amber-400 hover:scale-110 transition-all duration-200"
          title="Facebook"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
          </svg>
        </a>

        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rocky's on X"
          className="p-2 text-white/80 hover:text-amber-400 hover:scale-110 transition-all duration-200"
          title="X (Twitter)"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
          </svg>
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rocky's on Instagram"
          className="p-2 text-white/80 hover:text-amber-400 hover:scale-110 transition-all duration-200"
          title="Instagram"
        >
          <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
      </aside>
    </>
  );
}
