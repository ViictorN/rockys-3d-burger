import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Bike, Store, ChefHat } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playChimeSound, playSizzleSound } from '../utils/audioEffects';
import { validatePromoCode, checkRateLimit } from '../utils/securityValidation';

export default function CartDrawer({
  isOpen = false,
  onClose,
  cartItems = [],
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  t,
}) {
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState('RK-4829');
  const [orderStep, setOrderStep] = useState(1);
  const [orderType, setOrderType] = useState('delivery');
  const [tipPercent, setTipPercent] = useState(15);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const rawPrice = parseFloat(item.price.replace('$', '')) || 12.9;
    return acc + rawPrice * item.qty;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const deliveryFee = orderType === 'delivery' && cartItems.length > 0 ? 2.5 : 0;
  const tax = discountedSubtotal * 0.08875;
  const tipAmount = (discountedSubtotal * tipPercent) / 100;
  const total = discountedSubtotal + deliveryFee + tax + tipAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();

    const rate = checkRateLimit('promo-apply', 6, 60000);
    if (!rate.allowed) {
      setPromoError(`Too many attempts. Try again in ${Math.ceil(rate.retryAfterMs / 1000)}s.`);
      return;
    }

    const validation = validatePromoCode(promoCode);
    if (!validation.valid) {
      setPromoError(validation.error);
      return;
    }

    if (validation.code === 'ROCKY10') {
      playChimeSound();
      setDiscountPercent(10);
      setPromoError('');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#ffffff'],
      });
    } else {
      setPromoError('Invalid code. Try ROCKY10 for 10% off');
    }
  };

  const handleCheckout = () => {
    const rate = checkRateLimit('cart-checkout', 4, 60000);
    if (!rate.allowed) {
      setPromoError('Order submission paused briefly to prevent duplicate charges.');
      return;
    }

    playSizzleSound();
    playChimeSound();
    setOrderId(`RK-${1000 + (Date.now() % 8999)}`);
    setOrdered(true);
    setOrderStep(1);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#ea580c', '#ffffff', '#ffd166'],
    });

    setTimeout(() => setOrderStep(2), 2200);
    setTimeout(() => setOrderStep(3), 4500);
  };

  const handleFinish = () => {
    onClearCart();
    setOrdered(false);
    setOrderStep(1);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md h-full bg-[#110e0c] border-l border-white/10 flex flex-col p-5 sm:p-7 shadow-2xl overflow-y-auto glass-panel">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2
              id="cart-drawer-title"
              className="text-xl sm:text-2xl font-black font-outfit text-white tracking-wide uppercase"
            >
              {t?.cartTitle || 'YOUR ORDER'}
            </h2>
            <span className="text-xs text-amber-400 font-bold tracking-wider uppercase">
              {cartItems.reduce((acc, i) => acc + i.qty, 0)} items in bag
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Order Bag"
            className="w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {ordered ? (
          <div className="flex-1 flex flex-col justify-between py-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <ChefHat className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black font-outfit text-white uppercase tracking-tight">
                ORDER #{orderId}
              </h3>
              <p className="text-xs text-zinc-300 mt-1">
                Estimated arrival: 18 - 24 minutes
              </p>
            </div>

            <div className="flex flex-col gap-5 bg-zinc-950/60 border border-white/10 rounded-2xl p-5 my-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                LIVE KITCHEN STATUS
              </span>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      orderStep >= 1
                        ? 'bg-amber-500 text-black shadow-[0_0_10px_#f59e0b]'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    ✓
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">Order Received & Ticket Printed</div>
                    <div className="text-[10px] text-zinc-400">Directly sent to SoHo grill station</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      orderStep >= 2
                        ? 'bg-amber-500 text-black shadow-[0_0_10px_#f59e0b]'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {orderStep >= 2 ? '✓' : '2'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">Sizzling On Cast Iron & Frying</div>
                    <div className="text-[10px] text-zinc-400">Patty searing at 500°F with melted cheese</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      orderStep >= 3
                        ? 'bg-emerald-500 text-black shadow-[0_0_10px_#10b981]'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {orderStep >= 3 ? '✓' : '3'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">Boxed Hot in Thermal Carrier</div>
                    <div className="text-[10px] text-zinc-400">Courier assigned & out for delivery!</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Back to Menu
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-12">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
              <X className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black font-outfit text-white uppercase">
              {t?.emptyCart || 'Your Bag is Empty'}
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs">
              Explore our chef-crafted fried chicken burgers, smash patties, or craft drinks.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between py-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-white/10 mb-4">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setOrderType('delivery');
                }}
                aria-pressed={orderType === 'delivery'}
                className={`py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Delivery ($2.50)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setOrderType('pickup');
                }}
                aria-pressed={orderType === 'pickup'}
                className={`py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Pickup (Free)</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 my-2 max-h-[34vh]">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/10 flex items-center justify-between gap-3"
                >
                  <img
                    src={item.heroImage}
                    alt={`${item.titleLine1} ${item.titleLine2 || ''}`.trim()}
                    className="w-14 h-14 object-cover rounded-lg bg-zinc-900 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black font-outfit text-white uppercase truncate">
                      {item.titleLine1} {item.titleLine2}
                    </h4>
                    <span className="text-[10px] text-zinc-400 block truncate">{item.subtitle}</span>
                    <span className="text-xs font-extrabold text-amber-400 mt-0.5 block">
                      {item.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.id, -1)}
                      aria-label={`Decrease quantity of ${item.titleLine1}`}
                      className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-extrabold text-white w-5 text-center">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.id, 1)}
                      aria-label={`Increase quantity of ${item.titleLine1}`}
                      className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.titleLine1} from bag`}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors ml-0.5 cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleApplyPromo} className="mt-3 flex gap-2">
              <div className="relative flex-1">
                <label htmlFor="cart-promo-input" className="sr-only">
                  Promo Code
                </label>
                <input
                  id="cart-promo-input"
                  type="text"
                  maxLength={16}
                  placeholder="Promo Code (ROCKY10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="rocky-field w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/15 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold uppercase transition-colors cursor-pointer"
              >
                APPLY
              </button>
            </form>
            {discountPercent > 0 && (
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                ✓ 10% Rocky's VIP Discount Applied!
              </span>
            )}
            {promoError && (
              <span role="alert" className="text-[10px] text-rose-400 font-medium mt-1 block">
                {promoError}
              </span>
            )}

            <div className="mt-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
                Staff Kitchen Tip
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[10, 15, 20, 0].map((tip) => (
                  <button
                    type="button"
                    key={tip}
                    onClick={() => {
                      playClickSound();
                      setTipPercent(tip);
                    }}
                    aria-pressed={tipPercent === tip}
                    className={`py-2 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer ${
                      tipPercent === tip
                        ? 'bg-amber-500 text-black font-black'
                        : 'bg-zinc-950 border border-white/10 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {tip === 0 ? 'None' : `${tip}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-1.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount (10%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Courier</span>
                  <span className="text-white">${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Est. Tax (8.875%)</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
              {tipPercent > 0 && (
                <div className="flex justify-between">
                  <span>Kitchen Tip ({tipPercent}%)</span>
                  <span className="text-white">${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black font-outfit text-white pt-2 border-t border-white/10 mt-1">
                <span>Total Due</span>
                <span className="text-amber-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-4 w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>{t?.checkout || 'PAY & PLACE ORDER'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
