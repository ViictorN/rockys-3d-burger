import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, ChefHat } from 'lucide-react';
import { BUILDER_OPTIONS } from '../data/burgersData';
import { playClickSound, playSizzleSound, playCrunchSound, playChimeSound } from '../utils/audioEffects';
import confetti from 'canvas-confetti';

export default function BurgerBuilderModal({ isOpen, onClose, onAddCustomBurger }) {
  const [selectedBun, setSelectedBun] = useState(BUILDER_OPTIONS.buns[0]);
  const [selectedPatty, setSelectedPatty] = useState(BUILDER_OPTIONS.patties[0]);
  const [selectedCheese, setSelectedCheese] = useState(BUILDER_OPTIONS.cheeses[0]);
  const [selectedToppings, setSelectedToppings] = useState([
    BUILDER_OPTIONS.toppings[0],
    BUILDER_OPTIONS.toppings[1],
  ]);
  const [selectedSauces, setSelectedSauces] = useState([
    BUILDER_OPTIONS.sauces[0],
  ]);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open && typeof dialog.showModal === 'function') {
        try {
          dialog.showModal();
        } catch {
          // Fallback handled safely
        }
      }
    } else if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleTopping = (topping) => {
    playCrunchSound();
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      }
      return [...prev, topping];
    });
  };

  const toggleSauce = (sauce) => {
    playClickSound();
    setSelectedSauces((prev) => {
      const exists = prev.find((s) => s.id === sauce.id);
      if (exists) {
        return prev.filter((s) => s.id !== sauce.id);
      }
      return [...prev, sauce];
    });
  };

  const totalPrice =
    selectedBun.price +
    selectedPatty.price +
    selectedCheese.price +
    selectedToppings.reduce((acc, t) => acc + t.price, 0) +
    selectedSauces.reduce((acc, s) => acc + s.price, 0);

  const totalCalories =
    selectedBun.cal +
    selectedPatty.cal +
    selectedCheese.cal +
    selectedToppings.reduce((acc, t) => acc + t.cal, 0) +
    selectedSauces.reduce((acc, s) => acc + s.cal, 0);

  const handleFinishBurger = () => {
    playSizzleSound();
    playChimeSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ea580c', '#ffffff'],
    });

    const toppingsText =
      selectedToppings.length > 0
        ? selectedToppings.map((t) => t.name).join(', ')
        : 'no extra toppings';
    const saucesText =
      selectedSauces.length > 0
        ? selectedSauces.map((s) => s.name).join(', ')
        : 'no sauce';

    const customBurger = {
      id: `custom-${Date.now()}`,
      titleLine1: 'CUSTOM CRAFT',
      titleLine2: 'BURGER',
      subtitle: `${selectedPatty.name} on ${selectedBun.name}`,
      description: `Custom build with ${selectedCheese.name}, ${toppingsText}, and ${saucesText}.`,
      price: `$${totalPrice.toFixed(2)}`,
      calories: `${totalCalories} kcal`,
      heroImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    };

    onAddCustomBurger(customBurger);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      role="dialog"
      aria-modal="true"
      aria-labelledby="builder-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="rocky-dialog p-3 sm:p-6"
    >
      <div className="w-full max-w-4xl mx-auto max-h-[88dvh] bg-[#120e0b] border border-white/15 rounded-3xl p-5 sm:p-8 flex flex-col shadow-2xl overflow-hidden glass-panel">
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="builder-modal-title"
                className="text-lg sm:text-2xl font-black font-outfit text-white tracking-wide uppercase leading-tight"
              >
                BURGER CRAFT STUDIO
              </h3>
              <p className="text-[11px] font-medium text-zinc-400">
                Design your personalized culinary stack with live ingredient pricing & macros.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Burger Craft Studio"
            className="w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 flex flex-col gap-6 pr-1">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block mb-2.5">
                1. Select Artisan Bun
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BUILDER_OPTIONS.buns.map((bun) => {
                  const isSelected = selectedBun.id === bun.id;
                  return (
                    <button
                      type="button"
                      key={bun.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedBun(bun);
                      }}
                      aria-pressed={isSelected}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                          : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold leading-tight">{bun.name}</div>
                        <div className="text-[10px] text-zinc-400">{bun.cal} kcal</div>
                      </div>
                      <span className="text-xs font-extrabold text-amber-400">
                        {bun.price === 0 ? 'FREE' : `+$${bun.price.toFixed(2)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block mb-2.5">
                2. Select Gourmet Patty
              </span>
              <div className="flex flex-col gap-2">
                {BUILDER_OPTIONS.patties.map((patty) => {
                  const isSelected = selectedPatty.id === patty.id;
                  return (
                    <button
                      type="button"
                      key={patty.id}
                      onClick={() => {
                        playSizzleSound();
                        setSelectedPatty(patty);
                      }}
                      aria-pressed={isSelected}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                          : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-extrabold leading-tight">{patty.name}</div>
                        <div className="text-[10px] text-zinc-400">{patty.cal} kcal</div>
                      </div>
                      <span className="text-xs font-black text-amber-400">
                        ${patty.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block mb-2.5">
                3. Melted Cheese
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BUILDER_OPTIONS.cheeses.map((cheese) => {
                  const isSelected = selectedCheese.id === cheese.id;
                  return (
                    <button
                      type="button"
                      key={cheese.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedCheese(cheese);
                      }}
                      aria-pressed={isSelected}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                          : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <div className="text-[11px] font-bold leading-tight">{cheese.name}</div>
                      <span className="text-[10px] font-extrabold text-amber-400 mt-1">
                        {cheese.price === 0 ? 'None' : `+$${cheese.price.toFixed(2)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block mb-2.5">
                4. Fresh Toppings (Select Any)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BUILDER_OPTIONS.toppings.map((topping) => {
                  const isSelected = selectedToppings.some((t) => t.id === topping.id);
                  return (
                    <button
                      type="button"
                      key={topping.id}
                      onClick={() => toggleTopping(topping)}
                      aria-pressed={isSelected}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white'
                          : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <span className="text-xs font-bold">{topping.name}</span>
                      <span className="text-[10px] font-bold text-amber-400">
                        +${topping.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block mb-2.5">
                5. Signature Sauces
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BUILDER_OPTIONS.sauces.map((sauce) => {
                  const isSelected = selectedSauces.some((s) => s.id === sauce.id);
                  return (
                    <button
                      type="button"
                      key={sauce.id}
                      onClick={() => toggleSauce(sauce)}
                      aria-pressed={isSelected}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white'
                          : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <span className="text-xs font-bold">{sauce.name}</span>
                      <span className="text-[10px] font-bold text-amber-400">
                        +${sauce.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-between bg-zinc-950/70 border border-white/10 rounded-2xl p-5 shadow-xl">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-white/10">
                LIVE STACK PREVIEW
              </h4>

              <div className="flex flex-col-reverse gap-1.5 py-4 items-center">
                <div className="w-full py-1.5 rounded-lg bg-amber-800/80 text-white text-[10px] font-black uppercase text-center border border-amber-600/40">
                  {selectedBun.name} (Bottom)
                </div>
                {selectedSauces.map((s) => (
                  <div
                    key={s.id}
                    className="w-4/5 py-1 rounded bg-orange-600/70 text-white text-[9px] font-bold uppercase text-center"
                  >
                    {s.name}
                  </div>
                ))}
                <div className="w-full py-2.5 rounded-lg bg-amber-950 text-amber-200 text-xs font-black uppercase text-center border border-amber-800 shadow-md">
                  {selectedPatty.name}
                </div>
                {selectedCheese.id !== 'none' && (
                  <div className="w-11/12 py-1.5 rounded bg-yellow-500/80 text-black text-[10px] font-extrabold uppercase text-center">
                    {selectedCheese.name}
                  </div>
                )}
                {selectedToppings.map((t) => (
                  <div
                    key={t.id}
                    className="w-4/5 py-1 rounded bg-emerald-800/70 text-emerald-100 text-[9px] font-bold uppercase text-center"
                  >
                    {t.name}
                  </div>
                ))}
                <div className="w-full py-2 rounded-lg bg-amber-700 text-white text-[10px] font-black uppercase text-center border border-amber-500 shadow-md">
                  {selectedBun.name} (Top)
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Est. Nutrition</span>
                  <span className="font-extrabold text-amber-400">{totalCalories} kcal</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block uppercase">Total Price</span>
                  <span className="text-lg font-black text-white">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishBurger}
              className="mt-6 w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold uppercase tracking-widest text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ADD CUSTOM BURGER TO BAG</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
