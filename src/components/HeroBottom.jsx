import React from 'react';

export default function HeroBottom({
  burger,
  burgers = [],
  currentIndex = 0,
  onSelectIndex,
  currentLang = 'EN',
  onSelectLang,
}) {
  const languages = ['EN', 'ES', 'AR'];

  return (
    <footer className="fixed bottom-0 left-0 w-full z-30 px-4 sm:px-10 lg:px-14 py-3.5 sm:py-6 flex items-end justify-between gap-2 pointer-events-none">
      <div className="w-12 sm:w-20 hidden sm:block" />

      <div className="flex-1 flex flex-col items-center justify-center gap-1 sm:gap-2 pointer-events-auto min-w-0">
        <p className="hidden sm:block text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-zinc-300 drop-shadow-md text-center transition-all duration-300 truncate max-w-full">
          {burger.subtitle}
        </p>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Burger slides">
          {burgers.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                type="button"
                key={item.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectIndex(idx)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer group"
                title={`Switch to ${item.titleLine1} ${item.titleLine2}`}
                aria-label={`Switch to ${item.titleLine1} ${item.titleLine2}`}
              >
                <span
                  className={`transition-all duration-300 rounded-full block ${
                    isActive
                      ? 'w-2.5 h-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-110'
                      : 'w-2.5 h-2.5 border-[1.5px] border-white/50 bg-transparent group-hover:border-white group-hover:scale-105'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase pointer-events-auto text-zinc-400 shrink-0">
        {languages.map((lang, idx) => (
          <React.Fragment key={lang}>
            <button
              type="button"
              onClick={() => onSelectLang(lang)}
              aria-pressed={currentLang === lang}
              className={`px-1 py-1.5 transition-colors duration-200 cursor-pointer ${
                currentLang === lang
                  ? 'text-white font-extrabold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {lang}
            </button>
            {idx < languages.length - 1 && (
              <span className="text-zinc-700 select-none" aria-hidden="true">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </footer>
  );
}
