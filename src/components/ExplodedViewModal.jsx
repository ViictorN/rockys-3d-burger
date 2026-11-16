import React, { useState, useEffect, useRef } from 'react';
import { X, Layers, Sparkles, Volume2, Info } from 'lucide-react';
import { playClickSound, playCrunchSound, playSizzleSound } from '../utils/audioEffects';

export default function ExplodedViewModal({ isOpen, onClose, burger }) {
  const [activeLayer, setActiveLayer] = useState(0);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open && typeof dialog.showModal === 'function') {
        try {
          dialog.showModal();
        } catch {
          // Fallback handled by open attribute
        }
      }
    } else if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const layers = [
    {
      title: 'ARTISAN BRIOCHE CROWN',
      desc: 'Double-proofed French brioche baked daily at 5:00 AM. Brushed with pure clarified butter and showered with toasted ivory sesame seeds.',
      origin: 'Normandy Butter & Heritage Wheat',
      macro: '180 kcal • 4g Protein',
      sound: 'crunch',
    },
    {
      title: 'SMOKED PAPRIKA TRUFFLE AIOLI',
      desc: 'Slow-emulsified cage-free egg yolks with Spanish smoked pimentón de la Vera, confit garlic, and white Alba truffle essence.',
      origin: 'Extremadura, Spain',
      macro: '90 kcal • 9g Healthy Fats',
      sound: 'click',
    },
    {
      title: '24-HOUR HERB BRINED BUTTERMILK CHICKEN',
      desc: 'Free-range air-chilled chicken breast brined in whole buttermilk, rosemary, and thyme, double dredged in 11 secret spices and fried at 345°F.',
      origin: 'Lancaster Heritage Poultry Farms',
      macro: '360 kcal • 42g Protein',
      sound: 'sizzle',
    },
    {
      title: '18-MONTH AGED WISCONSIN CHEDDAR',
      desc: 'Lactobacillus-aged sharp white cheddar melted gently over the hot chicken cutlet using a culinary steam dome for optimal pull.',
      origin: 'Green County, Wisconsin',
      macro: '110 kcal • 7g Protein',
      sound: 'click',
    },
    {
      title: 'HYDROPONIC RUFFLED ROMAINE',
      desc: 'Harvested daily from local indoor hydroponic vertical farms. Flash-chilled in ice water for maximum cold, crisp snap against the hot fried patty.',
      origin: 'Vertical Aqua Farms NY',
      macro: '10 kcal • High Vitamin A & K',
      sound: 'crunch',
    },
    {
      title: 'TOASTED BRIOCHE BASE',
      desc: 'Thick-cut heel griddled on cast iron with beef tallow and sea salt to create an impenetrable barrier that keeps the bun fluffy without getting soggy.',
      origin: 'Cast Iron Hearth Bake',
      macro: '140 kcal • 3g Protein',
      sound: 'crunch',
    },
  ];

  const handleSelectLayer = (idx) => {
    setActiveLayer(idx);
    const item = layers[idx];
    if (item.sound === 'sizzle') playSizzleSound();
    else if (item.sound === 'crunch') playCrunchSound();
    else playClickSound();
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exploded-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="rocky-dialog p-3 sm:p-6"
    >
      <div className="w-full max-w-4xl mx-auto max-h-[88dvh] bg-[#110d0a] border border-white/15 rounded-3xl p-5 sm:p-8 flex flex-col shadow-2xl overflow-hidden glass-panel">
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="exploded-modal-title"
                className="text-lg sm:text-2xl font-black font-outfit text-white tracking-wide uppercase leading-tight"
              >
                ANATOMY & ARTISANAL LAYERS
              </h3>
              <p className="text-[11px] font-medium text-zinc-400">
                Exploded structural view of {burger.titleLine1} {burger.titleLine2}. Click any layer to inspect provenance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close exploded anatomy dialog"
            className="w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="md:col-span-5 flex flex-col gap-2 py-2 items-center">
            {layers.map((layer, idx) => {
              const isSelected = activeLayer === idx;
              return (
                <button
                  type="button"
                  key={layer.title}
                  onClick={() => handleSelectLayer(idx)}
                  aria-pressed={isSelected}
                  className={`w-full py-3 px-4 rounded-xl border text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/25 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]'
                      : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-black/60 border border-white/15 text-[10px] font-black flex items-center justify-center text-amber-400 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black uppercase tracking-wide truncate">
                      {layer.title}
                    </span>
                  </div>
                  {isSelected && <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="md:col-span-7 flex flex-col justify-between h-full bg-zinc-950/80 border border-white/15 rounded-2xl p-5 sm:p-8 shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3" />
                <span>Layer {activeLayer + 1} of {layers.length} Provenance</span>
              </div>

              <h4 className="text-xl sm:text-3xl font-black font-outfit text-white tracking-tight uppercase mb-2">
                {layers[activeLayer].title}
              </h4>

              <div className="flex flex-wrap items-center gap-3 text-xs text-amber-300/90 font-bold uppercase mb-4">
                <span>Origin: {layers[activeLayer].origin}</span>
                <span aria-hidden="true">•</span>
                <span>{layers[activeLayer].macro}</span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {layers[activeLayer].desc}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Info className="w-3.5 h-3.5" />
                <span>Synthesized culinary audio feedback</span>
              </span>

              <button
                type="button"
                onClick={() => handleSelectLayer((activeLayer + 1) % layers.length)}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Next Layer →
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
