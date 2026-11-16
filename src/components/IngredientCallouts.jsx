import React from 'react';
import { Html } from '@react-three/drei';

export default function IngredientCallouts({ visible = true, burgerType = 'chicken' }) {
  if (!visible) return null;

  const data = {
    chicken: [
      {
        id: 'bun',
        position: [-0.35, 1.45, 0.1],
        title: 'Artisan Brioche',
        detail: 'Golden toasted bun with white & black sesame',
        linePath: 'M 0 0 L 35 -35 L 110 -35',
        offsetX: 115,
        offsetY: -50,
      },
      {
        id: 'chicken',
        position: [-0.4, 0.72, 0.55],
        title: 'Buttermilk Fried Chicken',
        detail: '24hr herb brined, ultra-crispy double crust',
        linePath: 'M 0 0 L -40 20 L -120 20',
        offsetX: -260,
        offsetY: 0,
      },
      {
        id: 'lettuce',
        position: [-0.65, 0.42, 0.35],
        title: 'Crisp Romaine Lettuce',
        detail: 'Farm-fresh ruffled green crunch',
        linePath: 'M 0 0 L -35 -25 L -100 -25',
        offsetX: -230,
        offsetY: -40,
      },
      {
        id: 'fries',
        position: [0.85, 0.95, -0.1],
        title: 'Idaho Hand-Cut Fries',
        detail: 'Crisped in peanut oil with flake sea salt',
        linePath: 'M 0 0 L 40 -30 L 120 -30',
        offsetX: 125,
        offsetY: -45,
      },
    ],
    smash: [
      {
        id: 'bun',
        position: [-0.35, 1.4, 0.1],
        title: 'Glazed Brioche Bun',
        detail: 'Butter toasted to golden brown perfection',
        linePath: 'M 0 0 L 35 -35 L 110 -35',
        offsetX: 115,
        offsetY: -50,
      },
      {
        id: 'patty',
        position: [-0.35, 0.65, 0.5],
        title: 'Double Angus Beef',
        detail: 'Smashed with caramelized lacy edges',
        linePath: 'M 0 0 L -40 20 L -120 20',
        offsetX: -260,
        offsetY: 0,
      },
      {
        id: 'cheese',
        position: [-0.6, 0.5, 0.3],
        title: 'Melted Cheddar & Sauce',
        detail: 'Aged Wisconsin cheddar & secret relish',
        linePath: 'M 0 0 L -35 -25 L -100 -25',
        offsetX: -230,
        offsetY: -40,
      },
      {
        id: 'fries',
        position: [0.85, 0.95, -0.1],
        title: 'Wire Basket Fries',
        detail: 'Piping hot, seasoned with rosemary salt',
        linePath: 'M 0 0 L 40 -30 L 120 -30',
        offsetX: 125,
        offsetY: -45,
      },
    ],
    triple: [
      {
        id: 'bun',
        position: [-0.35, 1.5, 0.1],
        title: 'Signature Bun',
        detail: 'Toasted with black seed sprinkle',
        linePath: 'M 0 0 L 35 -35 L 110 -35',
        offsetX: 115,
        offsetY: -50,
      },
      {
        id: 'layers',
        position: [-0.35, 0.8, 0.5],
        title: 'Triple Stack Patties',
        detail: 'Prime beef, hardwood smoked bacon strips',
        linePath: 'M 0 0 L -40 20 L -120 20',
        offsetX: -260,
        offsetY: 0,
      },
      {
        id: 'bbq',
        position: [-0.6, 0.55, 0.3],
        title: 'Smoky Bourbon BBQ',
        detail: 'Tangy barbecue glaze & crispy shallots',
        linePath: 'M 0 0 L -35 -25 L -100 -25',
        offsetX: -230,
        offsetY: -40,
      },
      {
        id: 'fries',
        position: [0.85, 0.95, -0.1],
        title: 'Crispy Fries',
        detail: 'Double fried to deep golden perfection',
        linePath: 'M 0 0 L 40 -30 L 120 -30',
        offsetX: 125,
        offsetY: -45,
      },
    ],
  };

  const callouts = data[burgerType] || data.chicken;

  return (
    <group>
      {callouts.map((c) => (
        <group key={c.id} position={c.position}>
          <Html center distanceFactor={7} zIndexRange={[100, 0]}>
            <div className="relative pointer-events-none select-none">
              {/* Pulsing center indicator dot */}
              <div className="relative flex items-center justify-center">
                <span className="absolute w-6 h-6 rounded-full bg-amber-500/25 animate-ping" />
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-white/80 shadow-[0_0_12px_#f59e0b]" />
              </div>

              {/* Animated connecting line */}
              <svg
                className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none"
                style={{ width: '1px', height: '1px' }}
              >
                <path
                  d={c.linePath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="180"
                  strokeDashoffset="0"
                  className="animate-draw-line opacity-80"
                />
              </svg>

              {/* Floating ingredient card badge */}
              <div
                className="absolute glass-panel rounded-xl px-3.5 py-2 shadow-2xl transition-all duration-300 min-w-[170px]"
                style={{
                  transform: `translate(${c.offsetX}px, ${c.offsetY}px)`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[11px] font-bold tracking-wider text-amber-300 uppercase">
                    {c.title}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-300 leading-tight">
                  {c.detail}
                </p>
              </div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
