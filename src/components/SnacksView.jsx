import React from 'react';
import { Plus, Star, Sparkles, X, ChevronRight } from 'lucide-react';
import { SNACKS } from '../data/burgersData';
import { playCrunchSound, playChimeSound } from '../utils/audioEffects';
import confetti from 'canvas-confetti';

export default function SnacksView({ onAddToBag, onClose }) {
  const handleAddSnack = (snack, e) => {
    playCrunchSound();
    playChimeSound();

    if (e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ['#f59e0b', '#ffd166', '#ffffff'],
      });
    }

    onAddToBag({
      id: snack.id,
      titleLine1: snack.title,
      titleLine2: 'SIDE',
      subtitle: snack.subtitle,
      price: snack.price,
      calories: snack.calories,
      heroImage: snack.image,
    });
  };

  return (
    <section
      aria-labelledby="snacks-heading"
      className="fixed inset-0 z-30 pt-24 pb-24 px-5 sm:px-12 lg:px-20 overflow-y-auto bg-gradient-to-b from-[#0e0b09]/95 via-[#130f0c]/98 to-[#0a0706] backdrop-blur-xl card-container-shell"
    >
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          <button
            type="button"
            onClick={onClose}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" aria-hidden="true" />
          <span className="text-amber-400">Snacks & Sides</span>
        </nav>

        <div className="flex items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artisanal Sides & Starters</span>
            </div>
            <h2
              id="snacks-heading"
              className="text-3xl sm:text-5xl font-black font-outfit text-white tracking-tight uppercase"
            >
              SNACKS & SIDES
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
              Double-fried in pure peanut oil, tossed in house botanical seasonings, and served piping hot in our wire presentation baskets.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Back to Hero showcase"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Back to Hero"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="card-container-grid deferred-list-section">
          {SNACKS.map((snack) => (
            <article
              key={snack.id}
              className="group relative rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-amber-400/50 p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(245,158,11,0.15)]"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-zinc-900">
                <img
                  src={snack.image}
                  alt={snack.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 border border-white/15 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 backdrop-blur-md">
                  {snack.badge}
                </span>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-bold text-white bg-black/65 px-2 py-0.5 rounded-md backdrop-blur-md">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{snack.rating}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black font-outfit text-white tracking-wide uppercase line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {snack.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-amber-400 tracking-wide uppercase mt-0.5 mb-2">
                    {snack.subtitle}
                  </p>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-4">
                    {snack.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                  <div>
                    <span className="text-lg font-black font-outfit text-white tracking-tight">
                      {snack.price}
                    </span>
                    <span className="block text-[10px] font-medium text-zinc-400">
                      {snack.calories}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAddSnack(snack, e)}
                    aria-label={`Add ${snack.title} to bag`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all transform active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
