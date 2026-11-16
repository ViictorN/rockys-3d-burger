# ROCKY'S — Gourmet Burgers & 3D Interactive Culinary Showcase

Interactive WebGL and editorial food showcase built with **React 19**, **Three.js / React Three Fiber**, **Tailwind CSS v4**, and **Vite 8**.

---

## Core Features

- **Dual Hero Experience (Photo / 3D WebGL):** Smooth transition via the View Transitions API between high-resolution platter cutout parallax and a real-time interactive Three.js scene (`SceneCanvas`, `PlatterGroup`, `BurgerModel`, `FryBasket`, `SteamParticles`, `AnimatedLines3D`, `IngredientCallouts`).
- **3D Camera Tour & Inspection (`TourControlBar`):** Switch between `3/4 HERO`, `TOP-DOWN`, `MACRO`, and `SIDE` camera angles, play an automated cinematic turntable tour, toggle orbital kinetic lines, or inspect ingredient callouts.
- **Burger Craft Studio (`BurgerBuilderModal`):** Build custom burgers step-by-step across artisan buns, patties, melted cheeses, fresh toppings, and signature sauces with live nutrition (`kcal`) and pricing calculations inside an accessible top-layer `<dialog closedby="any">`.
- **Exploded Layer Provenance (`ExplodedViewModal`):** Inspect 6 culinary layers with provenance details and synthesized Web Audio API sound feedback (`playClickSound`, `playWhooshSound`, `playChimeSound`, `playCrunchSound`, `playSizzleSound`).
- **Order Bag & Kitchen Tracker (`CartDrawer`):** Delivery vs. pickup switcher, promo code validation (`ROCKY10`), tip presets, live tax/total calculations, and simulated 3-step live kitchen order tracking.
- **Multi-Language Support (`EN` / `ES` / `AR`):** Dynamic UI translations with RTL support (`dir="rtl"`) when Arabic is selected.
- **Kitchens, Reservations & FAQ (`ContactsView`):** SoHo NY & DTLA flagship switcher, Google Maps links, direct WhatsApp concierge (`wa.me`) with response-time promise, accessible `<details>`/`<summary>` FAQ, and reservation form with confirmation pass.

---

## Security & Web Standards

- **Zero-Trust Edge Validation (`src/utils/securityValidation.js`):** Strict whitelist validation (`validateBookingPayload`, `validatePromoCode`), hidden bot honeypot detection, HTML/control-character sanitization (`sanitizeText`), and in-memory sliding-window rate limiting (`checkRateLimit`).
- **HTTP Security Headers (`vite.config.js`):** Configures `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy` on dev and preview servers.
- **Modern CSS & SEO:** `oklch()` / `color-mix()` tokens, CSS Container Queries (`@container`), `:user-invalid`, `field-sizing: content`, `@starting-style`, `prefers-reduced-motion`, Schema.org JSON-LD (`Restaurant` + `FAQPage`), Open Graph tags, `sitemap.xml`, `robots.txt`, and `site.webmanifest`.

---

## Getting Started

```bash
npm install
npm run dev      # Start local Vite dev server
npm run lint     # Run oxlint across the codebase
npm run build    # Build production bundle into dist/
npm run preview  # Preview the production build locally
```
