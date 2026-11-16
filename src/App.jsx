import React, { useState, useRef, useEffect, useCallback } from 'react';
import SceneCanvas from './components/SceneCanvas';
import Navbar from './components/Navbar';
import HeroLeft from './components/HeroLeft';
import HeroRight from './components/HeroRight';
import HeroBottom from './components/HeroBottom';
import TourControlBar from './components/TourControlBar';
import CartDrawer from './components/CartDrawer';
import MenuDrawer from './components/MenuDrawer';
import ShareModal from './components/ShareModal';
import SnacksView from './components/SnacksView';
import DrinksView from './components/DrinksView';
import ContactsView from './components/ContactsView';
import BurgerBuilderModal from './components/BurgerBuilderModal';
import ExplodedViewModal from './components/ExplodedViewModal';
import { BURGERS, TRANSLATIONS } from './data/burgersData';
import { playClickSound, playWhooshSound, playChimeSound } from './utils/audioEffects';
import confetti from 'canvas-confetti';
import { Box, Image as ImageIcon, ChefHat, Layers, MessageCircle, ArrowLeft, Shield } from 'lucide-react';
import './App.css';

function getInitialTab() {
  if (typeof window === 'undefined') return 'burgers';
  const hash = window.location.hash;
  if (hash === '#404') return '404';
  if (hash === '#snacks') return 'snacks';
  if (hash === '#drinks') return 'drinks';
  if (hash === '#contacts') return 'contacts';
  const path = window.location.pathname;
  if (path && path !== '/' && path !== '/index.html') return '404';
  return 'burgers';
}

function getInitialCookieConsent() {
  if (typeof window === 'undefined') return 'accepted';
  try {
    return window.localStorage.getItem('rockys_cookie_consent_v1') || '';
  } catch {
    return '';
  }
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [viewMode, setViewMode] = useState('photo');

  // 3D Inspection & Tour states
  const [tourPlaying, setTourPlaying] = useState(false);
  const [tourProgress, setTourProgress] = useState(0);
  const [activeAngle, setActiveAngle] = useState('hero');
  const [showLines, setShowLines] = useState(true);
  const [showCallouts, setShowCallouts] = useState(true);

  // Interactive drawer / modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isExplodedOpen, setIsExplodedOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cookieConsent, setCookieConsent] = useState(getInitialCookieConsent);

  // Mouse tilt parallax states
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [manualRotation, setManualRotation] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const baseRotation = useRef({ x: 0, y: 0 });
  const addToBagBtnRef = useRef(null);

  const currentBurger = BURGERS[currentIndex];
  const nextIndex = (currentIndex + 1) % BURGERS.length;
  const nextBurger = BURGERS[nextIndex];
  const thirdIndex = (currentIndex + 2) % BURGERS.length;
  const thirdBurger = BURGERS[thirdIndex];
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  const runWithViewTransition = useCallback((updateFn) => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (
      !prefersReduced &&
      typeof document !== 'undefined' &&
      typeof document.startViewTransition === 'function'
    ) {
      document.startViewTransition(updateFn);
    } else {
      updateFn();
    }
  }, []);

  const handleSelectBurger = useCallback(
    (index) => {
      if (index === currentIndex || isTransitioning) return;
      playWhooshSound();
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 450);
    },
    [currentIndex, isTransitioning]
  );

  const handleNext = useCallback(() => {
    handleSelectBurger((currentIndex + 1) % BURGERS.length);
  }, [currentIndex, handleSelectBurger]);

  const handlePrev = useCallback(() => {
    handleSelectBurger((currentIndex - 1 + BURGERS.length) % BURGERS.length);
  }, [currentIndex, handleSelectBurger]);

  const handleSelectTab = useCallback(
    (tab) => {
      playClickSound();
      const targetTab = tab === 'home' ? 'burgers' : tab;
      runWithViewTransition(() => {
        setActiveTab(targetTab);
      });
    },
    [runWithViewTransition]
  );

  // Animate automated 3D camera tour progress
  useEffect(() => {
    if (!tourPlaying || viewMode !== '3d') return undefined;
    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      setTourProgress((prev) => (prev + dt * 0.08) % 1);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [tourPlaying, viewMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      } else if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsMenuOpen(false);
        setIsShareOpen(false);
        setIsBuilderOpen(false);
        setIsExplodedOpen(false);
        if (activeTab !== 'burgers' && activeTab !== 'home') {
          setActiveTab('burgers');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, activeTab]);

  const handlePointerMove = useCallback(
    (e) => {
      const { clientX, clientY } = e;
      const normX = (clientX / window.innerWidth) * 2 - 1;
      const normY = (clientY / window.innerHeight) * 2 - 1;
      setPointerPos({ x: normX, y: normY });

      if (isDragging.current && viewMode === '3d') {
        const deltaX = (clientX - dragStart.current.x) * 0.005;
        const deltaY = (clientY - dragStart.current.y) * 0.005;
        setManualRotation({
          x: Math.max(-0.6, Math.min(0.6, baseRotation.current.x + deltaY)),
          y: baseRotation.current.y + deltaX,
        });
      }
    },
    [viewMode]
  );

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.glass-panel')) return;
    if (viewMode === '3d') {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      baseRotation.current = { ...manualRotation };
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleAddToBag = (item) => {
    playChimeSound();

    if (addToBagBtnRef.current) {
      const rect = addToBagBtnRef.current.getBoundingClientRect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ['#f59e0b', '#ea580c', '#ffffff', '#ffd166'],
      });
    }

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQty = (id, delta) => {
    playClickSound();
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveItem = (id) => {
    playClickSound();
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCookieChoice = (choice) => {
    playClickSound();
    try {
      window.localStorage.setItem('rockys_cookie_consent_v1', choice);
    } catch {
      // Ignore storage failures in strict privacy mode
    }
    setCookieConsent(choice);
  };

  const tiltX = -pointerPos.y * 6;
  const tiltY = pointerPos.x * 8;
  const transX = pointerPos.x * 14;
  const transY = pointerPos.y * 10;

  return (
    <main
      dir={currentLang === 'AR' ? 'rtl' : 'ltr'}
      className="relative w-full h-[100dvh] overflow-hidden stage-radial-aura select-none"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Atmospheric Film Grain Texture */}
      <div className="fixed inset-0 z-25 film-grain" aria-hidden="true" />

      {/* LAYER 1: GIANT BACKDROP CONDENSED TYPOGRAPHY */}
      <div className="absolute inset-x-0 top-[9vh] sm:top-[8vh] flex justify-center pointer-events-none z-10 overflow-hidden">
        <span className="font-bebas backdrop-display-title font-black text-white select-none text-center transition-all duration-500">
          {currentBurger.category || 'BURGERS'}
        </span>
      </div>

      {/* LAYER 2: HERO PLATTER (PHOTOREAL OR 3D WEBGL) */}
      {viewMode === 'photo' ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4">
          <div
            className={`relative w-[88vw] max-w-[680px] lg:max-w-[740px] xl:max-w-[780px] aspect-[4/3] flex items-center justify-center transform transition-all duration-300 ease-out ${
              isTransitioning ? 'scale-90 opacity-40 blur-[2px]' : 'scale-100 opacity-100 blur-0'
            }`}
            style={{
              transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${transX}px, ${transY + 15}px, 0)`,
              transition: isTransitioning
                ? 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                : 'transform 0.12s ease-out, opacity 0.35s ease',
            }}
          >
            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[78%] h-[20%] bg-black/95 rounded-full blur-2xl transform scale-y-45 pointer-events-none" />

            <img
              src={currentBurger.heroImage}
              alt={`${currentBurger.titleLine1} ${currentBurger.titleLine2}`}
              fetchPriority="high"
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_24px_50px_rgba(0,0,0,0.98)]"
              onError={(e) => {
                if (currentBurger.heroFallback) {
                  e.currentTarget.src = currentBurger.heroFallback;
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-20">
          <SceneCanvas
            burgerType={currentBurger.id}
            isTransitioning={isTransitioning}
            showLines={showLines}
            showCallouts={showCallouts}
            tourPlaying={tourPlaying}
            tourProgress={tourProgress}
            activeAngle={activeAngle}
            pointerPos={pointerPos}
            manualRotation={manualRotation}
          />
        </div>
      )}

      {/* LAYER 3: EDITORIAL UI OVERLAYS */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + i.qty, 0)}
        onOpenCart={() => {
          playClickSound();
          setIsCartOpen(true);
        }}
        onOpenMenu={() => {
          playClickSound();
          setIsMenuOpen(true);
        }}
        onOpenShare={() => {
          playClickSound();
          setIsShareOpen(true);
        }}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        t={t}
      />

      {activeTab === 'burgers' && (
        <>
          <HeroLeft
            burger={currentBurger}
            onAddToBag={handleAddToBag}
            buttonRef={addToBagBtnRef}
            t={t}
          />

          <HeroRight
            nextBurger={nextBurger}
            thirdBurger={thirdBurger}
            onNext={handleNext}
            onPrev={handlePrev}
          />

          <HeroBottom
            burger={currentBurger}
            burgers={BURGERS}
            currentIndex={currentIndex}
            onSelectIndex={handleSelectBurger}
            currentLang={currentLang}
            onSelectLang={(lang) => {
              playClickSound();
              setCurrentLang(lang);
            }}
          />

          {viewMode === '3d' && (
            <TourControlBar
              tourPlaying={tourPlaying}
              onToggleTour={() => {
                playClickSound();
                setTourPlaying((p) => !p);
              }}
              tourProgress={tourProgress}
              activeAngle={activeAngle}
              onSelectAngle={(angle) => {
                playClickSound();
                setTourPlaying(false);
                setActiveAngle(angle);
              }}
              showLines={showLines}
              onToggleLines={() => {
                playClickSound();
                setShowLines((v) => !v);
              }}
              showCallouts={showCallouts}
              onToggleCallouts={() => {
                playClickSound();
                setShowCallouts((v) => !v);
              }}
              onResetRotation={() => {
                playClickSound();
                setTourPlaying(false);
                setActiveAngle('hero');
                setManualRotation({ x: 0, y: 0 });
              }}
            />
          )}

          {/* Interactive Control Dock + Mobile WhatsApp Quick Concierge */}
          <div className="fixed bottom-12 right-4 sm:bottom-6 sm:right-32 z-30 pointer-events-auto flex items-center gap-2">
            <a
              href="https://wa.me/12125550192?text=Hello%20Rocky's%20Kitchen!%20I'd%20like%20to%20order%20or%20book%20a%20table."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Rocky's Concierge on WhatsApp"
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-black shadow-lg"
              title="WhatsApp Concierge"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsBuilderOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/40 hover:to-orange-500/40 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold tracking-wider uppercase transition-all duration-300 backdrop-blur-md cursor-pointer shadow-lg hover:scale-105"
              title="Build Your Own Custom Burger"
              aria-label="Open Craft Studio Custom Burger Builder"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Craft Studio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsExplodedOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-[10px] font-extrabold tracking-wider uppercase transition-all duration-300 backdrop-blur-md cursor-pointer shadow-lg hover:scale-105"
              title="Inspect 6 Artisanal Layers"
              aria-label="Inspect 6 Artisanal Layers"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Layers</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                runWithViewTransition(() => {
                  setViewMode((m) => (m === 'photo' ? '3d' : 'photo'));
                });
              }}
              className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/15 text-zinc-200 hover:text-amber-400 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 backdrop-blur-md cursor-pointer shadow-lg hover:scale-105"
              title="Toggle 3D Interactive WebGL Mode"
              aria-pressed={viewMode === '3d'}
            >
              {viewMode === 'photo' ? (
                <>
                  <Box className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.view3d || '3D Mode'}</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.viewPhoto || 'Photo Mode'}</span>
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* LAYER 4: FULL SECTION OVERLAYS */}
      {activeTab === 'snacks' && (
        <SnacksView
          onAddToBag={handleAddToBag}
          onClose={() => handleSelectTab('burgers')}
        />
      )}

      {activeTab === 'drinks' && (
        <DrinksView
          onAddToBag={handleAddToBag}
          onClose={() => handleSelectTab('burgers')}
        />
      )}

      {activeTab === 'contacts' && (
        <ContactsView
          onClose={() => handleSelectTab('burgers')}
          onShow404={() => handleSelectTab('404')}
        />
      )}

      {activeTab === '404' && (
        <section
          aria-labelledby="not-found-title"
          className="fixed inset-0 z-35 flex flex-col items-center justify-center px-6 text-center bg-[#0a0706]/96 backdrop-blur-2xl"
        >
          <span className="font-bebas text-[28vw] sm:text-[180px] leading-none text-white/10 select-none">
            404
          </span>
          <h2
            id="not-found-title"
            className="text-3xl sm:text-5xl font-black font-outfit text-white uppercase tracking-tight -mt-6"
          >
            THIS PLATE LEFT THE GRILL
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-md mt-3 mb-7 leading-relaxed">
            The route you requested could not be found in our kitchen. Return to our interactive 3D burger showcase or explore snacks & craft shakes.
          </p>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.location.hash === '#404') {
                window.history.replaceState(null, '', '/');
              }
              handleSelectTab('burgers');
            }}
            className="cta-pill-button inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Signature Burgers</span>
          </button>
        </section>
      )}

      {/* LGPD / GDPR Privacy & Cookie Notice */}
      {!cookieConsent && (
        <aside
          aria-label="Cookie and Privacy Notice"
          className="fixed bottom-16 left-4 right-4 sm:right-auto sm:left-12 lg:left-16 sm:bottom-6 sm:max-w-sm z-40 glass-panel rounded-2xl p-4 border border-white/15 shadow-2xl"
        >
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-[11px] text-zinc-300 leading-relaxed">
              <strong className="text-white uppercase tracking-wider block mb-0.5">
                Privacy & Preferences
              </strong>
              We use essential storage for your order bag and language preference. Review details in Kitchens & Privacy.
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handleCookieChoice('essential')}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-bold text-zinc-200 uppercase tracking-wider cursor-pointer"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={() => handleCookieChoice('accepted')}
              className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[10px] font-black text-black uppercase tracking-wider cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </aside>
      )}

      {/* LAYER 5: INTERACTIVE DRAWERS & TOP-LAYER DIALOGS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        t={t}
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectBurger={(idx) => {
          setActiveTab('burgers');
          handleSelectBurger(idx);
        }}
        burgers={BURGERS}
        onOpenBuilder={() => setIsBuilderOpen(true)}
        onOpenExploded={() => setIsExplodedOpen(true)}
        onOpenSection={(section) => handleSelectTab(section)}
      />

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

      <BurgerBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onAddCustomBurger={handleAddToBag}
      />

      <ExplodedViewModal
        isOpen={isExplodedOpen}
        onClose={() => setIsExplodedOpen(false)}
        burger={currentBurger}
      />
    </main>
  );
}
