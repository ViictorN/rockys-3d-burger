import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroRight({
  nextBurger,
  thirdBurger,
  onPrev,
  onNext,
}) {
  return (
    <aside
      aria-label="Burger carousel controls"
      className="fixed right-4 sm:right-10 lg:right-14 xl:right-16 top-[22%] sm:top-[58%] -translate-y-1/2 z-30 flex items-center gap-2.5 sm:gap-5 pointer-events-auto"
    >
      <div className="flex flex-col items-center justify-center py-1.5 px-1 rounded-full bg-black/65 border border-white/15 backdrop-blur-md shadow-2xl">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous signature burger"
          className="p-2 text-white/75 hover:text-white hover:scale-115 transition-all duration-200 cursor-pointer"
          title="Previous Burger"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next signature burger"
          className="p-2 text-white/75 hover:text-white hover:scale-115 transition-all duration-200 cursor-pointer"
          title="Next Burger"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      <div className="relative flex items-center gap-3">
        <button
          type="button"
          onClick={onNext}
          aria-label={`View ${nextBurger.titleLine1} ${nextBurger.titleLine2}`}
          className="relative w-20 sm:w-34 lg:w-40 h-20 sm:h-34 lg:h-40 rounded-2xl overflow-hidden cursor-pointer group border border-white/15 bg-black/50 shadow-[0_16px_36px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.04] hover:border-amber-400/50 text-left"
          title={`View ${nextBurger.titleLine1} ${nextBurger.titleLine2}`}
        >
          <img
            src={nextBurger.nextThumb}
            alt={nextBurger.nextTitle}
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
        </button>

        {thirdBurger && (
          <button
            type="button"
            onClick={onNext}
            aria-label={`Preview upcoming ${thirdBurger.titleLine1} ${thirdBurger.titleLine2}`}
            className="relative hidden md:block w-14 lg:w-16 h-28 sm:h-34 lg:h-40 rounded-2xl overflow-hidden cursor-pointer opacity-50 border border-white/10 bg-black/50 filter blur-[0.5px] transition-all duration-300 hover:opacity-80"
          >
            <img
              src={thirdBurger.nextThumb}
              alt={thirdBurger.nextTitle}
              className="w-full h-full object-cover object-center filter brightness-75"
            />
          </button>
        )}
      </div>
    </aside>
  );
}
