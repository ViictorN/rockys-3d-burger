import React from 'react';
import { Plus, Star, Sparkles, X, ChevronRight } from 'lucide-react';
import { DRINKS } from '../data/burgersData';
import { playChimeSound } from '../utils/audioEffects';
import confetti from 'canvas-confetti';

export default function DrinksView({ onAddToBag, onClose }) {
  const handleAddDrink = (drink, e) => {
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
        colors: ['#38bdf8', '#818cf8', '#ffffff'],
      });
    }

    onAddToBag({
      id: drink.id,
      titleLine1: drink.title,
      titleLine2: 'DRINK',
      subtitle: drink.subtitle,
      price: drink.price,
      calories: drink.calories,
      heroImage: drink.image,
    });
  };

  return (
    <section
      aria-labelledby="drinks-heading"
      className="fixed inset-0 z-30 pt-24 pb-24 px-5 sm:px-12 lg:px-20 overflow-y-auto bg-gradient-to-b from-[#090b0e]/95 via-[#0d1217]/98 to-[#06080a] backdrop-blur-xl card-container-shell"
    >
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          <button
            type="button"
            onClick={onClose}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" aria-hidden="true" />
          <span className="text-cyan-400">Craft Drinks</span>
        </nav>

        <div className="flex items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Craft Beverages & Shakes</span>
            </div>
            <h2
              id="drinks-heading"
              className="text-3xl sm:text-5xl font-black font-outfit text-white tracking-tight uppercase"
            >
              COLD SIPS & SHAKES
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
              House-churned custard shakes with Valrhona chocolates, craft sodas brewed with Madagascar vanilla beans, and refreshing cold botanicals.
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
          {DRINKS.map((drink) => (
            <article
              key={drink.id}
              className="group relative rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-cyan-400/50 p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(34,211,238,0.12)]"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-zinc-900">
                <img
                  src={drink.image}
                  alt={drink.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 border border-white/15 text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 backdrop-blur-md">
                  {drink.badge}
                </span>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-bold text-white bg-black/65 px-2 py-0.5 rounded-md backdrop-blur-md">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{drink.rating}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black font-outfit text-white tracking-wide uppercase line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {drink.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-cyan-400 tracking-wide uppercase mt-0.5 mb-2">
                    {drink.subtitle}
                  </p>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-4">
                    {drink.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                  <div>
                    <span className="text-lg font-black font-outfit text-white tracking-tight">
                      {drink.price}
                    </span>
                    <span className="block text-[10px] font-medium text-zinc-400">
                      {drink.calories}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAddDrink(drink, e)}
                    aria-label={`Add ${drink.title} to bag`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all transform active:scale-95 cursor-pointer"
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
