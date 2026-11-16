import React from 'react';
import { X, ChefHat, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function MenuDrawer({
  isOpen,
  onClose,
  onSelectBurger,
  burgers = [],
  onOpenBuilder,
  onOpenExploded,
  onOpenSection,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-drawer-title"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg h-full bg-[#110e0c] border-l border-white/10 flex flex-col p-5 sm:p-8 shadow-2xl overflow-y-auto glass-panel">
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/20 bg-amber-500/10 flex items-center justify-center text-amber-400 font-black">
              R
            </div>
            <div>
              <h2
                id="menu-drawer-title"
                className="text-xl sm:text-2xl font-black font-outfit text-white tracking-wide uppercase leading-tight"
              >
                ROCKY'S CRAFT KITCHEN
              </h2>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                EST. 2024 • HANDCRAFTED DAILY
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Navigation Drawer"
            className="w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 py-5 border-b border-white/10">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
              if (onOpenBuilder) onOpenBuilder();
            }}
            className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 hover:border-amber-400 text-left transition-all cursor-pointer group"
          >
            <ChefHat className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-black text-white uppercase">CRAFT STUDIO</div>
            <div className="text-[10px] text-zinc-300 mt-0.5">Build your own burger</div>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
              if (onOpenExploded) onOpenExploded();
            }}
            className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all cursor-pointer group"
          >
            <Layers className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-black text-white uppercase">EXPLODED VIEW</div>
            <div className="text-[10px] text-zinc-300 mt-0.5">Inspect 6 culinary layers</div>
          </button>
        </div>

        <nav
          aria-label="Menu sections"
          className="py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-black uppercase tracking-wider text-zinc-300"
        >
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
              onOpenSection('snacks');
            }}
            className="py-2 px-3 rounded-lg hover:text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            Snacks & Sides
          </button>
          <span aria-hidden="true" className="text-zinc-600">•</span>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
              onOpenSection('drinks');
            }}
            className="py-2 px-3 rounded-lg hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            Craft Drinks
          </button>
          <span aria-hidden="true" className="text-zinc-600">•</span>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
              onOpenSection('contacts');
            }}
            className="py-2 px-3 rounded-lg hover:text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            Kitchens & FAQ
          </button>
        </nav>

        <div className="flex-1 py-5 flex flex-col gap-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">
            FEATURED SIGNATURE BURGERS
          </h3>

          <div className="flex flex-col gap-3">
            {burgers.map((b, idx) => (
              <button
                type="button"
                key={b.id}
                onClick={() => {
                  playClickSound();
                  onSelectBurger(idx);
                  onClose();
                }}
                className="w-full text-left group p-4 rounded-2xl bg-zinc-950/60 border border-white/10 hover:border-amber-400/50 hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-xs font-black text-amber-400 flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black font-outfit text-white uppercase group-hover:text-amber-400 transition-colors truncate">
                      {b.titleLine1} {b.titleLine2}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                      {b.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-white block">{b.price}</span>
                  <span className="text-[10px] font-bold text-amber-400 flex items-center justify-end gap-1">
                    <span>VIEW</span>
                    <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 text-xs text-zinc-300 mt-auto">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Rocky's Standard</span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400">
            100% prime Black Angus smashed at 500°F on cast iron. 24h herb-brined buttermilk fried chicken. Brioche baked fresh every morning.
          </p>
        </div>
      </div>
    </div>
  );
}
