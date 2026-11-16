import React from 'react';
import { Menu, Share2, ShoppingBag } from 'lucide-react';
import { NAV_LINKS } from '../data/burgersData';

export default function Navbar({
  cartCount = 0,
  onOpenCart,
  onOpenMenu,
  onOpenShare,
  activeTab = 'burgers',
  onSelectTab,
  t,
}) {
  return (
    <header className="fixed top-0 left-0 w-full z-40 px-4 sm:px-10 lg:px-14 py-4 sm:py-7 flex items-center justify-between pointer-events-auto">
      {/* Top Left: ROCKY'S Circular Emblem Logo */}
      <button
        type="button"
        onClick={() => onSelectTab && onSelectTab('burgers')}
        className="relative group cursor-pointer focus:outline-none p-1"
        aria-label="Rocky's Gourmet Burgers Home"
        title="Rocky's Gourmet Burgers"
      >
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full border-[1.5px] border-white/85 flex items-center justify-center p-1.5 transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-[0_0_16px_rgba(245,158,11,0.5)]">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full fill-none stroke-current text-white group-hover:text-amber-400 transition-colors"
            strokeWidth="4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M 22 40 C 22 22, 78 22, 78 40 Z" />
            <circle cx="38" cy="30" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="50" cy="26" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="62" cy="31" r="1.5" fill="currentColor" stroke="none" />
            <text
              x="50"
              y="53"
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              fontSize="12"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              letterSpacing="1"
            >
              ROCKY'S
            </text>
            <path d="M 20 62 Q 30 58, 40 62 T 60 62 T 80 62" strokeWidth="3" />
            <rect x="22" y="67" width="56" height="7" rx="3.5" strokeWidth="3" />
            <path d="M 24 78 C 24 87, 76 87, 76 78 Z" strokeWidth="3" />
          </svg>
        </div>
      </button>

      {/* Center Navigation Links */}
      <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8 lg:gap-11">
        {NAV_LINKS.map((item) => {
          const isActive = activeTab === item.id;
          const label = t?.[item.id] || item.label;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelectTab && onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative py-2 text-[11px] lg:text-xs tracking-[0.24em] uppercase transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-white font-extrabold'
                  : 'text-zinc-300 font-semibold hover:text-white'
              }`}
            >
              {label}
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Top Right: Bag, Menu & Share */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`Open Order Bag (${cartCount} items)`}
          className="relative w-11 h-11 rounded-full glass-panel-subtle flex items-center justify-center text-white/90 hover:text-amber-400 hover:border-amber-400/50 transition-all cursor-pointer"
          title="Open Order Bag"
        >
          <ShoppingBag className="w-4.5 h-4.5 stroke-[2.2]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center shadow-lg">
              {cartCount}
            </span>
          )}
        </button>

        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className="text-white/90 hover:text-amber-400 transition-colors p-1.5 cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>

          <button
            type="button"
            onClick={onOpenShare}
            aria-label="Share 3D Experience"
            className="text-white/80 hover:text-amber-400 transition-colors p-1.5 cursor-pointer"
            title="Share Experience"
          >
            <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </header>
  );
}
